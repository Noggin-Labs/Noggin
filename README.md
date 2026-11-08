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
  <a href="https://github.com/Noggin-Labs/Noggimigo">Noggimigo</a>
  ·
  <a href="https://github.com/Noggin-Labs/Noggin/issues">Issues</a>
</p>

---

## Education was never supposed to be one-size-fits-all.

Every learner is different.

Some understand an idea through diagrams. Others need to experiment, ask questions, hear an explanation differently, or take a little more time to process information.

Yet many educational environments expect learners to adapt to a single predefined way of learning.

**Noggin is being built to challenge that assumption.**

Noggin is an adaptive learning platform designed with neurodivergent learners in mind, particularly children who may benefit from more flexible, accessible, and individualized educational experiences.

It brings together learning experiences, interactive activities, progress tools, and an intelligent learning companion in one environment.

The underlying philosophy is simple:

> Education should adapt to the learner, not the other way around.

## What we're building

Noggin aims to create a cohesive learning environment rather than another collection of disconnected educational tools.

| Component | Purpose |
| --- | --- |
| Learner Workspace | A central environment for lessons, activities, and exploration. |
| Noggimigo | An educational companion that encourages understanding through guided explanations and practice. |
| Adaptive Learning | Learning experiences that can respond to progress, preferences, and individual support needs. |
| Progress & Reflection | Tools for understanding learning development and celebrating progress. |
| Parent & Teacher Experiences | Supporting tools for the people involved in a learner's education. |

These represent the product direction. Not every capability is implemented in the current application.

## Designed around different minds

Neurodiversity should influence how educational technology is designed from the beginning, not be treated as an afterthought.

Noggin considers a range of cognitive, sensory, and learning-related differences.

| Consideration | Design direction |
| --- | --- |
| ADHD | Manageable tasks, clear structure, flexible pacing, and reduced unnecessary distractions. |
| Autism | Predictable navigation, consistent interaction patterns, and explicit instructions. |
| Dyslexia | Readable typography, accessible content presentation, and alternative explanations. |
| Dyscalculia | Concrete representations, visual mathematical models, and structured problem-solving. |
| Processing differences | Information chunking, clear explanations, and sufficient thinking time. |
| Visual learning preferences | Diagrams, illustrations, and visual representations. |
| Kinesthetic learning preferences | Interactive activities and opportunities for experimentation. |

These considerations are not diagnostic categories or assumptions about individual learners.

A diagnosis does not tell us everything about how someone learns. Noggin's direction is to support individual preferences rather than reduce people to profiles.

## The learning environment

The planned curriculum spans several areas of education:

- Mathematics
- English
- Science
- Social Studies
- History
- Social and Emotional Learning

The platform is intended to support exploration, understanding, and meaningful practice rather than simply measuring how quickly someone completes a lesson.

## Meet Noggimigo

**Noggimigo is Noggin's educational companion.**

Its purpose is to help learners understand concepts, work through challenges, and develop independent reasoning.

Rather than functioning as a generic chatbot, Noggimigo is designed around guided learning.

Its tutoring approach emphasizes:

- Explanations rather than unexplained answers.
- Hints that support independent problem-solving.
- Structured lesson progression.
- Deterministic educational verification.
- Optional local language-model assistance.
- Pedagogical validation before generated text is presented.

The current implementation uses a Python API and a deterministic tutoring engine, with an optional local Hugging Face model adapter.

**Educational correctness takes priority over generating an answer.**

Noggimigo is an educational system, not a medical or diagnostic tool.

### Noggimigo repository

