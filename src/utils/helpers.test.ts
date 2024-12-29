import { describe, it, expect } from "vitest";

import { convertTo2DArray, getAllKeys, hasAllKeys, shuffleArray } from "./helpers";

describe("utils.helpers", () => {
  describe(getAllKeys.name, () => {
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

  describe(hasAllKeys.name, () => {
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

  describe(shuffleArray.name, () => {
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

  describe(convertTo2DArray.name, () => {
    it("should divide an array into subarrays of specified size", () => {
      const input = [1, 2, 3, 4, 5, 6];
      const size = 2;
      const result = convertTo2DArray(input, size);
      expect(result).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it("should handle cases where the array length is not perfectly divisible by size", () => {
      const input = [1, 2, 3, 4, 5];
      const size = 2;
      const result = convertTo2DArray(input, size);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("should return an empty array when the input array is empty", () => {
      const input: number[] = [];
      const size = 2;
      const result = convertTo2DArray(input, size);
      expect(result).toEqual([]);
    });

    it("should return an array with one subarray if size is greater than the input array length", () => {
      const input = [1, 2, 3];
      const size = 5;
      const result = convertTo2DArray(input, size);
      expect(result).toEqual([[1, 2, 3]]);
    });

    it("should handle size of 1 correctly", () => {
      const input = [1, 2, 3, 4];
      const size = 1;
      const result = convertTo2DArray(input, size);
      expect(result).toEqual([[1], [2], [3], [4]]);
    });

    it("should throw an error when size is less than or equal to 0", () => {
      const input = [1, 2, 3];
      expect(() => convertTo2DArray(input, 0)).toThrow("Size must be greater than 0");
      expect(() => convertTo2DArray(input, -1)).toThrow("Size must be greater than 0");
    });

    it("should work with non-numeric elements", () => {
      const input = ["a", "b", "c", "d", "e"];
      const size = 2;
      const result = convertTo2DArray(input, size);
      expect(result).toEqual([["a", "b"], ["c", "d"], ["e"]]);
    });
  });
});
