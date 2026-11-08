import json
import unittest

from hf_provider import HuggingFaceLocalTutor, ModelOutputError, build_messages, parse_model_output

GOOD = {
    "student_facing_message": "What operation would undo adding 4?",
    "pedagogical_action": "ASK_GUIDING_QUESTION",
    "misconception_candidates": [],
    "requires_verification": True,
}

class ProviderContractTests(unittest.TestCase):
    def test_prompt_has_no_profile_inference_instruction(self):
        messages = build_messages("Solve 2x + 4 = 10", "I think 8")
        self.assertEqual(messages[0]["role"], "system")
        self.assertIn("Never infer or diagnose", messages[0]["content"])
        self.assertIn("I think 8", messages[1]["content"])

    def test_valid_json_is_accepted(self):
        self.assertEqual(parse_model_output(json.dumps(GOOD)), GOOD)

    def test_fenced_json_is_accepted(self):
        fenced = chr(96) * 3 + "json\n" + json.dumps(GOOD) + "\n" + chr(96) * 3
        self.assertEqual(parse_model_output(fenced), GOOD)

    def test_invalid_action_is_rejected(self):
        bad = dict(GOOD, pedagogical_action="GIVE_FINAL_ANSWER")
        with self.assertRaises(ModelOutputError):
            parse_model_output(json.dumps(bad))

    def test_extra_keys_are_rejected(self):
        bad = dict(GOOD, confidence=0.99)
        with self.assertRaises(ModelOutputError):
            parse_model_output(json.dumps(bad))

    def test_fake_loader_proves_lazy_integration_without_model_download(self):
        class FakeTensor:
            shape = [1, 3]
            def to(self, device): return self

        class FakeEncoding(dict):
            def __init__(self):
                super().__init__({"input_ids": FakeTensor()})
            def to(self, device): return self

        class FakeTokenizer:
            eos_token_id = 0
            def apply_chat_template(self, *args, **kwargs): return FakeEncoding()
            def decode(self, *args, **kwargs): return json.dumps(GOOD)

        class FakeModel:
            device = "cpu"
            def eval(self): pass
            def generate(self, **kwargs):
                class FakeOutput:
                    def __getitem__(self, index): return [0, 0, 0, 4, 5]
                return FakeOutput()

        tutor = HuggingFaceLocalTutor(loader=lambda _: (FakeTokenizer(), FakeModel()))
        self.assertEqual(tutor.generate("Prompt", "Response"), GOOD)

if __name__ == "__main__":
    unittest.main()