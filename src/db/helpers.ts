import { defaultCountryFlag, maxNonCottageNonBarracksBuildings, resourceBaseProductionRate } from "./consts";
import { db } from "./db";
import { City, CountyBuilding, TownBuilding } from "./models";

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
