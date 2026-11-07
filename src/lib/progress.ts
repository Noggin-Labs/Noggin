export type Attempt = { lessonId: string; correct: boolean; at: string };

export function calculateAccuracy(attempts: Attempt[]): number {
  if (attempts.length === 0) return 0;
  return Math.round((attempts.filter((item) => item.correct).length / attempts.length) * 100);
}

export function calculateMastery(completed: string[], totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  return Math.min(100, Math.round((new Set(completed).size / totalLessons) * 100));
}

export function calculateXp(attempts: Attempt[]): number {
  const firstCorrectCompletion = new Set<string>();
  for (const attempt of attempts) {
    if (attempt.correct) firstCorrectCompletion.add(attempt.lessonId);
  }
  return firstCorrectCompletion.size * 10;
}
