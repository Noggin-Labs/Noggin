import { describe, expect, it } from "vitest";
import { getLearningSupportSuggestion, isLearningSupportFormat } from "./model";
import type { Attempt } from "../../lib/progress";

const attempt = (correct: boolean, lessonId = "fractions"): Attempt => ({
  lessonId,
  correct,
  at: "2026-11-28T10:00:00.000Z"
});

const twoIncorrect = [attempt(false), attempt(false)];

describe("getLearningSupportSuggestion", () => {
  it("offers the default worked-example prompt after two incorrect answers", () => {
    expect(getLearningSupportSuggestion(twoIncorrect, "fractions")).toMatchObject({
      kind: "worked-example",
      title: "Revisit the worked example"
    });
  });

  it("returns the learner-selected hint format", () => {
    expect(getLearningSupportSuggestion(twoIncorrect, "fractions", "hint")).toMatchObject({
      kind: "hint",
      title: "A small hint"
    });
  });

  it("returns the learner-selected step-by-step format", () => {
    expect(getLearningSupportSuggestion(twoIncorrect, "fractions", "step-by-step")).toMatchObject({
      kind: "step-by-step",
      title: "Break it into steps"
    });
  });

  it("does not make a suggestion before two attempts", () => {
    expect(getLearningSupportSuggestion([attempt(false)], "fractions")).toBeNull();
  });

  it("does not make a suggestion when the latest two attempts include a correct answer", () => {
    expect(getLearningSupportSuggestion([attempt(false), attempt(true)], "fractions")).toBeNull();
  });

  it("considers only attempts for the active lesson", () => {
    expect(getLearningSupportSuggestion([attempt(false), attempt(false, "algebra")], "fractions")).toBeNull();
  });

  it("uses the two most recent attempts for the active lesson", () => {
    expect(getLearningSupportSuggestion([...twoIncorrect, attempt(true)], "fractions")).toBeNull();
  });

  it("rejects unknown stored support formats", () => {
    expect(isLearningSupportFormat("hint")).toBe(true);
    expect(isLearningSupportFormat("visual-learner")).toBe(false);
    expect(isLearningSupportFormat(null)).toBe(false);
  });
});