The tutoring engine is maintained in the [Hugging Face repository](https://huggingface.co/Noggin-Labs/Noggimigo).

The application integrates its runtime through `backend/noggimigo/`.

## Design principles

Noggin's development follows several guiding principles.

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

Noggin currently uses the following technologies:

| Technology | Role |
| --- | --- |
| React | Frontend interface |
| TypeScript | Application development |
| Vite | Development server and build tooling |
| Lucide React | Interface icons |
| Vitest | Testing |
| Python | Tutoring backend |
| Hugging Face | Optional local language-model integration |

The technology stack may evolve as the project develops. Refer to `package.json` and the backend requirements for the authoritative dependency list.

## Architecture

Noggin is moving toward a modular monolith architecture.

The architecture documentation describes the intended boundaries, responsibilities, and migration sequence.

Relevant documents:

- [Architecture Overview](docs/architecture/overview.md)
- [ADR 0001: Modular Monolith](docs/architecture/decisions/0001-modular-monolith.md)
- [Architecture Migration Plan](docs/architecture/migration-plan.md)

These documents describe the architectural direction, not a claim that every planned module has already been implemented.

## Getting started

### Prerequisites

- Node.js (a current LTS release is recommended).
- npm.
- Python 3.10 or later for the Noggimigo API.

### 1. Clone the repository

```bash
git clone https://github.com/Noggin-Labs/Noggin.git
cd Noggin
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

Vite will provide a local development URL in your terminal.

### 4. Start the Noggimigo backend

Open a second terminal from the repository root.

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

Or on macOS/Linux:

```bash
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Start the API:

```bash
uvicorn backend.app:app --reload --port 8000
```

The frontend's default API URL is:

```text
http://localhost:8000
```

To override it, configure:

```text
VITE_NOGGIMIGO_API_URL
```

## Optional local language model

Noggimigo's deterministic tutoring functionality does not require downloading language-model weights.

An optional local Hugging Face adapter can be enabled separately.

Install its dependencies:

```bash
pip install -r backend/requirements-local-model.txt
```

Set the environment variable:

```text
NOGGIMIGO_ENABLE_LOCAL_MODEL=1
```

The default candidate model is:

```text
Qwen/Qwen3-0.6B
```

Model weights are loaded lazily when the first tutoring response requires them.

An important architectural distinction:

- Deterministic tutoring logic remains authoritative.
- Model-generated text is treated as untrusted.
- Generated responses are subject to existing pedagogical validation.
- Model output does not determine educational correctness or lesson progression.
- No paid inference endpoint is configured.

The optional model is an enhancement to the tutoring experience, not the authority responsible for deciding whether an answer is correct.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Run the TypeScript check and production build. |
| `npm run preview` | Preview the production build. |
| `npm run typecheck` | Run TypeScript checks. |
| `npm test` | Run the test suite. |
| `npm run test:watch` | Run tests in watch mode. |

## Runtime boundaries and deployment considerations

The current Noggimigo API has several important limitations:

- Sessions are temporary and stored in process memory.
- Sessions are not persistent accounts or learner records.
- The API does not require learner names, school identifiers, or profile data.
- The optional language model runs locally alongside the Python service.
- The default CORS allowlist targets local Vite development origins.
- `NOGGIN_ALLOWED_ORIGINS` configures permitted deployment origins.
- Authentication and rate limiting are not currently implemented.

**Deployment warning:** The current backend prototype is not ready for unrestricted public exposure or real learner accounts. Production deployment requires appropriate authentication, rate limiting, security controls, and privacy review.

### Curriculum implementation note

The upstream Hugging Face snapshot's `curriculum.py` currently contains test code rather than the curriculum module imported by the session runtime.

Noggin supplies a corrected, explicit lesson graph in:

```text
backend/noggimigo/curriculum.py
```

This includes lesson IDs used by the current application.

---

# Development Status

<code>In active development</code>

Noggin is an evolving software project. Its current application should not be confused with a completed, independently validated educational platform.

We distinguish between three implementation states:

| Status | Meaning |
| --- | --- |
| Implemented | Functionality currently present in the codebase. |
| In development | Functionality actively being implemented or refined. |
| Planned | Proposed capabilities that have not yet been delivered. |

The source code, tests, issues, and release notes are the authoritative references for current implementation status.

## Contributing

Noggin welcomes thoughtful contributions, technical feedback, bug reports, and accessibility reviews.

Whether you're interested in frontend development, educational technology, accessibility, software architecture, or responsible AI, contributions can help improve the project.

Before submitting a substantial change:

1. Review existing issues and discussions.
2. Explain the problem your proposed change addresses.
3. Keep changes focused and consistent with the project's design principles.
4. Run the relevant tests and checks.
5. Submit a pull request with a clear description of the changes.

### Reporting bugs

When opening an issue, include:

- A clear description of the problem.
- Steps to reproduce it.
- Expected behavior.
- Actual behavior.
- Relevant error messages, where applicable.

Please do not include private information about children or learners in issues, screenshots, or logs.

## Privacy and learner safety

Noggin is being designed for an audience that includes children. Privacy and learner safety must therefore be considered throughout development.

The project aims to:

- Minimize unnecessary learner information.
- Avoid unnecessary tracking.
- Use age-appropriate interaction patterns.
- Keep AI-assisted functionality within clearly defined boundaries.
- Avoid treating educational software as a substitute for professional support.

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
