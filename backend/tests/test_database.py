import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from backend.models import Base, Course, Enrollment, Learner, Lesson, LessonProgress

@pytest.fixture
def db():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    Base.metadata.drop_all(engine)
    engine.dispose()

def test_persists_course_enrollment_and_progress_relationships(db):
    learner = Learner(display_name="Sample learner")
    course = Course(id="math-foundations", title="Math Foundations", subject="Mathematics")
    lesson = Lesson(id="fractions-intro", course=course, title="Fractions", position=1,
                    objective="Represent a fraction.", content={"type": "text"})
    enrollment = Enrollment(learner=learner, course=course)
    progress = LessonProgress(learner=learner, lesson=lesson, status="in_progress")
    db.add_all([learner, course, lesson, enrollment, progress])
    db.commit()

    loaded = db.get(Learner, learner.id)
    assert loaded is not None
    assert loaded.enrollments[0].course.title == "Math Foundations"
    assert loaded.lesson_progress[0].lesson.id == "fractions-intro"
    assert loaded.lesson_progress[0].status == "in_progress"

def test_duplicate_enrollment_is_rejected(db):
    learner = Learner()
    course = Course(id="math", title="Math", subject="Mathematics")
    db.add_all([learner, course])
    db.flush()
    db.add_all([Enrollment(learner=learner, course=course), Enrollment(learner=learner, course=course)])
    with pytest.raises(IntegrityError):
        db.commit()

def test_lesson_position_must_be_unique_within_course(db):
    course = Course(id="math", title="Math", subject="Mathematics")
    db.add(course)
    db.flush()
    db.add_all([
        Lesson(id="one", course=course, title="One", position=1),
        Lesson(id="two", course=course, title="Two", position=1),
    ])
    with pytest.raises(IntegrityError):
        db.commit()
