import { describe, it, expect } from "vitest";

import { worldMapSize } from "./consts";
import { getDb } from "./db";
import { generateWorldMap } from "./helpers";

const db = getDb();

describe("db.helpers", () => {
  describe(generateWorldMap.name, () => {
    it("world map should be generated and should contain data", async () => {
      const worldMapData = await db.worldMap.toArray();
      expect(worldMapData.length).toBe(worldMapSize * worldMapSize);
    });
  });
});
