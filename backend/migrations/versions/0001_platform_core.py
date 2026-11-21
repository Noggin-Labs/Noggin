"""Create initial learner and curriculum persistence tables.

Revision ID: 0001_platform_core
Revises:
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0001_platform_core"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        "learners",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("display_name", sa.String(length=80), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "courses",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("description", sa.String(length=2000), nullable=False),
        sa.Column("subject", sa.String(length=80), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_courses_subject", "courses", ["subject"])
    op.create_table(
        "lessons",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("course_id", sa.String(length=100), sa.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("objective", sa.String(length=500), nullable=False),
        sa.Column("content", sa.JSON(), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.UniqueConstraint("course_id", "position", name="uq_lesson_course_position"),
    )
    op.create_index("ix_lessons_course_id", "lessons", ["course_id"])
    op.create_table(
        "enrollments",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("learner_id", sa.String(length=36), sa.ForeignKey("learners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("course_id", sa.String(length=100), sa.ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("enrolled_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("learner_id", "course_id", name="uq_enrollment_learner_course"),
    )
    op.create_index("ix_enrollments_learner_id", "enrollments", ["learner_id"])
    op.create_index("ix_enrollments_course_id", "enrollments", ["course_id"])
    op.create_table(
        "lesson_progress",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("learner_id", sa.String(length=36), sa.ForeignKey("learners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("lesson_id", sa.String(length=100), sa.ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("learner_id", "lesson_id", name="uq_progress_learner_lesson"),
    )
    op.create_index("ix_lesson_progress_learner_id", "lesson_progress", ["learner_id"])
    op.create_index("ix_lesson_progress_lesson_id", "lesson_progress", ["lesson_id"])
    op.create_table(
        "assessment_attempts",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("learner_id", sa.String(length=36), sa.ForeignKey("learners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("lesson_id", sa.String(length=100), sa.ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False),
        sa.Column("assessment_id", sa.String(length=100), nullable=False),
        sa.Column("score", sa.Numeric(6, 3), nullable=True),
        sa.Column("answers", sa.JSON(), nullable=False),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_assessment_attempts_learner_id", "assessment_attempts", ["learner_id"])
    op.create_index("ix_assessment_attempts_lesson_id", "assessment_attempts", ["lesson_id"])

def downgrade() -> None:
    op.drop_index("ix_assessment_attempts_lesson_id", table_name="assessment_attempts")
    op.drop_index("ix_assessment_attempts_learner_id", table_name="assessment_attempts")
    op.drop_table("assessment_attempts")
    op.drop_index("ix_lesson_progress_lesson_id", table_name="lesson_progress")
    op.drop_index("ix_lesson_progress_learner_id", table_name="lesson_progress")
    op.drop_table("lesson_progress")
    op.drop_index("ix_enrollments_course_id", table_name="enrollments")
    op.drop_index("ix_enrollments_learner_id", table_name="enrollments")
    op.drop_table("enrollments")
    op.drop_index("ix_lessons_course_id", table_name="lessons")
    op.drop_table("lessons")
    op.drop_index("ix_courses_subject", table_name="courses")
    op.drop_table("courses")
    op.drop_table("learners")
