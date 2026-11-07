# Noggin

<p align="center">
  <strong>Learning that Adapts to You.</strong><br />
  An adaptive learning experience designed with neurodivergent learners in mind.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-2D8CFF" alt="In development" />
  <img src="https://img.shields.io/badge/license-Apache%202.0-2D8CFF" alt="Apache 2.0" />
  <img src="https://img.shields.io/badge/open%20source-yes-2D8CFF" alt="Open source" />
</p>

---

## What is Noggin?

Noggin is an adaptive learning platform being built around a simple idea: **education should adapt to the learner, not the other way around.**

Learners do not all process information in the same way. They have different strengths, interests, attention patterns, and support needs. A single fixed lesson format cannot work equally well for everyone.

Noggin aims to make learning more personal, accessible, and engaging—especially for neurodivergent children—without treating difference as a problem to be fixed.

This repository contains the Noggin application. The project is actively being developed, so the interface and capabilities will continue to evolve.

## The experience

Noggin is intended to bring several parts of the learning journey together:

- **A learner-first workspace** for exploring lessons, activities, and progress.
- **Noggimigo**, Noggin's learning companion, designed to help learners understand ideas rather than simply hand over answers.
- **Adaptive learning experiences** that can respond to a learner's progress, preferences, and support needs.
- **Progress and reflection tools** that make learning development easier to understand.
- **Parent and teacher experiences** that can help the adults supporting a learner stay informed.

These are product goals, not a claim that every capability is already implemented. Check the application and the current project issues for the latest implementation status.

## Designed for different ways of learning

Noggin is being designed with a range of learning needs and approaches in mind, including:

| Learning consideration | Examples of supportive design |
| --- | --- |
| ADHD | Clear task structure, manageable steps, and flexible pacing |
| Autism | Predictable navigation, consistent patterns, and explicit instructions |
| Dyslexia | Readable content and varied ways to engage with information |
| Dyscalculia | Visual models and concrete representations for mathematical ideas |
| Processing differences | Smaller information chunks and time to think |
| Visual learning preferences | Diagrams, illustrations, and visual explanations |
| Kinesthetic learning preferences | Interactive and hands-on activities |

These are design considerations, not diagnoses or labels that define a learner. A profile should never be treated as a substitute for understanding an individual.

## Learning areas

The planned learning scope includes:

- Mathematics
- English
- Science
- Social Studies
- History
- Social and Emotional Learning

The exact content and availability of each area will develop alongside the platform.

## Noggimigo

Noggimigo is the learning companion inside Noggin. Its purpose is to support curiosity and understanding through explanations, questions, hints, and guided practice.

The goal is not to turn Noggin into a chatbot with lessons attached. Noggimigo is one part of a wider learning environment, and educational correctness and learner safety matter more than generating an answer quickly.

AI-assisted features are under development. They should not be treated as a source of medical, diagnostic, or professional advice.

## Design principles

Noggin's development is guided by a few principles:

- **Learner agency:** give learners room to explore, make choices, and learn at their own pace.
- **Adaptability:** support different approaches instead of forcing everyone through one rigid path.
- **Clarity:** make interfaces and instructions understandable.
- **Accessibility:** consider different sensory, cognitive, and interaction needs throughout design and development.
- **Privacy:** minimise unnecessary collection and exposure of learner information.
- **Responsible AI:** use AI carefully, make its limitations clear, and keep learning outcomes at the centre.
- **No advertising:** the project is intended to be an ad-free learning experience.

## Development status

Noggin is under active development. The current application is an evolving product experience, not a finished or fully validated educational platform.

A useful distinction:

- **In the repository:** functionality that is present in the codebase.
- **In development:** functionality currently being implemented or refined.
- **Planned:** ideas and capabilities that have not yet been delivered.

Do not assume a feature is available just because it appears in the product vision. The codebase and release notes are the source of truth for implementation status.

## Run locally

### Requirements

- Node.js (a current LTS release is recommended)
- npm

### Setup

```bash
git clone https://github.com/Noggin-Labs/Noggin.git
cd Noggin
npm install
npm run dev
```

Vite will print a local development URL in the terminal.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Run the TypeScript check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run the TypeScript check |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |

## Technology

The current frontend uses:

- React
- TypeScript
- Vite
- Lucide React for icons
- Vitest for testing

The project structure and supporting services may change as development progresses. Refer to `package.json` and the source code for the current dependencies and implementation.

## Contributing

Contributions, thoughtful feedback, bug reports, and accessibility reviews are welcome.

Before making a substantial change:

1. Check the existing issues and discussions.
2. Explain the problem your change is intended to solve.
3. Keep changes focused and consistent with the project's design principles.
4. Run the relevant checks before opening a pull request.

When reporting a bug, include the steps to reproduce it, what you expected to happen, and what happened instead. Please avoid including private information about children or learners in issues, screenshots, or logs.

## Privacy and learner safety

Noggin is intended for use by children, so privacy and safety need to shape the product from the beginning. The project aims to minimise learner data, avoid unnecessary tracking, and use age-appropriate design.

Do not submit real children's personal, educational, or sensitive information in public issues or pull requests. A privacy-first goal is not, by itself, a guarantee that every current build or integration is ready for real learner data.

Noggin is an educational project. It does not diagnose, treat, or cure any condition.

## License

Noggin is distributed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for the full license text.

---

<p align="center">
  <strong>Noggin</strong><br />
  Learning that Adapts to You.
</p>
