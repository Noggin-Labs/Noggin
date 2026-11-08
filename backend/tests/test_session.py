import importlib
import json

import pytest

from answer_verifier import verify_answer
from hf_provider import HuggingFaceLocalTutor
from noggimigo_session import NoggimigoSession

def test_public_imports_and_case_sensitive_module():
    importlib.import_module("noggimigo_intent")
    importlib.import_module("noggimigo")
    importlib.import_module("LessonGenerator")

@pytest.mark.parametrize("student, expected", [("0.25", "1/4"), ("2/8", "1/4"), (" 1 / 4 ", "1/4")])
def test_equivalent_math_answers(student, expected):
    assert verify_answer(student, expected).correct

def test_invalid_fraction_and_division_by_zero_rejected():
    assert not verify_answer("1/0", "1/4").correct
    assert not verify_answer("3/4", "1/4").correct

def test_session_progression_and_incorrect_answer_cannot_advance():
    session = NoggimigoSession("fractions_intro")
    assert session.current_prompt()["progress"] == "1/2"
    bad = session.submit("3/4")
    assert bad["advanced"] is False
    assert session.current_prompt()["progress"] == "1/2"
    good = session.submit("0.25")
    assert good["advanced"] is True
    assert session.current_prompt()["progress"] == "2/2"
    assert session.submit("1/8")["completed"] is True
    assert session.complete

def test_hint_reset_and_bounded_history():
    session = NoggimigoSession(history_limit=2)
    session.request_hint()
    session.submit("bad")
    session.request_hint()
    assert len(session.history) == 2
    session.reset("algebra_intro")
    assert session.current_prompt()["progress"] == "1/2"
    assert not session.history

def test_model_failure_falls_back():
    class Broken:
        def generate(self, *args, **kwargs): raise RuntimeError("no model")
    result = NoggimigoSession(model=Broken()).submit("wrong")
    assert result["advanced"] is False and result["model_fallback"] is True

def test_mocked_model_structured_output():
    good = {
        "student_facing_message": "What operation undoes +4?",
        "pedagogical_action": "ASK_GUIDING_QUESTION",
        "misconception_candidates": [],
        "requires_verification": True,
    }
    class FakeTensor:
        shape = [1, 3]
        def to(self, device): return self
    class FakeEncoding(dict):
        def __init__(self): super().__init__({"input_ids": FakeTensor()})
        def to(self, device): return self
    class Tokenizer:
        eos_token_id = 0
        def apply_chat_template(self, *args, **kwargs): return FakeEncoding()
        def decode(self, *args, **kwargs): return json.dumps(good)
    class Model:
        device = "cpu"
        def eval(self): pass
        def generate(self, **kwargs):
            class Output:
                def __getitem__(self, index): return [0, 0, 0, 4, 5]
            return Output()
    tutor = HuggingFaceLocalTutor(loader=lambda _: (Tokenizer(), Model()))
    assert tutor.generate("q", "a") == good