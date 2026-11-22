# Noggin

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-2D8CFF?style=for-the-badge" alt="In development" />
  <img src="https://img.shields.io/badge/license-Apache%202.0-2D8CFF?style=for-the-badge" alt="Apache 2.0" />
  <img src="https://img.shields.io/badge/open%20source-yes-2D8CFF?style=for-the-badge" alt="Open source" />
</p>

<p align="center">
  <strong>Learning that Adapts to You.</strong>
  <br />
  An adaptive learning platform designed around different minds, different strengths, and different ways of understanding the world.
</p>

<p align="center">
  <a href="https://noggin-gbdy.onrender.com/">Live Application</a>
  ·
  <a href="https://github.com/Noggin-Labs/Noggimigo">Noggimigo on GitHub</a>
  ·
  <a href="https://huggingface.co/Noggin-Labs/Noggimigo">Noggimigo on Hugging Face</a>
  ·
  <a href="https://github.com/Noggin-Labs/Noggin/issues">Issues</a>
</p>

---

## Education was never supposed to be one-size-fits-all.

Every learner is different.

Some understand an idea through diagrams. Others need to experiment, ask questions, hear an explanation differently, or take a little more time to process information. Yet many educational environments expect learners to adapt to a single predefined way of learning.

**Noggin is being built to challenge that assumption.**

Noggin is an adaptive learning platform designed with neurodivergent learners in mind, particularly children who may benefit from flexible, accessible, and individualized educational experiences.

The current application brings together a learner dashboard, a browsable curriculum, interactive lesson experiences, browser-local progress tools, learner-controlled presentation preferences, and Noggimigo, a guided tutoring companion.

> Education should adapt to the learner, not the other way around.

## What is in the application today?

The current learner-facing prototype includes:

- **Learner dashboard** — a home view with a lesson-resume prompt and recent practice activity.
- **Curriculum browser** — searchable and filterable subject courses.
- **Interactive lessons** — worked examples, visual concept models, practice questions, feedback, and reflection prompts.
- **Progress view** — a summary of answer attempts, completed lessons, and saved lessons.
- **Learning library** — save lessons to revisit later.
- **Learner settings** — choose a learning presentation preference, lesson pacing, and whether available visual explanations are shown.
- **Noggimigo panel** — guided tutoring, answer submission, and hints through the Python API.

The frontend currently ships with a small authored curriculum covering Mathematics, Science, English, and Life Skills. This is a prototype curriculum, not a complete or independently validated school curriculum.

Some product ideas remain planned rather than implemented. In particular, the current application does not yet provide production learner accounts, parent or teacher portals, cross-device progress synchronization, or a complete adaptive-learning engine.

## Designed around different minds

Neurodiversity should influence how educational technology is designed from the beginning, not be treated as an afterthought.

Noggin's design direction considers a range of cognitive, sensory, and learning-related differences:

| Consideration | Design direction |
| --- | --- |
| Attention and executive-function differences | Manageable tasks, clear structure, flexible pacing, and reduced unnecessary distractions. |
| Autistic learners | Predictable navigation, consistent interaction patterns, and explicit instructions. |
| Dyslexia | Readable typography, accessible content presentation, and alternative explanations. |
| Dyscalculia | Concrete representations, visual mathematical models, and structured problem-solving. |
| Processing differences | Information chunking, clear explanations, and sufficient thinking time. |
| Visual learning preferences | Diagrams, illustrations, and visual representations. |
| Kinesthetic learning preferences | Interactive activities and opportunities for experimentation. |

These are design considerations, not diagnostic categories or assumptions about individual learners. A diagnosis does not tell us everything about how someone learns. Noggin aims to support individual preferences rather than reduce people to fixed profiles.

## Meet Noggimigo

**Noggimigo is Noggin's educational companion.** Its purpose is to help learners understand concepts, work through challenges, and develop independent reasoning.

The current integration provides:

