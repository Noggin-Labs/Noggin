"""Deterministic lesson graph used by Noggimigo.

This module is maintained with the Noggin application curriculum. Answers are
checked by answer_verifier.py; model output never controls progression.
"""
from __future__ import annotations

from typing import Any

CURRICULUM: dict[str, dict[str, Any]] = {
    "fractions_intro": {
        "subject": "Mathematics",
        "topic": "Fractions",
        "title": "What Exactly Is a Fraction?",
        "objective": "Represent equal parts of a whole as a fraction.",
        "nodes": [
            {
                "id": "fraction_parts",
                "question": "A whole is split into 4 equal parts. One part is shaded. What fraction is shaded?",
                "answer": "1/4",
                "hint": "The denominator counts all equal parts. The numerator counts the shaded parts.",
                "misconceptions": {"3/4": "That counts the unshaded parts. How many parts are shaded?"},
                "next": "fraction_equivalence",
            },
            {
                "id": "fraction_decimal",
                "question": "Which fraction is equal to 0.125?",
                "answer": "1/8",
                "hint": "Write 0.125 as 125/1000, then simplify by dividing top and bottom by 125.",
                "misconceptions": {},
                "next": "complete",
            },
        ],
    },
    "equivalent_fractions": {
        "subject": "Mathematics",
        "topic": "Equivalent fractions",
        "title": "Fractions That Look Different",
        "objective": "Recognise equivalent fractions.",
        "nodes": [
            {
                "id": "equivalent_half",
                "question": "Which fraction is equivalent to one half?",
                "answer": "2/4",
                "hint": "Multiply the numerator and denominator of 1/2 by the same number.",
                "misconceptions": {"1/3": "Try keeping the value the same by scaling both parts equally."},
                "next": "complete",
            }
        ],
    },
    "algebra_intro": {
        "subject": "Mathematics",
        "topic": "Equations",
        "title": "The Balance of an Equation",
        "objective": "Use inverse operations to solve a one-step equation.",
        "nodes": [
            {
                "id": "inverse_operation",
                "question": "If x + 3 = 8, what is x?",
                "answer": "5",
                "hint": "What operation undoes adding 3? Apply it to both sides.",
                "misconceptions": {"11": "Adding 3 again moves away from isolating x. Try the inverse operation."},
                "next": "check_solution",
            },
            {
                "id": "check_solution",
                "question": "Check the equation x + 3 = 8. What is 5 + 3?",
                "answer": "8",
                "hint": "Substitute 5 for x and evaluate the left side.",
                "misconceptions": {},
                "next": "complete",
            },
        ],
    },
    "photosynthesis_intro": {
        "subject": "Science",
        "topic": "Photosynthesis",
        "title": "How Plants Capture Sunlight",
        "objective": "Identify the energy source for photosynthesis.",
        "nodes": [
            {
                "id": "photosynthesis_energy",
                "question": "Which source provides the energy for photosynthesis?",
                "answer": "Sunlight",
                "hint": "Think about the energy captured by chlorophyll in leaves.",
                "misconceptions": {"soil": "Soil provides minerals and support, but what supplies the energy?"},
                "next": "complete",
            }
        ],
    },
    "circuits_intro": {
        "subject": "Science",
        "topic": "Electric circuits",
        "title": "A Complete Electric Circuit",
        "objective": "Explain why a circuit needs a complete conducting path.",
        "nodes": [
            {
                "id": "closed_circuit",
                "question": "What must happen for a simple electric circuit to work?",
                "answer": "The path must be complete",
                "hint": "Trace a continuous route from one battery terminal and back to the other.",
                "misconceptions": {"The switch must be open": "An open switch breaks the path. What closes the route?"},
                "next": "complete",
            }
        ],
    },
    "phonics_intro": {
        "subject": "English",
        "topic": "Phonemes",
        "title": "Hear the Parts in a Word",
        "objective": "Count the distinct phonemes in a spoken word.",
        "nodes": [
            {
                "id": "ship_phonemes",
                "question": "How many distinct sounds (phonemes) are in the spoken word “ship”?",
                "answer": "3",
                "hint": "The letters s and h work together to represent one sound.",
                "misconceptions": {"4": "Count sounds rather than individual letters. The first two letters make one sound."},
                "next": "complete",
            }
        ],
    },
    "emotion_compass_intro": {
        "subject": "Life skills",
        "topic": "Emotional vocabulary",
        "title": "Name It to Understand It",
        "objective": "Identify a useful first step for understanding a feeling.",
        "nodes": [
            {
                "id": "name_a_feeling",
                "question": "What is a useful first step when a feeling seems confusing?",
                "answer": "Name the feeling without judging it",
                "hint": "Start with curiosity. You do not have to decide whether a feeling is good or bad.",
                "misconceptions": {},
                "next": "complete",
            }
        ],
    },
    "ratios_proportions": {
        "subject": "Mathematics",
        "topic": "Ratios and proportions",
        "title": "Ratios and Proportions",
        "objective": "Express a comparison as a ratio.",
        "nodes": [
            {
                "id": "ratio_simplify",
                "question": "A mixture has 4 blue parts for every 2 yellow parts. What is the simplified blue-to-yellow ratio?",
                "answer": "2:1",
                "hint": "Divide both parts of the ratio by their greatest common factor.",
                "misconceptions": {},
                "next": "complete",
            }
        ],
    },
}


def get_lesson(lesson_id: str) -> dict[str, Any]:
    """Return a registered lesson or raise KeyError."""
    return CURRICULUM[lesson_id]


def lesson_ids() -> list[str]:
    """Return lesson identifiers in curriculum order."""
    return list(CURRICULUM)
