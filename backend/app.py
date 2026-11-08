"""HTTP adapter for the deterministic Noggimigo tutoring runtime.

Sessions are process-local and ephemeral. Do not send learner identifiers or
sensitive records to this service. Model-generated text is optional and remains
subject to the deterministic session and pedagogy validators.
"""
from __future__ import annotations

import os
from threading import Lock
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.noggimigo.curriculum import CURRICULUM
from backend.noggimigo.noggimigo_session import NoggimigoSession

app = FastAPI(title="Noggin · Noggimigo API", version="0.1.0")

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
    allow_methods=["GET", "POST"],
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


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "engine": "NoggimigoSession",
        "model_enabled": os.getenv("NOGGIMIGO_ENABLE_LOCAL_MODEL", "0").lower() in {"1", "true", "yes"},
        "session_storage": "ephemeral-process-memory",
    }


@app.get("/api/lessons")
def lessons():
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
