import { resouceBaseProductionRate } from "./consts";
import { CountryBuilding, GlobalState } from "./types";

function calculateCountryBuildingProductionRate({
  currentState,
  type,
}: {
  currentState: GlobalState;
  type: CountryBuilding["type"];
}): number {
  return currentState.city.country.buildings
    .filter((b) => b.type === type)
    .map((b) => b.level * b.level * resouceBaseProductionRate)
    .reduce((acc, level) => acc + level, 0);
}

export function calculateResourceUpdates(currentState: GlobalState): GlobalState["city"]["resources"] {
  const farmBonus = calculateCountryBuildingProductionRate({ currentState, type: "farm" });
  const sawmillBonus = calculateCountryBuildingProductionRate({ currentState, type: "sawmill" });
  const quarryBonus = calculateCountryBuildingProductionRate({ currentState, type: "quarry" });
  const mineBonus = calculateCountryBuildingProductionRate({ currentState, type: "mine" });

  return {
    food: currentState.city.resources.food + farmBonus,
    wood: currentState.city.resources.wood + sawmillBonus,
    stone: currentState.city.resources.stone + quarryBonus,
    iron: currentState.city.resources.iron + mineBonus,
  };
}
