from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine

from backend.app import app
from backend.database import get_db, create_schema_for_tests
from backend.seed_curriculum import seed_curriculum


def test_catalog_reads_persisted_courses_and_lessons_without_answer_keys():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    create_schema_for_tests(engine)

    def override_get_db():
        with Session(engine) as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    try:
        with Session(engine) as db:
            assert seed_curriculum(db) == (4, 8)
            # A second sync is idempotent and creates no duplicate rows.
            assert seed_curriculum(db) == (0, 0)

        client = TestClient(app)
        courses = client.get("/api/catalog/courses")
        assert courses.status_code == 200
        assert len(courses.json()) == 4

        math_course = client.get("/api/catalog/courses/mathematics-foundations")
        assert math_course.status_code == 200
        payload = math_course.json()
        assert payload["lesson_count"] == 4
        assert payload["lessons"][0]["id"] == "fractions_intro"
        assert "answer" not in payload["lessons"][0]
        assert "hint" not in payload["lessons"][0]
    finally:
        app.dependency_overrides.pop(get_db, None)
        engine.dispose()


def test_catalog_hides_unpublished_courses_and_returns_404_for_unknown_course():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    create_schema_for_tests(engine)

    def override_get_db():
        with Session(engine) as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    try:
        client = TestClient(app)
        assert client.get("/api/catalog/courses").json() == []
        assert client.get("/api/catalog/courses/not-real").status_code == 404
    finally:
        app.dependency_overrides.pop(get_db, None)
        engine.dispose()
