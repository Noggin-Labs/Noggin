import type { Attempt } from "../../lib/progress";

export type LearningSupportSuggestion = {
  kind: "revisit-worked-example";
  title: string;
  message: string;
};

/**
 * Returns a small, optional support prompt when the learner's two most
 * recent answers for this lesson were both incorrect.
 *
 * This is a transparent interaction rule, not a diagnosis, ability estimate,
 * mastery score, or claim about why an answer was incorrect.
 */
export function getLearningSupportSuggestion(
  attempts: Attempt[],
  lessonId: string
): LearningSupportSuggestion | null {
  const recentForLesson = attempts
    .filter((attempt) => attempt.lessonId === lessonId)
    .slice(-2);

  if (recentForLesson.length < 2 || recentForLesson.some((attempt) => attempt.correct)) {
    return null;
  }

  return {
    kind: "revisit-worked-example",
    title: "A different way to approach this",
    message: "Your last two answers on this lesson were not correct. You could revisit the worked example, then try the question again. This is an optional suggestion—not a judgement about your ability."
  };
}