- Guided, lesson-linked tutoring sessions.
- Hints that support independent problem-solving.
- Deterministic answer verification and lesson progression.
- Structured prompts and feedback.
- An optional local Hugging Face language-model adapter.
- A deterministic fallback when the optional model is disabled or unavailable.

The tutoring runtime is served by the FastAPI backend. The frontend sends lesson-session, answer, and hint requests to that API.

**Educational correctness takes priority over generated wording.** The deterministic tutoring logic remains authoritative; model-generated text is treated as untrusted and does not decide whether an answer is correct or whether a learner advances.

Noggimigo is an educational system, not a medical, diagnostic, or therapeutic tool.

### Noggimigo repositories

- [Noggimigo on GitHub](https://github.com/Noggin-Labs/Noggimigo)
- [Noggimigo on Hugging Face](https://huggingface.co/Noggin-Labs/Noggimigo)

The Noggin application currently integrates the tutoring runtime through `backend/noggimigo/`.

## Design principles

**01 — Learner agency**  
Learners should have meaningful opportunities to explore, make choices, and engage with material at their own pace.

**02 — Adaptability**  
Different learners benefit from different approaches. Educational experiences should not assume that one method works for everyone.

**03 — Accessibility**  
Accessibility should be considered throughout the interface, content, and interaction design.

**04 — Clarity**  
Instructions, explanations, and navigation should be understandable without unnecessary complexity.

**05 — Privacy**  
Minimize unnecessary collection, storage, and exposure of learner information.

**06 — Responsible AI**  
AI-assisted functionality should have clearly defined limitations and should support, rather than replace, educational reasoning.

**07 — No advertising**  
Noggin is intended to remain an ad-free learning environment.

---

# Technical Overview

## Technology stack

| Technology | Role |
| --- | --- |
| React 19 | Frontend interface |
| TypeScript 5 | Application development and type checking |
| Vite 6 | Development server and build tooling |
| Lucide React | Interface icons |
| Vitest 3 | Frontend tests |
| Python | Tutoring and application API |
| FastAPI | HTTP API |
| Pydantic | API request validation |
| SQLAlchemy | Relational data models and database access |
| Alembic | Database schema migrations |
| SQLite | Local development database default |
| PostgreSQL | Intended deployed relational database |
| Hugging Face Transformers and PyTorch | Optional local language-model integration |

The frontend dependency versions are defined in `package.json`. Backend dependencies are defined in `backend/requirements.txt` and `backend/requirements-local-model.txt`.

## Architecture

Noggin is being developed as a **feature-oriented modular monolith**: one application and repository, with clearer boundaries between the learner experience, curriculum, learning logic, persistence, and Noggimigo.

The architecture documents describe intended boundaries and staged development. They do not mean every proposed module or capability has already been implemented.

Relevant documents:

- [Architecture overview](docs/architecture/overview.md)
- [Data model and persistence foundation](docs/architecture/data-model.md)
- [ADR 0001: Modular monolith](docs/architecture/decisions/0001-modular-monolith.md)
- [Architecture migration plan](docs/architecture/migration-plan.md)

## Current data and persistence boundaries

It is important to distinguish the frontend prototype's local state from the backend's database foundation:

- The frontend currently stores lesson completions, answer-attempt history, saved lessons, the last-opened lesson, and presentation preferences in the browser's local storage.
- This browser-local state is not a learner account, cloud backup, or cross-device synchronization.
- The backend has SQLAlchemy models and Alembic migrations for learners, courses, lessons, enrollments, lesson progress, and assessment attempts.
- The course-catalog API reads published course and lesson metadata from the relational database.
- Run `python -m backend.seed_curriculum` after migrations to populate the database catalog from the maintained Noggimigo curriculum registry.
- The learner-facing frontend still uses its own authored curriculum data in `src/features/curriculum/model.ts`; the database catalog is not yet the source of truth for that UI.
- Noggimigo tutoring sessions are temporary and held in backend process memory. They are not persisted in the relational schema.

The presence of database models does **not** mean learner accounts, remote progress tracking, or production data workflows are complete.

## Getting started

### Prerequisites

- Node.js 20 or later (Node 20 is used in CI).
- npm.
- Python 3.10 or later.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/Noggin-Labs/Noggin.git
cd Noggin
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

Create and activate a virtual environment from the repository root.

**Windows (PowerShell):**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
python -m venv .venv
source .venv/bin/activate
```

Install the API dependencies:

```bash
pip install -r backend/requirements.txt
```

For backend development and tests, install:

```bash
pip install -r backend/requirements-dev.txt
```

### 4. Configure and initialize the database

The local default is SQLite, so no database server is required for local development. The default database file is `noggin.db` in the repository root.

To use a different database, set `DATABASE_URL` before running Alembic or the API.

**PowerShell:**

```powershell
$env:DATABASE_URL = "sqlite:///./noggin.db"
```

**macOS/Linux:**

```bash
export DATABASE_URL="sqlite:///./noggin.db"
```

Apply database migrations:

```bash
alembic upgrade head
```

Populate the relational course catalog:

```bash
python -m backend.seed_curriculum
```

The seed command is safe to run again; it updates existing catalog metadata rather than creating duplicate course and lesson rows.

### 5. Start the backend API

From the repository root, with the virtual environment active:

```bash
uvicorn backend.app:app --reload --port 8000
```

The API will be available at:

```text
http://localhost:8000
```

Useful endpoints include:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | API health and runtime configuration status. |
| `GET /api/catalog/courses` | List published courses from the database. |
| `GET /api/catalog/courses/{course_id}` | Retrieve a published course and its published lessons. |
| `GET /api/lessons` | List lessons in the Noggimigo tutoring registry. |
| `POST /api/sessions` | Start a Noggimigo tutoring session. |

FastAPI's interactive API documentation is available at `http://localhost:8000/docs` while the API is running.

### 6. Configure the frontend API URL

The Noggimigo panel defaults to:

```text
http://localhost:8000
```

To use another API origin, set `VITE_NOGGIMIGO_API_URL` in a root-level `.env.local` file:

```text
VITE_NOGGIMIGO_API_URL=https://your-api-host.example
```

The backend's CORS allowlist is configured with `NOGGIN_ALLOWED_ORIGINS`. Its local default allows `http://localhost:5173` and `http://127.0.0.1:5173`.

### 7. Start the frontend

In a separate terminal:

```bash
npm run dev
```

Vite will print the local application URL, usually `http://localhost:5173`.

## Optional local language model

Noggimigo's deterministic tutoring functionality does not require downloading language-model weights.

An optional local Hugging Face adapter can be enabled separately. Install its dependencies:

```bash
pip install -r backend/requirements-local-model.txt
```

Enable it in the environment used to start the API:

**PowerShell:**

```powershell
$env:NOGGIMIGO_ENABLE_LOCAL_MODEL = "1"
```

**macOS/Linux:**

```bash
export NOGGIMIGO_ENABLE_LOCAL_MODEL=1
```

The default candidate model is:

```text
Qwen/Qwen3-0.6B
```

To select another compatible model, set `NOGGIMIGO_MODEL_ID`. Model weights are loaded lazily when a tutoring session first requests the model.

Important boundaries:

- Deterministic tutoring logic remains authoritative.
- Model-generated text is treated as untrusted.
- Generated responses are subject to the tutoring runtime's validation.
- Model output does not determine educational correctness or lesson progression.
- No paid inference endpoint is configured by this integration.
- Local model inference requires additional disk space, memory, and compatible runtime dependencies; it is optional.

## Available commands

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Run TypeScript checks and create a production build. |
| `npm run preview` | Preview the production build locally. |
| `npm run typecheck` | Run TypeScript checks. |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |

### Backend

| Command | Description |
| --- | --- |
| `uvicorn backend.app:app --reload --port 8000` | Start the FastAPI development server. |
| `alembic upgrade head` | Apply database migrations. |
| `alembic revision --autogenerate -m "description"` | Generate a migration candidate after model changes; review it before use. |
| `python -m backend.seed_curriculum` | Insert or refresh the database course catalog. |
| `pytest backend/tests -q` | Run backend, API, and database tests. |

## Continuous integration

GitHub Actions currently runs two verification jobs for pushes to `main` and `feat/**`, and for pull requests targeting `main`:

- **Frontend:** install npm dependencies, run `npm test`, then run `npm run build`.
- **Backend:** install `backend/requirements-dev.txt`, apply Alembic migrations, then run `pytest backend/tests -q`.

A CI workflow is a verification mechanism; do not interpret the existence of the workflow as evidence that a particular local change has passed. Check the relevant GitHub Actions run for its result.

## Runtime boundaries and deployment considerations

The current prototype has important limitations:

- Browser-local learning data belongs to the current browser profile and is not synchronized to an account.
- Noggimigo sessions are temporary and stored in process memory. They can be lost when the API process restarts.
- The database schema is an initial persistence foundation; learner-facing account, progress, and assessment APIs are not yet implemented.
- The API does not currently provide authentication or authorization.
- The default CORS allowlist targets local Vite development origins; configure `NOGGIN_ALLOWED_ORIGINS` for a deployment.
- The optional language model runs locally alongside the Python service when explicitly enabled.
- Production database credentials should be supplied through deployment secrets or environment configuration, never committed to the repository.

**Deployment warning:** The current backend is a development prototype, not a production-ready service for real learner accounts or sensitive learner records. Before such use, the project needs authentication, authorization, rate limiting, secure session handling, privacy and security review, and appropriate data retention, deletion, and safeguarding processes.

## Development status

<code>In active development</code>

Noggin is an evolving software project. The current application should not be confused with a completed, independently validated educational platform.

We distinguish between three implementation states:

| Status | Meaning |
| --- | --- |
| Implemented | Functionality currently present in the codebase. |
| In development | Functionality actively being implemented or refined. |
| Planned | Proposed capabilities that have not yet been delivered. |

The source code, tests, issues, CI runs, and release notes are the authoritative references for current implementation status.

## Contributing

Noggin welcomes thoughtful contributions, technical feedback, bug reports, and accessibility reviews.

Before submitting a substantial change:

1. Review existing issues and discussions.
2. Explain the problem your proposed change addresses.
3. Keep changes focused and consistent with the project's design principles.
4. Run the relevant frontend and/or backend checks.
5. Submit a pull request with a clear description of the changes.

### Reporting bugs

When opening an issue, include:

- A clear description of the problem.
- Steps to reproduce it.
- Expected behavior.
- Actual behavior.
- Relevant error messages, where applicable.

Please do not include private information about children or learners in issues, screenshots, test fixtures, or logs. Use synthetic examples.

## Privacy and learner safety

Noggin is being designed for an audience that includes children. Privacy and learner safety must therefore be considered throughout development.

The project aims to:

- Minimize unnecessary learner information.
- Avoid unnecessary tracking.
- Use age-appropriate interaction patterns.
- Keep AI-assisted functionality within clearly defined boundaries.
- Avoid treating educational software as a substitute for professional support.
- Keep learner preferences editable and avoid inferring diagnoses from usage.

A privacy-first design goal does not automatically mean that every current build or integration is suitable for real learner data.

Noggin does not diagnose, treat, or cure medical or developmental conditions.

## License

Noggin is distributed under the [Apache License 2.0](LICENSE).

You are welcome to use, modify, and distribute the project in accordance with the license terms.

---

<p align="center">
  <strong>Noggin</strong>
  <br />
  Learning that Adapts to You.
  <br /><br />
  <sub>Built around the belief that different minds deserve different possibilities.</sub>
</p>
