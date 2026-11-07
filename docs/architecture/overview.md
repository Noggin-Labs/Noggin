# Noggin architecture

## Purpose

This document describes the intended architecture for the current Noggin application. It is a working design constraint, not a claim that every listed module already exists.

Noggin is a learner-facing adaptive learning platform. Its code should keep the learner experience coherent while allowing curriculum, learning logic, progress, and Noggimigo to evolve independently.

## Architectural style

Use a **feature-oriented modular monolith**.

- One deployable application and one repository for now.
- Clear feature ownership and explicit boundaries inside the codebase.
- Pure domain logic wherever possible; UI components should orchestrate rather than own educational rules.
- Introduce network services or separate deployables only when a real requirement justifies them.
- Avoid speculative microservices, premature backend abstractions, and dependency-heavy frameworks.

The existing React, TypeScript, and Vite stack remains the baseline. Preserve the current interface and interaction patterns during structural work.

## Target source layout

The layout is a destination, not a demand to create empty folders in advance.

```text
src/
  app/                 # application composition, routing, providers
  components/
    ui/                # reusable, product-neutral interface primitives
    layout/            # shell, navigation, page structure
  features/
    dashboard/         # learner home and summaries
    curriculum/        # courses, units, lessons, discovery
    lesson-player/     # lesson presentation and activity flow
    progress/          # attempts, completion, mastery, XP
    library/           # saved learning items
    learner-settings/  # learner-controlled presentation preferences
  learning/
    assessment/        # assessment contracts and evaluation policy
    adaptation/        # transparent, testable adaptation decisions
    accommodations/    # presentation options and learner agency
    progression/       # sequencing and mastery policy
  noggimigo/
    experience/        # learner-facing companion UI
    orchestration/     # safe request and response flow
    tutor/             # tutoring strategies and prompt-independent logic
    verification/      # answer and explanation checks
    providers/         # optional model-provider adapters
    safety/            # age-appropriate boundaries and escalation rules
  data/
    curriculum/        # authored, versioned curriculum content
  services/            # persistence and external-system boundaries
  lib/                 # small cross-feature utilities only
  styles/              # design tokens, global styles
  types/               # genuinely shared contracts
```

Tests should live beside the module they protect unless an integration or end-to-end test needs a separate top-level location.

## Boundary rules

### Product UI vs learning domain

- Feature components own rendering and user interaction.
- Learning policies are pure TypeScript modules where practical.
- Components call domain functions; domain modules do not import React or UI code.
- Progress is derived from recorded events and explicit rules, not hidden component state.

### Curriculum vs lesson player

- Curriculum owns course and lesson metadata, identifiers, ordering, and availability.
- Lesson player owns the interaction lifecycle for a selected activity.
- A lesson is content, not a React component.
- Content references stable IDs rather than importing UI components.

### Learning engine vs Noggimigo

These are separate responsibilities.

- The **learning engine** owns deterministic educational rules: progression, mastery, assessment, adaptation, and accommodation selection.
- **Noggimigo** is the learner-facing companion. It may explain, ask questions, offer hints, and help learners reflect.
- Noggimigo can request context or suggestions from learning services, but it does not silently rewrite learner records or overrule verified assessment rules.
- A model-generated response is never itself proof that an answer is correct.

### Providers vs product behavior

- No feature should depend directly on a specific AI vendor.
- Provider adapters implement a narrow internal interface.
- The application must remain usable when no model provider is configured or a provider is unavailable.
- Deterministic verification and clear fallback behavior take priority over fluent but unverified output.

### Persistence

- Components should not call browser storage directly.
- Persistence should be behind a small service/repository boundary.
- Browser-local persistence is acceptable for the current prototype; it is not multi-device sync, authentication, backup, or a production privacy guarantee.
- Do not store sensitive learner profiles or unnecessary personal data.

## Data and privacy principles

- Use synthetic learner data in development, tests, screenshots, and public issues.
- Collect the minimum data needed for a clearly stated feature.
- Keep preferences learner-controlled and editable.
- Do not infer or display diagnoses from interaction patterns.
- Do not use learning analytics as a proxy for a learner's worth, intelligence, or potential.
- Document what is stored, where it is stored, and how it can be cleared before introducing accounts or remote persistence.

## Change strategy

Refactor in small, reviewable slices:

1. Establish domain contracts and tests.
2. Extract curriculum data and types from the application shell.
3. Move progress calculations and state transitions behind the progress feature.
4. Separate dashboard, curriculum, lesson-player, library, and settings views.
5. Introduce persistence adapters without changing learner-visible behavior.
6. Build Noggimigo as an isolated subsystem with deterministic verification and safe fallbacks.
7. Add integration and accessibility tests around complete learner journeys.

For every slice:

- Preserve existing visual behavior unless a UI change is explicitly intended.
- Keep public imports stable where practical during migration.
- Run typecheck, tests, and production build.
- Record behavior changes and known limitations.
- Do not mark a feature complete until its implementation and checks support that claim.
