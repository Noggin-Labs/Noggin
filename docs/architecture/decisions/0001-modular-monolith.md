# ADR 0001: Start with a feature-oriented modular monolith

- **Status:** Accepted
- **Date:** 2026-11-07

## Context

Noggin currently ships as a small React and TypeScript application. It has a coherent learner interface, but application state, curriculum content, progress calculations, and multiple views are concentrated in a single application module.

The product is expected to grow into a broader learning platform. Noggimigo, curriculum, assessment, adaptation, learner preferences, and persistence will need clear responsibilities. The project does not yet have a demonstrated need for separately deployed services or a remote backend.

## Decision

Keep one frontend application and organize its source code around product features and domain boundaries.

Begin frontend-first. Keep persistence replaceable behind interfaces, but do not add a backend, authentication, database, model API, or microservice until a concrete feature requires it and the privacy and operational implications are understood.

Keep Noggimigo as an independent subsystem within the Noggin application. Keep it distinct from deterministic learning and assessment logic.

## Consequences

### Positive

- Low operational and hosting complexity.
- Fast iteration on the learner experience.
- Feature ownership and test boundaries become clearer.
- Domain logic can be reused by the UI and future services.
- A future extraction remains possible if a genuine scaling or team boundary appears.

### Trade-offs

- Module boundaries require discipline because the application is still one deployable unit.
- The repository will need tests to prevent accidental cross-feature coupling.
- Some abstractions may need revision as real product requirements emerge.

## Guardrails

- Do not create microservices pre-emptively.
- Do not couple the learning engine to React or an AI provider.
- Do not allow model output to bypass deterministic verification.
- Do not claim local browser storage provides production-grade learner-data protection.
- Prefer a working, tested vertical slice over empty scaffolding.
