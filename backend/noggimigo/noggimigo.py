"""Backward-compatible entrypoint for the Noggimigo session runtime."""
from __future__ import annotations
import argparse
try:
    from .noggimigo_session import NoggimigoSession
except ImportError:  # pragma: no cover
    from noggimigo_session import NoggimigoSession

class NoggimigoTutorEngine:
    """Compatibility facade retaining the original high-level tutor API."""
    def __init__(self, active_concept: str = "fractions_intro"):
        self.session = NoggimigoSession(active_concept)
        self.active_concept = active_concept
        self.session_history = self.session.history

    def set_concept(self, concept_id: str) -> bool:
        try:
            self.session.reset(concept_id)
            self.active_concept = concept_id
            return True
        except ValueError:
            return False

    def get_current_prompt(self) -> str:
        return self.session.current_prompt().get("question", self.session.current_prompt().get("message", ""))

    def evaluate_response(self, user_input: str, latency_ms: float = 0.0, brain_data=None) -> dict:
        """Evaluate deterministically; latency and brain data are intentionally ignored."""
        return self.session.request_hint() if user_input.strip().lower() in {"hint", "help", "?"} else self.session.submit(user_input)

    def run_loop(self) -> None:
        print("Noggimigo local tutor. Type 'hint', 'reset', or 'exit'.")
        while not self.session.complete:
            print(f"\n{self.get_current_prompt()}")
            answer = input("> ").strip()
            if answer.lower() == "exit": break
            if answer.lower() == "reset": self.session.reset(); continue
            result = self.evaluate_response(answer)
            print(result["feedback"])
            if result.get("next_prompt", {}).get("completed"): break

def main() -> None:
    parser = argparse.ArgumentParser(description="Run the Noggimigo local tutor")
    parser.add_argument("--lesson", default="fractions_intro")
    args = parser.parse_args()
    NoggimigoTutorEngine(args.lesson).run_loop()

if __name__ == "__main__":
    main()
