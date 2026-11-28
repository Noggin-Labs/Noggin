# Learner-controlled support preferences (ALE-002)

## Status

ALE-002 adds learner-controlled preferences for optional support prompts. It builds on ALE-001's transparent trigger rule without assigning a learning-style label or inferring a learner profile.

## Preferences

- Optional support can be enabled or disabled. It is enabled by default to preserve ALE-001 behavior.
- When enabled, the learner chooses one of three prompt formats: revisit the worked example, receive a general hint, or see the worked example's steps.
- The selection can be changed at any time in Settings.
- Preferences are stored locally in the existing browser storage mechanism.

## Trigger and boundaries

The prompt is offered only when the two most recent recorded attempts for the active lesson are both incorrect. A recent correct answer suppresses it. The feature does not diagnose, classify, estimate ability or mastery, alter lesson difficulty or pacing, or block progress. The hint is a general metacognitive cue, not an answer to the lesson question.

## Validation

Unit tests cover each support format, the trigger boundary, lesson isolation, and rejection of invalid stored preference values. Run `npm test`, `npm run typecheck`, and `npm run build` in the project environment before merging. GitHub file operations do not execute these commands.
