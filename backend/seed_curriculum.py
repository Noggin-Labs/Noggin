"""Idempotently import the maintained Noggimigo curriculum into SQL storage.

Run after applying migrations:
    python -m backend.seed_curriculum

Only learner-facing metadata is copied. Answer keys, hints, and misconception
rules remain in the deterministic tutoring runtime and are never exposed by
the public catalog API.
"""
from __future__ import annotations

import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import Course, Lesson
from backend.noggimigo.curriculum import CURRICULUM


def _course_id(subject: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", subject.lower()).strip("-")
    return f"{slug}-foundations"


def seed_curriculum(db: Session) -> tuple[int, int]:
    """Insert or refresh catalog metadata without duplicating existing rows."""
    grouped: dict[str, list[tuple[str, dict]]] = {}
    for lesson_id, lesson_data in CURRICULUM.items():
        grouped.setdefault(lesson_data["subject"], []).append((lesson_id, lesson_data))

    courses_created = 0
    lessons_created = 0
    for subject, subject_lessons in grouped.items():
        course_id = _course_id(subject)
        course = db.get(Course, course_id)
        if course is None:
            course = Course(
                id=course_id,
                title=f"{subject} Foundations",
                description=f"Build understanding through guided {subject.lower()} lessons.",
                subject=subject,
                is_published=True,
            )
            db.add(course)
            db.flush()
            courses_created += 1

        for position, (lesson_id, data) in enumerate(subject_lessons, start=1):
            lesson = db.get(Lesson, lesson_id)
            if lesson is None:
                lesson = Lesson(
                    id=lesson_id,
                    course_id=course_id,
                    title=data["title"],
                    position=position,
                    objective=data["objective"],
                    content={"topic": data["topic"]},
                    is_published=True,
                )
                db.add(lesson)
                lessons_created += 1
            else:
                lesson.course_id = course_id
                lesson.title = data["title"]
                lesson.position = position
                lesson.objective = data["objective"]
                lesson.content = {"topic": data["topic"]}
                lesson.is_published = True

    db.commit()
    return courses_created, lessons_created


def main() -> None:
    with SessionLocal() as db:
        courses_created, lessons_created = seed_curriculum(db)
    print(f"Curriculum sync complete: {courses_created} courses and {lessons_created} lessons created.")


if __name__ == "__main__":
    main()
