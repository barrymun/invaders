import { describe, it, expect } from "vitest";

import { getDb, worldMapSize } from "db";

import { generateWorldMap } from "./helpers";

const db = getDb();

describe("generateWorldMap", () => {
  it("should generate a world map", async () => {
    await generateWorldMap();
    const worldMapData = await db.worldMap.toArray();
    expect(worldMapData.length).toBe(worldMapSize * worldMapSize);
  });
});
