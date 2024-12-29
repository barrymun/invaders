import forOwn from "lodash/forOwn";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import shuffle from "lodash/shuffle";
import uniq from "lodash/uniq";

function collectAllKeys<T extends object>(obj: T): string[] {
  const foundKeys: string[] = [];
  const recurse = (currentObj: object) => {
    forOwn(currentObj, (value, key) => {
      foundKeys.push(key);
      if (isObject(value) && !isArray(value)) {
        recurse(value);
      }
    });
  };
  recurse(obj);
  return foundKeys;
}

export function getAllKeys<T extends object>(obj: T): string[] {
  return uniq(collectAllKeys(obj));
}

export function hasAllKeys<T extends object>(obj: T, keys: string[]): boolean {
  const foundKeys = collectAllKeys(obj);
  return keys.every((key) => foundKeys.includes(key));
}

export function shuffleArray<T>(array: T[]): T[] {
  return shuffle(array);
}

export function convertTo2DArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("Size must be greater than 0");
  }

  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
