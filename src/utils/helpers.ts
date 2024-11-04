import forOwn from "lodash/forOwn";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import shuffle from "lodash/shuffle";
import uniq from "lodash/uniq";

import { defaultCity, getDb, TileType, worldMapSize } from "db";

import { OneToFifteen } from "./types";

const db = getDb();

let isGeneratingWorldMapLock = false;

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

export async function generateWorldMap() {
  if ((await db.worldMap.count()) > 0) {
    console.info("World map already generated!");
    return;
  }

  if (isGeneratingWorldMapLock) {
    return;
  }
  isGeneratingWorldMapLock = true;

  const totalTiles = worldMapSize * worldMapSize;

  // create and shuffle coordinates for a worldMapSize x worldMapSize grid
  const coordinates: { x: number; y: number }[] = [];
  for (let x = 0; x < worldMapSize; x++) {
    for (let y = 0; y < worldMapSize; y++) {
      coordinates.push({ x, y });
    }
  }
  const shuffledCoordinates = shuffleArray(coordinates);

  // create 10 of each main tile type
  // retrieve the tile type from the db and add the tile type to the world map data
  // get the slice of shuffled coordinates equal to the number of tiles
  // ensure to increment the worldMapInsertOffset by the number of tiles

  const worldMapData = [];
  const defaultResourceBonusData = Array(10).fill({
    level: 1,
    resources: defaultCity.resources,
    troops: defaultCity.troops,
  });

  let worldMapInsertOffset = 0;

  await db.lakes.bulkAdd(defaultResourceBonusData);
  const lakes = await db.lakes.toArray();
  const lakeCoordinates = shuffledCoordinates.slice(worldMapInsertOffset, worldMapInsertOffset + lakes.length);
  for (const [index, { x, y }] of lakeCoordinates.entries()) {
    worldMapData.push({
      x: x as OneToFifteen,
      y: y as OneToFifteen,
      tileType: TileType.Lake,
      tileId: lakes[index].id,
    });
  }
  worldMapInsertOffset += lakes.length;

  await db.forests.bulkAdd(defaultResourceBonusData);
  const forests = await db.forests.toArray();
  const forestCoordinates = shuffledCoordinates.slice(worldMapInsertOffset, worldMapInsertOffset + forests.length);
  for (const [index, { x, y }] of forestCoordinates.entries()) {
    worldMapData.push({
      x: x as OneToFifteen,
      y: y as OneToFifteen,
      tileType: TileType.Forest,
      tileId: forests[index].id,
    });
  }
  worldMapInsertOffset += forests.length;

  await db.deserts.bulkAdd(defaultResourceBonusData);
  const deserts = await db.deserts.toArray();
  const desertCoordinates = shuffledCoordinates.slice(worldMapInsertOffset, worldMapInsertOffset + deserts.length);
  for (const [index, { x, y }] of desertCoordinates.entries()) {
    worldMapData.push({
      x: x as OneToFifteen,
      y: y as OneToFifteen,
      tileType: TileType.Desert,
      tileId: deserts[index].id,
    });
  }
  worldMapInsertOffset += deserts.length;

  await db.mountains.bulkAdd(defaultResourceBonusData);
  const mountains = await db.mountains.toArray();
  const mountainCoordinates = shuffledCoordinates.slice(worldMapInsertOffset, worldMapInsertOffset + mountains.length);
  for (const [index, { x, y }] of mountainCoordinates.entries()) {
    worldMapData.push({
      x: x as OneToFifteen,
      y: y as OneToFifteen,
      tileType: TileType.Mountain,
      tileId: mountains[index].id,
    });
  }
  worldMapInsertOffset += mountains.length;

  // create 10 NPCs
  await db.npcs.bulkAdd(
    Array(10).fill({
      name: "NPC",
      resources: defaultCity.resources,
      troops: defaultCity.troops,
      townHall: { level: 1 },
      walls: { level: 1 },
    })
  );
  const npcs = await db.npcs.toArray();
  const npcCoordinates = shuffledCoordinates.slice(worldMapInsertOffset, worldMapInsertOffset + npcs.length);
  for (const [index, { x, y }] of npcCoordinates.entries()) {
    worldMapData.push({
      x: x as OneToFifteen,
      y: y as OneToFifteen,
      tileType: TileType.NPC,
      tileId: npcs[index].id,
    });
  }
  worldMapInsertOffset += npcs.length;

  // add the player city to the world map
  const city = (await db.cities.toArray())[0];
  const cityCoordinates = shuffledCoordinates.slice(worldMapInsertOffset, worldMapInsertOffset + 1);
  worldMapData.push({
    x: cityCoordinates[0].x as OneToFifteen,
    y: cityCoordinates[0].y as OneToFifteen,
    tileType: TileType.City,
    tileId: city.id,
  });
  worldMapInsertOffset += 1;

  // fill the rest of the world map with flat tiles
  db.flats.bulkAdd(
    Array(totalTiles - worldMapInsertOffset).fill({
      resources: defaultCity.resources,
      troops: defaultCity.troops,
    })
  );
  const flats = await db.flats.toArray();
  const flatCoordinates = shuffledCoordinates.slice(worldMapInsertOffset, totalTiles);
  for (const [index, { x, y }] of flatCoordinates.entries()) {
    worldMapData.push({
      x: x as OneToFifteen,
      y: y as OneToFifteen,
      tileType: TileType.Flat,
      tileId: flats[index].id,
    });
  }

  const sortedWorldMapData = worldMapData.sort((a, b) => {
    if (a.x === b.x) {
      return a.y - b.y; // when x is the same, sort by y
    }
    return a.x - b.x; // otherwise, sort by x
  });

  await db.worldMap.bulkAdd(sortedWorldMapData);
  console.info("World map generated successfully!");

  isGeneratingWorldMapLock = false;
}
