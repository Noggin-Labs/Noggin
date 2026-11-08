"""
Noggimigo AI - Adaptive Lesson Generator
Improved version with better architecture, type safety, error handling,
and extensibility for special education accommodations.
"""

import json
import os
import random
import sys
from dataclasses import dataclass, field, asdict
from enum import Enum, auto
from typing import Callable, Optional, Union
from pathlib import Path


class DisabilityProfile(Enum):
    """Supported learning disability profiles with their accommodation strategies."""
    GENERAL = "general"
    ADHD = "adhd"
    AUTISM = "autism"
    DYSLEXIA = "dyslexia"


@dataclass(frozen=True)
class AccommodationSettings:
    """Immutable configuration for learning accommodations."""
    chunk_size: int = 3
    reward_frequency: str = "normal"
    timer_enabled: bool = False
    visual_cues: bool = False
    predictable_layout: bool = False
    literal_language: bool = False
    explicit_hints: bool = False
    font_spacing: str = "normal"
    reading_grade_level: str = "standard"
    audio_speech_hook: bool = False
    standard: bool = False

    def to_dict(self) -> dict:
        """Return only non-default values for cleaner output."""
        return {k: v for k, v in asdict(self).items() if v is not False and v != "normal" and v != "standard"}


@dataclass
class LessonNode:
    """Represents a single interactive step in a lesson."""
    node_id: str
    prompt: str
    target_value: str
    options: list[str]
    transitions: dict[str, str]
    micro_scaffold: str = ""
    numeric_val: Optional[float] = None
    common_errors: dict[str, tuple[str, str]] = field(default_factory=dict)
    next_node: str = "complete"


@dataclass
class LessonPlan:
    """Complete lesson structure with metadata."""
    domain: str
    grade_level: int
    disability_profile: str
    accommodations: dict
    initial_node: str
    nodes: dict[str, LessonNode]
    is_fallback: bool = False


class DisabilityScaffoldAdapter:
    """
    Adapts lesson content for specific learning profiles using
    evidence-based instructional design principles.
    """

    # Profile-specific prompt prefixes and formatting
    _PROMPT_STYLES = {
        DisabilityProfile.ADHD: ("⚡ Quick Step", " [Focus Goal: 1 step at a time!]"),
        DisabilityProfile.AUTISM: ("📌 Step-by-Step Guide", " (Direct Task)"),
        DisabilityProfile.DYSLEXIA: ("📖", ""),
        DisabilityProfile.GENERAL: ("", ""),
    }

    # Maximum words for dyslexia profile to reduce cognitive load
    _DYSLEXIA_MAX_WORDS = 12

    @classmethod
    def adapt_prompt(cls, text: str, profile: Union[str, DisabilityProfile]) -> str:
        """Adapt text presentation based on learner profile."""
        profile = cls._normalize_profile(profile)
        prefix, suffix = cls._PROMPT_STYLES.get(profile, ("", ""))

        if profile == DisabilityProfile.DYSLEXIA:
            return cls._simplify_for_dyslexia(text, prefix)
        if profile == DisabilityProfile.GENERAL:
            return text

        return f"{prefix}: {text}{suffix}" if prefix else text

    @classmethod
    def generate_accommodations(cls, profile: Union[str, DisabilityProfile]) -> dict:
        """Generate appropriate accommodation settings for profile."""
        profile = cls._normalize_profile(profile)

        configs = {
            DisabilityProfile.ADHD: AccommodationSettings(
                chunk_size=1,
                reward_frequency="high",
                visual_cues=True,
            ),
            DisabilityProfile.AUTISM: AccommodationSettings(
                predictable_layout=True,
                literal_language=True,
                explicit_hints=True,
            ),
            DisabilityProfile.DYSLEXIA: AccommodationSettings(
                font_spacing="wide",
                reading_grade_level="simplified",
                audio_speech_hook=True,
            ),
            DisabilityProfile.GENERAL: AccommodationSettings(standard=True),
        }

        return configs.get(profile, AccommodationSettings()).to_dict()

    @classmethod
    def _normalize_profile(cls, profile: Union[str, DisabilityProfile]) -> DisabilityProfile:
        """Convert string to enum safely."""
        if isinstance(profile, DisabilityProfile):
            return profile
        try:
            return DisabilityProfile(profile.lower().strip())
        except ValueError:
            return DisabilityProfile.GENERAL

    @classmethod
    def _simplify_for_dyslexia(cls, text: str, prefix: str) -> str:
        """Reduce text complexity: shorter sentences, clear structure."""
        words = text.split()
        if len(words) <= cls._DYSLEXIA_MAX_WORDS:
            simplified = text
        else:
            # Break at sentence boundary if possible
            sentences = text.replace('! ', '|').replace('. ', '|').replace('? ', '|').split('|')
            simplified = sentences[0] if sentences[0] else " ".join(words[:cls._DYSLEXIA_MAX_WORDS]) + "..."

        return f"{prefix} {simplified}".strip()


