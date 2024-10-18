import { FC, useCallback } from "react";

import { useBuildingModal, useSelectedCity } from "hooks";
import { canBuildCountyBuilding, CountyBuilding, countyBuildingEmojiMap } from "utils/global-state";

import { CanBuildNewBuildingProps, NewBuildingModal } from "./new-building-modal";

interface NewCountyBuildingModalProps {
  setSelectedBuildingType: (type: CountyBuilding["type"]) => void;
}

const NewCountyBuildingModal: FC<NewCountyBuildingModalProps> = (props) => {
  const { setSelectedBuildingType } = props;

  const { selectedCity } = useSelectedCity();
  const { selectedBuildingIndex } = useBuildingModal();

  const canBuildFn = useCallback(
    ({ buildingIndex }: CanBuildNewBuildingProps) => {
      return canBuildCountyBuilding({
        buildings: selectedCity.county.buildings,
        buildingIndex,
      });
    },
    [selectedCity]
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

  return <NewBuildingModal canBuildFn={canBuildFn} handleSelectBuildingType={handleSelectBuildingType} />;
};

export { NewCountyBuildingModal };
