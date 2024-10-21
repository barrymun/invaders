import { FC, useCallback, useMemo } from "react";

import { townBuildingEmojiMap, canBuildTownBuilding, TownBuilding, maxTownBuildings, db } from "db";
import { useBuildingModal, usePlayer, useSelectedCity } from "hooks";
import { FixedLengthArray, ZeroToNumberRange } from "utils";

import { CanBuildNewBuildingProps, NewBuildingModal } from "./new-building-modal";

interface NewTownBuildingModalProps {
  setSelectedBuildingType: (type: TownBuilding["type"]) => void;
}

const NewTownBuildingModal: FC<NewTownBuildingModalProps> = (props) => {
  const { setSelectedBuildingType } = props;

  const { player } = usePlayer();
  const { selectedCity, townBuildings } = useSelectedCity();
  const { selectedBuildingIndex, selectedBuildingType, close } = useBuildingModal();

  const mergedTownBuildings = useMemo(
    () =>
      (new Array(maxTownBuildings).fill(null) as FixedLengthArray<TownBuilding | null, typeof maxTownBuildings>).map(
        (_, index) => townBuildings.find((b) => b.index === index) ?? null
      ),
    [townBuildings]
  );

  const canBuildFn = useCallback(
    ({ buildingIndex, proposedBuildingType }: CanBuildNewBuildingProps) => {
      return canBuildTownBuilding({
        buildings: mergedTownBuildings,
        buildingIndex,
        proposedBuildingType: proposedBuildingType as TownBuilding["type"],
      });
    },
    [mergedTownBuildings]
  );

  const handleSelectBuildingType = (index: number) => () => {
    if (selectedBuildingIndex === null) {
      return;
    }
    const proposedBuildingType = Object.keys(townBuildingEmojiMap)[index] as TownBuilding["type"];
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

    await db.townBuildings.add({
      playerId: player.id,
      cityId: selectedCity.id,
      level: 1,
      type: selectedBuildingType as TownBuilding["type"],
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

export { NewTownBuildingModal };
