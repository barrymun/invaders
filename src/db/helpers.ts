import { faker } from "@faker-js/faker/locale/en";

import { OneToOneHundred } from "utils";

import {
  defaultCountryFlag,
  maxHeroCount,
  maxHeroStat,
  maxNonCottageNonBarracksBuildings,
  minHeroStat,
  resourceBaseProductionRate,
} from "./consts";
import { db } from "./db";
import { City, CountyBuilding, Hero, HirableHero, TownBuilding } from "./models";

let isGeneratingRandomHeroesLock = false;
let isRecruitingHeroLock = false;

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

export function getFlagEmoji(countryCode: string | null) {
  if (!countryCode) {
    return defaultCountryFlag;
  }
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
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
