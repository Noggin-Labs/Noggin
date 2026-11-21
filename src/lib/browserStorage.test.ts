import { describe, expect, it } from "vitest";
import { readStoredValue, writeStoredValue, type StorageProvider } from "./browserStorage";

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const getStorage: StorageProvider = () => ({
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); }
  });
  return { getStorage, values };
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

describe("browser storage", () => {
  it("reads valid JSON that passes its runtime validator", () => {
    const { getStorage } = memoryStorage({ completed: '["fractions"]' });
    expect(readStoredValue("completed", [], isStringArray, getStorage)).toEqual(["fractions"]);
  });

  it("uses the fallback for missing, malformed, or wrongly shaped values", () => {
    const { getStorage } = memoryStorage({
      missingShape: '{"lessonId":"fractions"}',
      malformed: "{not json"
    });

    expect(readStoredValue("absent", ["default"], isStringArray, getStorage)).toEqual(["default"]);
    expect(readStoredValue("missingShape", [], isStringArray, getStorage)).toEqual([]);
    expect(readStoredValue("malformed", [], isStringArray, getStorage)).toEqual([]);
  });

  it("uses the fallback when storage access throws", () => {
    const unavailable: StorageProvider = () => { throw new Error("storage blocked"); };
    expect(readStoredValue("key", "safe default", (value): value is string => typeof value === "string", unavailable))
      .toBe("safe default");
  });

  it("writes JSON and reports success", () => {
    const { getStorage, values } = memoryStorage();
    expect(writeStoredValue("completed", ["fractions"], getStorage)).toBe(true);
    expect(values.get("completed")).toBe('["fractions"]');
  });

  it("reports a failed write without throwing", () => {
    const unavailable: StorageProvider = () => ({
      getItem: () => null,
      setItem: () => { throw new Error("quota exceeded"); }
    });
    expect(writeStoredValue("completed", [], unavailable)).toBe(false);
  });
});
