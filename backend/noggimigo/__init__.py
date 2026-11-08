"""Noggimigo: a deterministic local tutoring runtime."""
from .noggimigo_session import NoggimigoSession, TeachingPreferences
from .answer_verifier import VerificationResult, verify_answer, parse_math_answer
from .curriculum import CURRICULUM, lesson_ids
from .LessonGenerator import NogginLessonBuilder, LessonGenerator

__all__ = ["NoggimigoSession", "TeachingPreferences", "VerificationResult", "verify_answer", "parse_math_answer", "CURRICULUM", "lesson_ids", "NogginLessonBuilder", "LessonGenerator"]
