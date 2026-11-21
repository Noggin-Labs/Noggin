# Noggin persistence foundation

## Scope

The first persistence slice establishes relational storage contracts and versioned schema migrations. It does not yet connect learner-facing routes to these tables, add accounts, or claim that learner progress is being stored remotely.

## Database configuration

Set `DATABASE_URL` for the API and Alembic. PostgreSQL is the intended deployed database; a local SQLite file (`sqlite:///./noggin.db`) is the development default.

Examples:

```text
# Local development default (no variable required)
sqlite:///./noggin.db

# PostgreSQL
postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE
```

Do not commit credentials. Supply production connection strings through the deployment platform's secret/environment configuration.

Apply schema changes with:

```bash
alembic upgrade head
```

Create a new migration after changing SQLAlchemy models:

```bash
alembic revision --autogenerate -m "describe the schema change"
```

Review generated migrations before applying them. Autogeneration is a starting point, not a substitute for review.

## Initial relational model

| Table | Purpose |
| --- | --- |
| `learners` | Minimal learner record and timestamps. |
| `courses` | Course catalogue metadata and publication state. |
| `lessons` | Ordered course content and learning objective. |
| `enrollments` | Learner-to-course relationship; unique per pair. |
| `lesson_progress` | Learner progress state per lesson; unique per pair. |
| `assessment_attempts` | Submitted assessment answers and optional score. |

Course and lesson content is stored as structured JSON so authored content can evolve without embedding UI components in the database.

## Privacy and safety constraints

- Store only information required for a defined learning feature.
- Do not add diagnoses, inferred cognitive traits, birth dates, school identifiers, or sensitive learner profiles to these tables.
- Use synthetic data in tests and development.
- Authentication, authorization, account recovery, retention/deletion workflows, and a privacy review are required before exposing learner records to real users.
- Database models are not an authorization boundary. Every future API query must scope records to the authenticated learner and enforce access server-side.
- The current Noggimigo tutoring sessions remain ephemeral and are not yet persisted in this schema.

## Current implementation boundary

Implemented in this slice: SQLAlchemy models, environment-configured engine/session factory, Alembic migration infrastructure, initial migration, and relational integrity tests.

Not yet implemented: production database provisioning, learner-facing CRUD APIs, account authentication, authorization policies, data export/deletion endpoints, and deployment secrets. These are subsequent slices.
