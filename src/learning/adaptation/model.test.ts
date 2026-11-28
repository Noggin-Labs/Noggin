import { describe, expect, it } from "vitest";
import { getLearningSupportSuggestion } from "./model";
import type { Attempt } from "../../lib/progress";

const attempt = (correct: boolean, lessonId = "fractions"): Attempt => ({
  lessonId,
  correct,
  at: "2026-11-28T10:00:00.000Z"
});

describe("getLearningSupportSuggestion", () => {
  it("offers an optional worked-example revisit after two incorrect answers on the same lesson", () => {
    expect(getLearningSupportSuggestion([attempt(false), attempt(false)], "fractions")).toMatchObject({
      kind: "revisit-worked-example",
      title: "A different way to approach this"
    });
  });

  it("does not make a suggestion before two attempts", () => {
    expect(getLearningSupportSuggestion([attempt(false)], "fractions")).toBeNull();
  });

  it("does not make a suggestion when the latest two attempts include a correct answer", () => {
    expect(getLearningSupportSuggestion([attempt(false), attempt(true)], "fractions")).toBeNull();
  });

  it("considers only attempts for the active lesson", () => {
    expect(getLearningSupportSuggestion([attempt(false, "fractions"), attempt(false, "algebra")], "fractions")).toBeNull();
  });

  it("uses the two most recent attempts for the active lesson", () => {
    expect(getLearningSupportSuggestion([attempt(false), attempt(false), attempt(true)], "fractions")).toBeNull();
  });

  it("does not infer anything from attempts in another lesson", () => {
    expect(getLearningSupportSuggestion([attempt(false, "algebra"), attempt(false, "algebra")], "fractions")).toBeNull();
  });
});
