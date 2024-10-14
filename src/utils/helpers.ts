import forOwn from "lodash/forOwn";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
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
