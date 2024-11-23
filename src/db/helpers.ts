import { faker } from "@faker-js/faker/locale/en";
import { getEmojiFlag, TCountryCode } from "countries-list";

import { OneToFifteen, OneToOneHundred, shuffleArray } from "utils";

import {
  defaultCity,
  defaultCountryFlag,
  maxHeroCount,
  maxHeroStat,
  maxNonCottageNonBarracksBuildings,
  minHeroStat,
  resourceBaseProductionRate,
  worldMapSize,
} from "./consts";
import { getDb } from "./db";
import { TileType } from "./enums";
import { City, CountyBuilding, Hero, HirableHero, TownBuilding } from "./models";

const db = getDb();

let isGeneratingRandomHeroesLock = false;
let isRecruitingHeroLock = false;
let isGeneratingWorldMapLock = false;

async function calculateCountyBuildingProductionRate({
  city,
  type,
}: {
  city: City;
  type: CountyBuilding["type"];
}): Promise<number> {
  const countyBuildings = await db.countyBuildings.where({ cityId: city.id }).toArray();
  return countyBuildings
    .filter((b) => b.type === type)
    .map((b) => (b ? b.level * b.level * resourceBaseProductionRate : 0))
    .reduce((acc, level) => acc + level, 0);
}

export async function updateCitiesResources(cities: City[]) {
  let res: City[] = [];
  for (const city of cities) {
    const farmBonus = await calculateCountyBuildingProductionRate({ city, type: "farm" });
    const sawmillBonus = await calculateCountyBuildingProductionRate({ city, type: "sawmill" });
    const quarryBonus = await calculateCountyBuildingProductionRate({ city, type: "quarry" });
    const mineBonus = await calculateCountyBuildingProductionRate({ city, type: "mine" });
    res = [
      ...res,
      {
        ...city,
        resources: {
          food: city.resources.food + farmBonus,
          lumber: city.resources.lumber + sawmillBonus,
          stone: city.resources.stone + quarryBonus,
          iron: city.resources.iron + mineBonus,
        },
      },
    ];
  }
  await db.cities.bulkPut(res);
}

export function getEmojiFlagExtended(countryCode: TCountryCode | null) {
  if (!countryCode) {
    return defaultCountryFlag;
  }
  return getEmojiFlag(countryCode);
}

export function canBuildTownBuilding({
  buildings,
  buildingIndex,
  proposedBuildingType,
}: {
  buildings: (TownBuilding | null)[];
  buildingIndex: number;
  proposedBuildingType: TownBuilding["type"];
}): boolean {
  // cannot build on top of existing building
  if (buildings[buildingIndex] !== null) {
    return false;
  }
  // multiple cottages and barracks are allowed
  if (proposedBuildingType === "cottage" || proposedBuildingType === "barracks") {
    return true;
  }
  return buildings.filter((b) => b?.type === proposedBuildingType).length < maxNonCottageNonBarracksBuildings;
}

export function canBuildCountyBuilding({
  buildings,
  buildingIndex,
}: {
  buildings: (CountyBuilding | null)[];
  buildingIndex: number;
}): boolean {
  // cannot build on top of existing building
  if (buildings[buildingIndex] !== null) {
    return false;
  }
  // no restrictions on number of county buildings
  return true;
}

function generateRandomHeroStat(): number {
  return Math.floor(Math.random() * (maxHeroStat - minHeroStat + 1)) + minHeroStat;
}

/**
 * if a hero is level 1 generate stats for politics, intelligence, and attack between a min and max
 * any higher than level 1 should do the same, but then 1 for each level to all of these stats
 */
function generateRandomHero(inn: TownBuilding): Omit<HirableHero, "id" | "playerId" | "cityId"> {
  const minHeroLevel = (inn.level - 1) * 10 + 1;
  const maxHeroLevel = inn.level * 10;
  const heroLevel = (Math.floor(Math.random() * (maxHeroLevel - minHeroLevel + 1)) + minHeroLevel) as OneToOneHundred;

  const bonus = heroLevel - 1;
  const politics = generateRandomHeroStat() + bonus;
  const intelligence = generateRandomHeroStat() + bonus;
  const attack = generateRandomHeroStat() + bonus;

  return {
    name: faker.person.firstName(),
    level: heroLevel,
    experience: 0,
    politics,
    intelligence,
    attack,
  };
}

export async function generateRandomHeroes({
  inn,
  playerId,
  cityId,
}: {
  inn: TownBuilding | undefined;
  playerId: number;
  cityId: number;
}) {
  if (!inn) {
    return [];
  }

  // prevent multiple calls to this function from running at the same time
  if (isGeneratingRandomHeroesLock) {
    return;
  }
  isGeneratingRandomHeroesLock = true;

  // get the count of hireable heroes and keep hiring until we reach the level of the inn
  let hireableHeroCount = await db.hireableHeroes.where({ playerId, cityId }).count();
  const currentInnLevel = inn.level;
  while (hireableHeroCount < currentInnLevel) {
    const partialHeroData = generateRandomHero(inn);
    await db.hireableHeroes.add({ ...partialHeroData, playerId, cityId });
    hireableHeroCount += 1;
  }
  isGeneratingRandomHeroesLock = false;
}

export function canRecruitHero({ townBuildings, heroes }: { townBuildings: TownBuilding[]; heroes: Hero[] }): boolean {
  const diningHall = townBuildings.find((b) => b.type === "diningHall");
  if (!diningHall) {
    return false;
  }
  if (heroes.length >= maxHeroCount) {
    return false;
  }
  return diningHall.level > heroes.length;
}

export async function recruitHero({
  townBuildings,
  heroes,
  hireableHero,
}: {
  townBuildings: TownBuilding[];
  heroes: Hero[];
  hireableHero: HirableHero;
  playerId: number;
  cityId: number;
}): Promise<boolean> {
  if (!canRecruitHero({ townBuildings, heroes })) {
    return false;
  }

  if (isRecruitingHeroLock) {
    return false;
  }
  isRecruitingHeroLock = true;

  await db.heroes.add(hireableHero);
  await db.hireableHeroes.delete(hireableHero.id);
  await generateRandomHeroes({
    inn: townBuildings.find((b) => b.type === "inn"),
    playerId: hireableHero.playerId,
    cityId: hireableHero.cityId,
  });

  isRecruitingHeroLock = false;
  return true;
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

  isGeneratingWorldMapLock = false;
}
