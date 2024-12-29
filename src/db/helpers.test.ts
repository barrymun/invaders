import { describe, it, expect } from "vitest";

import { generateWorldMap, getDb, worldMapSize } from "db";

const db = getDb();

describe("db.helpers", () => {
  describe(generateWorldMap.name, () => {
    it("world map should be generated and should contain data", async () => {
      const worldMapData = await db.worldMap.toArray();
      expect(worldMapData.length).toBe(worldMapSize * worldMapSize);
    });
  });
});
