import { FC } from "react";

import { CountyBuilding } from "db";

import { BuildingInfoModal } from "./building-info-modal";

interface CountyBuildingInfoModalProps {
  setSelectedBuildingType: (type: CountyBuilding["type"]) => void;
}

const CountyBuildingInfoModal: FC<CountyBuildingInfoModalProps> = () => {
  return <BuildingInfoModal />;
};

export { CountyBuildingInfoModal };
