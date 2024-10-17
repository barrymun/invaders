import { maxNonCottageNonBarracksBuildings, resourceBaseProductionRate } from "./consts";
import { City, CountryBuilding, GlobalState, TownBuilding } from "./types";

function calculateCountryBuildingProductionRate({ city, type }: { city: City; type: CountryBuilding["type"] }): number {
  return city.country.buildings
    .filter((b) => b !== null && b.type === type)
    .map((b) => (b ? b.level * b.level * resourceBaseProductionRate : 0))
    .reduce((acc, level) => acc + level, 0);
}

export function calculateCityResourceUpdates(currentState: GlobalState): City[] {
  let res: City[] = [];
  for (const city of currentState.cities) {
    const farmBonus = calculateCountryBuildingProductionRate({ city, type: "farm" });
    const sawmillBonus = calculateCountryBuildingProductionRate({ city, type: "sawmill" });
    const quarryBonus = calculateCountryBuildingProductionRate({ city, type: "quarry" });
    const mineBonus = calculateCountryBuildingProductionRate({ city, type: "mine" });
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
  return res;
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
