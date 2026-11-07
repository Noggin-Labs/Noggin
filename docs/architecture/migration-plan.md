# Architecture migration plan

This plan is deliberately incremental. The current learner experience is the baseline to preserve, not disposable prototype code.

## Working rules

- Work on a feature branch; do not force-push or rewrite shared history.
- Keep changes small enough to review and revert.
- Preserve the existing routes, lesson flow, copy, responsive layout, and Noggin Blue visual identity unless a change is explicitly approved.
- Avoid adding dependencies unless a specific requirement cannot be met with the existing stack.
- Add or update tests with each domain behavior change.
- Run `npm run typecheck`, `npm test`, and `npm run build` before merging.
- Do not add real learner data to fixtures, issues, screenshots, or test output.

## Phases

### 0. Architecture baseline — implemented; verification pending

- [x] Record the modular-monolith decision.
- [x] Define feature and domain boundaries.
- [x] Move progress calculations into a feature-owned domain module.
- [x] Preserve the old progress import path as a compatibility facade.
- [x] Remove visible product attribution that incorrectly presents Noggin Labs as the product name.
- [ ] Run the full local verification suite.

### 1. Curriculum as data — implemented; verification pending

- [x] Define stable, typed Course and Lesson contracts.
- [x] Move authored course and lesson records out of the application shell.
- [x] Add catalog integrity tests: unique IDs, valid course references, valid lesson references, and valid answer keys.
- [x] Keep rendering components out of curriculum data.

### 2. Feature-owned learner journeys

- Extract the lesson player without changing its behavior.
- Separate dashboard, curriculum discovery, saved library, and learner settings into feature modules.
- Keep navigation and shared layout in the application shell.
- Add focused tests for each journey.

### 3. State and persistence boundary

- Introduce typed progress and preference state transitions.
- Move browser storage access behind a repository/service interface.
- Handle malformed, missing, and older stored values safely.
- Keep local-only storage clearly labelled as prototype persistence.
- Do not introduce accounts or remote learner records as part of this refactor.

### 4. Learning engine

- Separate assessment, progression, mastery, and adaptation policies.
- Make policy decisions deterministic, documented, and testable.
- Keep learner preferences editable and avoid diagnostic inference.
- Explain why an adaptation was selected; do not make opaque changes to a learner's path.

### 5. Noggimigo subsystem

- Define a provider-independent tutoring contract.
- Separate tutoring strategy, orchestration, verification, provider adapters, and safety policy.
- Ensure the product works without an AI provider.
- Treat model output as untrusted until checked against the relevant learning context.
- Do not allow generated content to modify assessment records or learner settings directly.
- Add age-appropriate safety and privacy tests before exposing a live model integration.

### 6. Quality and release readiness

- Add component and learner-journey tests.
- Add keyboard and screen-reader checks for core interactions.
- Test responsive layouts and reduced-motion preferences.
- Document storage behavior, data lifecycle, and provider data handling before any real learner deployment.
- Publish a feature-status table that distinguishes implemented, in-progress, and planned capabilities.

## Definition of done for a migration slice

A slice is complete only when its behavior is preserved or intentionally changed, its boundaries are clear, relevant tests exist, and typecheck, tests, and production build pass. A commit alone is not evidence that those checks passed.
