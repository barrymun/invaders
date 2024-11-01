import { describe, it, expect } from "vitest";

import { getDb, worldMapSize } from "db";

import { generateWorldMap, getAllKeys, hasAllKeys, shuffleArray } from "./helpers";

const db = getDb();

describe("getAllKeys", () => {
  it("should return all keys from a flat object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = getAllKeys(obj);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should return all keys from a nested object", () => {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
    const result = getAllKeys(obj);
    expect(result).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("should return unique keys from an object with duplicate keys", () => {
    const obj = { a: 1, b: { a: 2, c: 3 } };
    const result = getAllKeys(obj);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should handle empty object", () => {
    const obj = {};
    const result = getAllKeys(obj);
    expect(result).toEqual([]);
  });

  it("should handle an object with different types of values", () => {
    const obj = { a: 1, b: "test", c: null, d: [1, 2, 3], e: { f: 4 } };
    const result = getAllKeys(obj);
    expect(result).toEqual(["a", "b", "c", "d", "e", "f"]);
  });
});

describe("hasAllKeys", () => {
  it("should return true if object has all specified keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = hasAllKeys(obj, ["a", "b"]);
    expect(result).toBe(true);
  });

  it("should return false if object is missing some specified keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = hasAllKeys(obj, ["a", "d"]);
    expect(result).toBe(false);
  });

  it("should return true if object has all keys, including nested ones", () => {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
    const result = hasAllKeys(obj, ["a", "b", "c", "d", "e"]);
    expect(result).toBe(true);
  });

  it("should handle empty object and return false when checking for keys", () => {
    const obj = {};
    const result = hasAllKeys(obj, ["a"]);
    expect(result).toBe(false);
  });

  it("should return true if no keys are provided to check", () => {
    const obj = { a: 1, b: 2 };
    const result = hasAllKeys(obj, []);
    expect(result).toBe(true);
  });
});

describe("shuffleArray", () => {
  it("should shuffle an array", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).not.toEqual(input);
  });

  it("should not change the length of the array", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.length).toBe(input.length);
  });

  it("should not change the elements of the array", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(input.sort());
  });
});

describe("generateWorldMap", () => {
  it("should generate a world map", async () => {
    await generateWorldMap();
    const worldMapData = await db.worldMap.toArray();
    expect(worldMapData.length).toBe(worldMapSize * worldMapSize);
  });
});
