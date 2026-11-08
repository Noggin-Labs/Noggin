from noggimigo_session import NoggimigoSession

class Model:
    def __init__(self, message, action="ASK_GUIDING_QUESTION", fail=False):
        self.message=message; self.action=action; self.fail=fail
    def generate(self,*args,**kwargs):
        if self.fail: raise RuntimeError("inference unavailable")
        return {"student_facing_message":self.message,"pedagogical_action":self.action,"misconception_candidates":[],"requires_verification":True}

def test_hf_session_rejects_expected_answer_leakage():
    result=NoggimigoSession(model=Model("The answer is 1/4.")).submit("3/4")
    assert result["model_fallback"] is True and "model_message" not in result

def test_hf_session_preserves_verifier_and_progression():
    session=NoggimigoSession(model=Model("What does the denominator represent?"))
    result=session.submit("3/4")
    assert result["status"]=="INCORRECT" and result["advanced"] is False
    assert session.current_prompt()["progress"]=="1/2"

def test_hf_session_provider_failure_falls_back():
    result=NoggimigoSession(model=Model("",fail=True)).submit("3/4")
    assert result["model_fallback"] is True and result["advanced"] is False
