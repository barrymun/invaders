import { describe, it, expect } from "vitest";

import { getDb, worldMapSize } from "db";

const db = getDb();

describe("testWorldMap", () => {
  it("world map should be generated and should contain data", async () => {
    const worldMapData = await db.worldMap.toArray();
    expect(worldMapData.length).toBe(worldMapSize * worldMapSize);
  });
});
