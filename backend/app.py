"""HTTP adapter for the deterministic Noggimigo tutoring runtime.

Noggimigo sessions remain process-local and ephemeral. The curriculum catalog
is served from the relational database and populated explicitly with
`python -m backend.seed_curriculum` after migrations.
"""
from __future__ import annotations

import os
from threading import Lock
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.database import get_db
from backend.models import Course
from backend.noggimigo.curriculum import CURRICULUM
from backend.noggimigo.noggimigo_session import NoggimigoSession

app = FastAPI(title="Noggin · Noggimigo API", version="0.2.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "NOGGIN_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type"],
)

_sessions: dict[str, NoggimigoSession] = {}
_sessions_lock = Lock()
_model = None


class StartSessionRequest(BaseModel):
    lesson_id: str = Field(default="fractions_intro", min_length=1, max_length=80)


class AnswerRequest(BaseModel):
    answer: str = Field(min_length=1, max_length=200)


class ResetRequest(BaseModel):
    lesson_id: str | None = Field(default=None, max_length=80)


def _get_model():
    """Load the optional local model only when explicitly enabled."""
    global _model
    if os.getenv("NOGGIMIGO_ENABLE_LOCAL_MODEL", "0").lower() not in {"1", "true", "yes"}:
        return None
    if _model is None:
        from backend.noggimigo.hf_provider import HuggingFaceLocalTutor
        _model = HuggingFaceLocalTutor(
            model_id=os.getenv("NOGGIMIGO_MODEL_ID", "Qwen/Qwen3-0.6B"),
            max_new_tokens=180,
        )
    return _model


def _session_or_404(session_id: str) -> NoggimigoSession:
    with _sessions_lock:
        session = _sessions.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Noggimigo session not found.")
    return session


def _session_payload(session_id: str, session: NoggimigoSession) -> dict:
    return {
        "session_id": session_id,
        "lesson_id": session.lesson_id,
        "lesson": {
            "title": session.lesson["title"],
            "subject": session.lesson["subject"],
            "topic": session.lesson["topic"],
            "objective": session.lesson["objective"],
        },
        "prompt": session.current_prompt(),
        "model_enabled": session.model is not None,
    }


def _course_summary(course: Course) -> dict:
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "subject": course.subject,
        "lesson_count": sum(1 for lesson in course.lessons if lesson.is_published),
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "engine": "NoggimigoSession",
        "model_enabled": os.getenv("NOGGIMIGO_ENABLE_LOCAL_MODEL", "0").lower() in {"1", "true", "yes"},
        "session_storage": "ephemeral-process-memory",
    }


@app.get("/api/catalog/courses")
def list_courses(db: Session = Depends(get_db)):
    """List published courses persisted in the database."""
    statement = (
        select(Course)
        .where(Course.is_published.is_(True))
        .options(selectinload(Course.lessons))
        .order_by(Course.subject, Course.title)
    )
    courses = db.scalars(statement).all()
    return [_course_summary(course) for course in courses]


@app.get("/api/catalog/courses/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db)):
    """Return one published course and its published lessons."""
    statement = (
        select(Course)
        .where(Course.id == course_id, Course.is_published.is_(True))
        .options(selectinload(Course.lessons))
    )
    course = db.scalar(statement)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found.")
    lessons = sorted(
        (lesson for lesson in course.lessons if lesson.is_published),
        key=lambda lesson: lesson.position,
    )
    return {
        **_course_summary(course),
        "lessons": [
            {
                "id": lesson.id,
                "title": lesson.title,
                "position": lesson.position,
                "objective": lesson.objective,
                "topic": lesson.content.get("topic", ""),
            }
            for lesson in lessons
        ],
    }


@app.get("/api/lessons")
def lessons():
    """Legacy Noggimigo lesson index; tutoring sessions still use this registry."""
    return [
        {"id": lesson_id, "title": lesson["title"], "subject": lesson["subject"], "topic": lesson["topic"]}
        for lesson_id, lesson in CURRICULUM.items()
    ]


@app.post("/api/sessions")
def start_session(request: StartSessionRequest):
    if request.lesson_id not in CURRICULUM:
        raise HTTPException(status_code=404, detail="Unknown Noggimigo lesson.")
    session_id = uuid4().hex
    try:
        session = NoggimigoSession(request.lesson_id, model=_get_model())
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Noggimigo could not start this lesson.") from exc
    with _sessions_lock:
        _sessions[session_id] = session
    return _session_payload(session_id, session)


@app.get("/api/sessions/{session_id}")
def get_session(session_id: str):
    return _session_payload(session_id, _session_or_404(session_id))


@app.post("/api/sessions/{session_id}/answer")
def submit_answer(session_id: str, request: AnswerRequest):
    session = _session_or_404(session_id)
    result = session.submit(request.answer)
    return {"result": result, **_session_payload(session_id, session)}


@app.post("/api/sessions/{session_id}/hint")
def request_hint(session_id: str):
    session = _session_or_404(session_id)
    result = session.request_hint()
    return {"result": result, **_session_payload(session_id, session)}


@app.post("/api/sessions/{session_id}/reset")
def reset_session(session_id: str, request: ResetRequest):
    session = _session_or_404(session_id)
    try:
        session.reset(request.lesson_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail="Unknown Noggimigo lesson.") from exc
    return _session_payload(session_id, session)


@app.delete("/api/sessions/{session_id}", status_code=204)
def delete_session(session_id: str):
    """Explicitly discard an ephemeral tutoring session."""
    with _sessions_lock:
        removed = _sessions.pop(session_id, None)
    if removed is None:
        raise HTTPException(status_code=404, detail="Noggimigo session not found.")
    return Response(status_code=204)
