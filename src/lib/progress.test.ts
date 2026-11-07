import { describe, expect, it } from "vitest";
import { calculateAccuracy, calculateMastery, calculateXp, type Attempt } from "./progress";

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

  it("calculates mastery from unique completed lessons", () => {
    expect(calculateMastery(["fractions", "fractions", "algebra"], 4)).toBe(50);
    expect(calculateMastery([], 0)).toBe(0);
  });

  it("awards XP once per lesson with a correct answer", () => {
    expect(calculateXp(attempts)).toBe(10);
    expect(calculateXp([])).toBe(0);
  });
});
