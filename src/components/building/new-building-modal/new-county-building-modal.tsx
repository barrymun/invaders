import { FC, useCallback, useMemo } from "react";

import { countyBuildingEmojiMap, maxCountyBuildings, maxTownBuildings } from "@db/consts";
import { getDb } from "@db/db";
import { canBuildCountyBuilding } from "@db/helpers";
import { CountyBuilding } from "@db/models";
import { useBuildingModal } from "@hooks/use-building-modal";
import { usePlayer } from "@hooks/use-player";
import { useSelectedCity } from "@hooks/use-selected-city";
import { FixedLengthArray, ZeroToNumberRange } from "@utils/types";

import { CanBuildNewBuildingProps, NewBuildingModal } from "./new-building-modal";

const db = getDb();

interface NewCountyBuildingModalProps {
  setSelectedBuildingType: (type: CountyBuilding["type"]) => void;
}

const NewCountyBuildingModal: FC<NewCountyBuildingModalProps> = (props) => {
  const { setSelectedBuildingType } = props;

  const { player } = usePlayer();
  const { selectedCity, countyBuildings } = useSelectedCity();
  const { selectedBuildingIndex, selectedBuildingType, close } = useBuildingModal();

  const mergedCountyBuildings = useMemo(
    () =>
      (
        new Array(maxCountyBuildings).fill(null) as FixedLengthArray<CountyBuilding | null, typeof maxCountyBuildings>
      ).map((_, index) => countyBuildings.find((b) => b.index === index) ?? null),
    [countyBuildings]
  );

  const canBuildFn = useCallback(
    ({ buildingIndex }: CanBuildNewBuildingProps) => {
      return canBuildCountyBuilding({
        buildings: mergedCountyBuildings,
        buildingIndex,
      });
    },
    [mergedCountyBuildings]
  );

  const handleSelectBuildingType = (index: number) => () => {
    if (selectedBuildingIndex === null) {
      return;
    }
    const proposedBuildingType = Object.keys(countyBuildingEmojiMap)[index] as CountyBuilding["type"];
    if (!canBuildFn({ buildingIndex: selectedBuildingIndex, proposedBuildingType })) {
      return;
    }
    setSelectedBuildingType(proposedBuildingType);
  };

  const handleConfirmBuild = async () => {
    if (selectedBuildingIndex === null || selectedBuildingType === null) {
      return;
    }

    if (!canBuildFn({ buildingIndex: selectedBuildingIndex, proposedBuildingType: selectedBuildingType })) {
      return;
    }

    await db.countyBuildings.add({
      playerId: player.id,
      cityId: selectedCity.id,
      level: 1,
      type: selectedBuildingType as CountyBuilding["type"],
      index: selectedBuildingIndex as ZeroToNumberRange<typeof maxTownBuildings>,
    });
    close();
  };

  return (
    <NewBuildingModal
      canBuildFn={canBuildFn}
      handleSelectBuildingType={handleSelectBuildingType}
      handleConfirmBuild={handleConfirmBuild}
    />
  );
};

export { NewCountyBuildingModal };