class MathProblemGenerator:
    """Generates mathematically sound problems with validated constraints."""

    @staticmethod
    def generate_fraction_problem() -> dict:
        """Generate a valid fraction problem with non-trivial solution."""
        # Ensure we have meaningful numbers (avoid trivial 0 or same values)
        denominators = [4, 6, 8, 10, 12]
        total = random.choice(denominators)
        part = random.randint(1, total - 1)
        # Ensure remainder is not 0 and problem is non-trivial
        while part == 0 or part == total:
            part = random.randint(1, total - 1)
        rem = total - part
        return {
            "total": total,
            "part": part,
            "remainder": rem,
            "fraction": f"{rem}/{total}",
            "decimal": round(rem / total, 3),
        }

    @staticmethod
    def generate_linear_equation() -> dict:
        """Generate solvable linear equation ax + b = c with integer solution."""
        a = random.randint(2, 5)
        x = random.randint(2, 8)  # Ensure x > 1 for non-trivial problems
        b = random.randint(2, 8)
        c = (a * x) + b
        return {
            "a": a,
            "b": b,
            "c": c,
            "x": x,
            "first_step": f"subtract {b}",
        }


class LessonGenerator:
    """
    Procedurally generates validated adaptive lessons with proper
    error handling and mathematical correctness checks.
    """

    def __init__(self):
        self._problem_generators = {
            "math_fractions": MathProblemGenerator.generate_fraction_problem,
            "math_algebra": MathProblemGenerator.generate_linear_equation,
        }
        self._builders = {
            "math_fractions": self._build_fraction_node,
            "math_algebra": self._build_algebra_node,
        }

    def generate_procedural_lesson(
        self,
        domain: str = "math_fractions",
        grade_level: int = 4,
        disability_profile: Union[str, DisabilityProfile] = DisabilityProfile.GENERAL,
        num_nodes: int = 2,
    ) -> LessonPlan:
        """
        Generate complete adaptive lesson with validation and fallbacks.
        """
        try:
            if domain not in self._builders:
                raise ValueError(f"Unknown domain: {domain}. Available: {list(self._builders.keys())}")

            if num_nodes < 1:
                raise ValueError("num_nodes must be at least 1")

            nodes = {}
            for i in range(1, num_nodes + 1):
                node_id = f"step_{i}"
                next_node_id = "complete" if i == num_nodes else f"step_{i+1}"

                problem_data = self._problem_generators[domain]()
                node = self._builders[domain](
                    node_id=node_id,
                    next_node_id=next_node_id,
                    problem_data=problem_data,
                    disability_profile=disability_profile,
                )
                nodes[node_id] = node

            return LessonPlan(
                domain=domain,
                grade_level=grade_level,
                disability_profile=str(disability_profile),
                accommodations=DisabilityScaffoldAdapter.generate_accommodations(disability_profile),
                initial_node="step_1",
                nodes=nodes,
            )

        except Exception as e:
            # Log error for debugging but return functional fallback
            print(f"[WARNING] Lesson generation failed: {e}. Returning fallback.", file=sys.stderr)
            return self._create_fallback(domain, disability_profile)

    def _build_fraction_node(
        self,
        node_id: str,
        next_node_id: str,
        problem_data: dict,
        disability_profile: Union[str, DisabilityProfile],
    ) -> LessonNode:
        """Construct a fraction lesson node with distractor analysis."""
        total = problem_data["total"]
        part = problem_data["part"]
        rem = problem_data["remainder"]

        raw_text = (
            f"Imagine a circle split into {total} equal parts. "
            f"You shade in {part} parts. What fraction is left unshaded?"
        )

        target = problem_data["fraction"]
        options = [target, f"{part}/{total}", f"1/{total}"]
        random.shuffle(options)

        # Build error feedback based on common misconceptions
        common_errors = {}
        if f"{part}/{total}" in options:
            common_errors[f"{part}/{total}"] = (
                "INVERSION_ERROR",
                f"{part}/{total} is the shaded portion! We want unshaded parts ({rem}).",
            )
        if f"1/{total}" in options:
            common_errors[f"1/{total}"] = (
                "UNIT_ERROR",
                f"Look at total unshaded parts ({rem}), not just 1 piece.",
            )

        return LessonNode(
            node_id=node_id,
            prompt=DisabilityScaffoldAdapter.adapt_prompt(raw_text, disability_profile),
            target_value=target,
            options=options,
            transitions={opt: next_node_id if opt == target else node_id for opt in options},
            micro_scaffold=f"Subtract shaded parts ({part}) from total parts ({total}). Remaining = {rem}.",
            numeric_val=problem_data["decimal"],
            common_errors=common_errors,
            next_node=next_node_id,
        )

    def _build_algebra_node(
        self,
        node_id: str,
        next_node_id: str,
        problem_data: dict,
        disability_profile: Union[str, DisabilityProfile],
    ) -> LessonNode:
        """Construct an algebra lesson node with step-by-step scaffolding."""
        a, b, c = problem_data["a"], problem_data["b"], problem_data["c"]

        raw_text = f"Solve for x: {a}x + {b} = {c}. What operation isolates {a}x?"
        target = problem_data["first_step"]
        options = [target, f"add {b}", f"divide {a}"]
        random.shuffle(options)

        common_errors = {
            f"add {b}": (
                "INVERSE_ERROR",
                f"Adding {b} increases the constant! Use subtraction to undo +{b}.",
            ),
            f"divide {a}": (
                "ORDER_ERROR",
                f"Subtract the constant {b} first, then divide by {a}.",
            ),
        }

        return LessonNode(
            node_id=node_id,
            prompt=DisabilityScaffoldAdapter.adapt_prompt(raw_text, disability_profile),
            target_value=target,
            options=options,
            transitions={opt: next_node_id if opt == target else node_id for opt in options},
            micro_scaffold=f"To undo +{b}, perform inverse operation: subtract {b} from both sides.",
            common_errors=common_errors,
            next_node=next_node_id,
        )

    def _create_fallback(
        self,
        domain: str,
        disability_profile: Union[str, DisabilityProfile],
    ) -> LessonPlan:
        """Reliable fallback when procedural generation fails."""
        prompt = DisabilityScaffoldAdapter.adapt_prompt(
            "Imagine a circle split into 4 equal parts. You shade in 3 parts. What fraction of the circle is left unshaded?",
            disability_profile,
        )

        node = LessonNode(
            node_id="step_1",
            prompt=prompt,
            target_value="1/4",
            options=["1/4", "3/4", "1/2"],
            transitions={"1/4": "complete", "3/4": "step_1", "1/2": "step_1"},
            micro_scaffold="Subtract shaded parts (3) from total (4).",
            numeric_val=0.25,
            common_errors={
                "3/4": ("INVERSION_ERROR", "3/4 is shaded! Unshaded is 1/4."),
                "1/2": ("HALVING_ERROR", "Count the unshaded parts carefully."),
            },
            next_node="complete",
        )

        return LessonPlan(
            domain=domain,
            grade_level=4,
            disability_profile=str(disability_profile),
            accommodations=DisabilityScaffoldAdapter.generate_accommodations(disability_profile),
            initial_node="step_1",
            nodes={"step_1": node},
            is_fallback=True,
        )


