import type { Attempt } from "../../lib/progress";

export type LearningSupportFormat = "worked-example" | "hint" | "step-by-step";

export function isLearningSupportFormat(value: unknown): value is LearningSupportFormat {
  return value === "worked-example" || value === "hint" || value === "step-by-step";
}

export type LearningSupportSuggestion = {
  kind: LearningSupportFormat;
  title: string;
  message: string;
};

/**
 * Returns an optional support prompt when the learner's two most recent
 * answers for this lesson were both incorrect. The learner chooses its format.
 * This is a transparent interaction rule, not a diagnosis or ability estimate.
 */
export function getLearningSupportSuggestion(
  attempts: Attempt[],
  lessonId: string,
  format: LearningSupportFormat = "worked-example"
): LearningSupportSuggestion | null {
  const recentForLesson = attempts
    .filter((attempt) => attempt.lessonId === lessonId)
    .slice(-2);

  if (recentForLesson.length < 2 || recentForLesson.some((attempt) => attempt.correct)) {
    return null;
  }

  const suggestions: Record<LearningSupportFormat, Omit<LearningSupportSuggestion, "kind">> = {
    "worked-example": {
      title: "Revisit the worked example",
      message: "Your last two answers on this lesson were not correct. You can review the worked example, then decide whether you want to try again."
    },
    hint: {
      title: "A small hint",
      message: "Your last two answers on this lesson were not correct. Start by identifying what the question asks, then find the part of the worked example that uses the same idea."
    },
    "step-by-step": {
      title: "Break it into steps",
      message: "Your last two answers on this lesson were not correct. Here are the steps from this lesson's worked example to help you trace the reasoning."
    }
  };

  return { kind: format, ...suggestions[format] };
}
