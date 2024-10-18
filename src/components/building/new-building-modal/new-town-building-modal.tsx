import { FC, useCallback } from "react";

import { useBuildingModal, useSelectedCity } from "hooks";
import { townBuildingEmojiMap, canBuildTownBuilding, TownBuilding } from "utils/global-state";

import { CanBuildNewBuildingProps, NewBuildingModal } from "./new-building-modal";

interface NewTownBuildingModalProps {
  setSelectedBuildingType: (type: TownBuilding["type"]) => void;
}

const NewTownBuildingModal: FC<NewTownBuildingModalProps> = (props) => {
  const { setSelectedBuildingType } = props;

  const { selectedCity } = useSelectedCity();
  const { selectedBuildingIndex } = useBuildingModal();

  const canBuildFn = useCallback(
    ({ buildingIndex, proposedBuildingType }: CanBuildNewBuildingProps) => {
      return canBuildTownBuilding({
        buildings: selectedCity.town.buildings,
        buildingIndex,
        proposedBuildingType: proposedBuildingType as TownBuilding["type"],
      });
    },
    [selectedCity]
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

  return <NewBuildingModal canBuildFn={canBuildFn} handleSelectBuildingType={handleSelectBuildingType} />;
};

export { NewTownBuildingModal };