class NogginLessonBuilder:
    """
    Interactive CLI for building custom lesson content with
    improved UX and data validation.
    """

    def __init__(self):
        self.lesson_data: dict[str, dict] = {}
        self.generator = LessonGenerator()

    def create_node(self) -> None:
        """Interactive node creation with validation."""
        print("\n" + "─" * 40)
        print("   CREATE NEW LESSON NODE")
        print("─" * 40)

        node_id = self._get_input("Node ID (e.g., 'intro', 'stuck_half'): ", required=True)
        if node_id in self.lesson_data:
            overwrite = input(f"Node '{node_id}' exists. Overwrite? (y/n): ").lower().strip() == 'y'
            if not overwrite:
                print("Cancelled.")
                return

        text = self._get_input("Noggimigo's Question or Explanation:\n> ", required=True)

        options, transitions = self._collect_options(node_id)

        self.lesson_data[node_id] = {
            "text": text,
            "options": options,
            "transitions": transitions,
        }
        print(f"\n✅ Node '{node_id}' saved! ({len(options)} option(s))")

    def _collect_options(self, node_id: str) -> tuple[list[str], dict[str, str]]:
        """Collect choice options with validation."""
        options: list[str] = []
        transitions: dict[str, str] = {}

        print("\nAdd choice buttons (type 'done' when finished):")
        while True:
            choice = self._get_input("Option text (e.g., '1/4'): ", allow_done=bool(options))
            if choice == 'done':
                break

            # Prevent duplicate options
            if choice in options:
                print("   ⚠️ This option already exists. Use a unique value.")
                continue

            target = self._get_input(f"Target node for '{choice}': ", required=True)
            options.append(choice)
            transitions[choice] = target
            print(f"   ✅ '{choice}' → {target}")

        return options, transitions

    def export_to_json(self) -> None:
        """Export with safe file handling and path validation."""
        if not self.lesson_data:
            print("⚠️ No nodes to export. Create some content first!")
            return

        filename = self._get_input("Filename (e.g., 'fractions_lesson.json'): ", required=True)
        if not filename.endswith('.json'):
            filename += '.json'

        # Security: restrict to current directory
        filepath = Path(filename).name
        full_path = Path.cwd() / filepath

        try:
            with open(full_path, 'w', encoding='utf-8') as f:
                json.dump(self.lesson_data, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Saved: {full_path}")
            print(f"   {len(self.lesson_data)} node(s) exported")
        except (OSError, PermissionError) as e:
            print(f"❌ Save failed: {e}")

    def generate_adaptive_lesson(self) -> None:
        """Generate procedurally with profile selection."""
        print("\nAvailable profiles: adhd, autism, dyslexia, general")
        profile = self._get_input("Enter profile: ", default="general")

        try:
            lesson = self.generator.generate_procedural_lesson(disability_profile=profile)
            print("\n" + "─" * 40)
            print("GENERATED ADAPTIVE LESSON")
            print("─" * 40)

            # Pretty print with structure
            output = {
                "domain": lesson.domain,
                "grade_level": lesson.grade_level,
                "disability_profile": lesson.disability_profile,
                "accommodations": lesson.accommodations,
                "is_fallback": lesson.is_fallback,
                "initial_node": lesson.initial_node,
                "nodes": {
                    nid: {
                        "prompt": node.prompt,
                        "target_value": node.target_value,
                        "options": node.options,
                        "micro_scaffold": node.micro_scaffold,
                        "next_node": node.next_node,
                    }
                    for nid, node in lesson.nodes.items()
                },
            }
            print(json.dumps(output, indent=2, ensure_ascii=False))

            # Offer to save
            save = input("\nSave this lesson to file? (y/n): ").lower().strip() == 'y'
            if save:
                self.lesson_data = output["nodes"]
                self.export_to_json()

        except Exception as e:
            print(f"❌ Generation error: {e}")

    def _get_input(
        self,
        prompt: str,
        required: bool = False,
        default: Optional[str] = None,
        allow_done: bool = False,
    ) -> str:
        """Robust input helper with validation."""
        while True:
            value = input(prompt).strip()
            if value.lower() == 'done' and allow_done:
                return 'done'
            if not value and required:
                print("   ⚠️ This field is required.")
                continue
            if not value and default is not None:
                return default
            return value

    def main_menu(self) -> None:
        """Main interaction loop."""
        commands = {
            "1": ("Add Node", self.create_node),
            "2": ("Export to JSON", self.export_to_json),
            "3": ("Generate Adaptive Lesson", self.generate_adaptive_lesson),
            "4": ("View Current Nodes", self._view_nodes),
            "5": ("Clear All Nodes", self._clear_nodes),
            "0": ("Exit", self._exit),
        }

        while True:
            print("\n" + "=" * 40)
            print("   NOGGIMIGO LESSON BUILDER")
            print("=" * 40)
            for key, (label, _) in commands.items():
                print(f"{key}. {label}")
            print("─" * 40)

            choice = input("Select: ").strip()
            if choice in commands:
                _, action = commands[choice]
                if action() is False:  # Exit returns False
                    break
            else:
                print("⚠️ Invalid choice.")

    def _view_nodes(self) -> None:
        """Display current lesson structure."""
        if not self.lesson_data:
            print("No nodes created yet.")
            return
        print(f"\nCurrent nodes ({len(self.lesson_data)}):")
        for nid, data in self.lesson_data.items():
            opts = len(data.get("options", []))
            print(f"  • {nid}: {opts} option(s)")

    def _clear_nodes(self) -> None:
        """Clear with confirmation."""
        if not self.lesson_data:
            print("Nothing to clear.")
            return
        confirm = input("Delete all nodes? (type 'yes'): ").strip().lower()
        if confirm == 'yes':
            self.lesso