import Dexie from "dexie";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

describe("IndexedDB operations", () => {
  let db: Dexie;

  beforeAll(() => {
    db = new Dexie("TestDatabase");
    db.version(1).stores({
      testStore: "++id,name,value",
    });
  });

  afterEach(async () => {
    // clear data after each test
    await db.table("testStore").clear();
  });

  afterAll(async () => {
    // delete the database after all tests are complete
    await db.delete();
  });

  it("should add and retrieve data from IndexedDB", async () => {
    await db.table("testStore").add({ name: "test", value: 42 });
    const result = await db.table("testStore").get({ name: "test" });
    expect(result.value).toBe(42);
  });
});
