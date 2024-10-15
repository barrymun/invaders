import { resourceBaseProductionRate } from "./consts";
import { City, CountryBuilding, GlobalState } from "./types";

function calculateCountryBuildingProductionRate({ city, type }: { city: City; type: CountryBuilding["type"] }): number {
  return city.country.buildings
    .filter((b) => b.type === type)
    .map((b) => b.level * b.level * resourceBaseProductionRate)
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
          wood: city.resources.wood + sawmillBonus,
          stone: city.resources.stone + quarryBonus,
          iron: city.resources.iron + mineBonus,
        },
      },
    ];
  }
  return res;
}
