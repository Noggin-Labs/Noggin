import { describe, expect, it } from "vitest";
import { courses, lessons } from "./model";

describe("curriculum catalog integrity", () => {
  it("uses unique course and lesson identifiers", () => {
    expect(new Set(courses.map((course) => course.id)).size).toBe(courses.length);
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length);
  });

  it("keeps every lesson attached to an existing course", () => {
    const courseIds = new Set(courses.map((course) => course.id));
    expect(lessons.every((lesson) => courseIds.has(lesson.courseId))).toBe(true);
    for (const lesson of lessons) {
      expect(courses.find((course) => course.id === lesson.courseId)?.lessonIds).toContain(lesson.id);
    }
  });

  it("keeps course lesson references valid and consistent", () => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id));
    for (const course of courses) {
      expect(course.lessonIds.length).toBeGreaterThan(0);
      expect(new Set(course.lessonIds).size).toBe(course.lessonIds.length);
      expect(course.lessonIds.every((lessonId) => lessonIds.has(lessonId))).toBe(true);
      for (const lessonId of course.lessonIds) {
        expect(lessons.find((lesson) => lesson.id === lessonId)?.courseId).toBe(course.id);
      }
    }
  });

  it("includes each correct answer among its lesson options", () => {
    for (const lesson of lessons) {
      expect(lesson.options).toContain(lesson.answer);
      expect(lesson.options.length).toBeGreaterThan(1);
    }
  });
});
