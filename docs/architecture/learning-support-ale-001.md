# Learning support rules (ALE-001)

## Status

ALE-001 is a first, deliberately small learning-support rule. It is deterministic and based only on recorded answer outcomes for the currently open lesson.

## Rule

When the two most recent recorded attempts for the active lesson are both incorrect, Noggin may show an optional prompt suggesting that the learner revisit the worked example before trying again.

The rule:
- considers only the active lesson;
- uses the two most recent attempts in the existing append order;
- does not infer a learning style, diagnosis, ability, motivation, or mastery;
- does not change lesson content, pacing, difficulty, or learner settings;
- does not prevent the learner from continuing;
- makes no claim about why an answer was incorrect.

A correct answer among the two most recent attempts suppresses the prompt.

## Data boundary

The function consumes the existing `Attempt` shape (`lessonId`, `correct`, `at`). It does not require new learner data or external services.

## Validation

Unit tests cover the trigger condition, insufficient attempts, a recent correct answer, and lesson isolation. Run `npm test`, `npm run typecheck`, and `npm run build` in the project environment before treating the change as verified. The GitHub connector can write source files, but it does not execute the project's test suite.
