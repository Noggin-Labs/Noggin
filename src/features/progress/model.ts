export type Attempt = {
  lessonId: string;
  correct: boolean;
  at: string;
};

/**
 * Calculates the percentage of submitted answers that were correct.
 * An unanswered learner has no measured accuracy, represented here as 0.
 */
export function calculateAccuracy(attempts: Attempt[]): number {
  if (attempts.length === 0) return 0;
  return Math.round((attempts.filter((item) => item.correct).length / attempts.length) * 100);
}

/**
 * Calculates completion against the current lesson count.
 * Duplicate completion IDs do not inflate mastery.
 */
export function calculateMastery(completed: string[], totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  return Math.min(100, Math.round((new Set(completed).size / totalLessons) * 100));
}

/**
 * Awards XP once per lesson with at least one correct attempt.
 * This is a prototype scoring rule, not a measure of ability.
 */
export function calculateXp(attempts: Attempt[]): number {
  const firstCorrectCompletion = new Set<string>();
  for (const attempt of attempts) {
    if (attempt.correct) firstCorrectCompletion.add(attempt.lessonId);
  }
  return firstCorrectCompletion.size * 10;
}
