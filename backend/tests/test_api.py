from fastapi.testclient import TestClient

from backend.app import app, _sessions

client = TestClient(app)


def setup_function():
    _sessions.clear()


def test_health_reports_deterministic_runtime():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["engine"] == "NoggimigoSession"
    assert response.json()["session_storage"] == "ephemeral-process-memory"


def test_session_progression_is_deterministic():
    started = client.post("/api/sessions", json={"lesson_id": "fractions_intro"})
    assert started.status_code == 200
    payload = started.json()
    session_id = payload["session_id"]
    assert payload["prompt"]["progress"] == "1/2"

    wrong = client.post(f"/api/sessions/{session_id}/answer", json={"answer": "3/4"})
    assert wrong.status_code == 200
    assert wrong.json()["result"]["advanced"] is False
    assert wrong.json()["prompt"]["progress"] == "1/2"

    correct = client.post(f"/api/sessions/{session_id}/answer", json={"answer": "0.25"})
    assert correct.json()["result"]["advanced"] is True
    assert correct.json()["prompt"]["progress"] == "2/2"


def test_hints_do_not_advance_the_lesson():
    started = client.post("/api/sessions", json={"lesson_id": "algebra_intro"}).json()
    response = client.post(f"/api/sessions/{started['session_id']}/hint")
    assert response.status_code == 200
    assert response.json()["result"]["status"] == "HINT_REQUESTED"
    assert response.json()["prompt"]["progress"] == "1/2"


def test_unknown_lesson_and_session_are_rejected():
    assert client.post("/api/sessions", json={"lesson_id": "not-a-lesson"}).status_code == 404
    assert client.get("/api/sessions/missing").status_code == 404


def test_input_is_bounded():
    started = client.post("/api/sessions", json={"lesson_id": "fractions_intro"}).json()
    response = client.post(
        f"/api/sessions/{started['session_id']}/answer",
        json={"answer": "x" * 201},
    )
    assert response.status_code == 422
