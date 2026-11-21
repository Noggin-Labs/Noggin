import { describe, expect, it } from "vitest";
import { calculateAccuracy, calculateCompletionRate, calculateMastery, calculateXp, type Attempt } from "./progress";

const attempts: Attempt[] = [
  { lessonId: "fractions", correct: true, at: "2026-11-07T10:00:00.000Z" },
  { lessonId: "algebra", correct: false, at: "2026-11-07T10:01:00.000Z" },
  { lessonId: "fractions", correct: true, at: "2026-11-07T10:02:00.000Z" }
];

describe("learning progress calculations", () => {
  it("calculates accuracy from submitted answers", () => {
    expect(calculateAccuracy(attempts)).toBe(67);
    expect(calculateAccuracy([])).toBe(0);
  });

  it("calculates curriculum completion from unique completed lessons, not mastery", () => {
    expect(calculateCompletionRate(["fractions", "fractions", "algebra"], 4)).toBe(50);
    expect(calculateCompletionRate([], 0)).toBe(0);
    expect(calculateCompletionRate(["fractions", "algebra"], 1)).toBe(100);
    expect(calculateMastery(["fractions"], 2)).toBe(50);
  });

  it("awards XP once per lesson with a correct answer", () => {
    expect(calculateXp(attempts)).toBe(10);
    expect(calculateXp([])).toBe(0);
  });
});
