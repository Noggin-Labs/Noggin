export type Attempt = { correct: boolean; at: string };

export function calculateAccuracy(attempts: Attempt[]): number {
  if (attempts.length === 0) return 0;
  return Math.round((attempts.filter((item) => item.correct).length / attempts.length) * 100);
}

export function calculateMastery(completed: string[], totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  return Math.min(100, Math.round((new Set(completed).size / totalLessons) * 100));
}

export function calculateXp(attempts: Attempt[]): number {
  return attempts.reduce((total, attempt) => total + (attempt.correct ? 10 : 0), 0);
}
