import { FC } from "react";

import { TownBuilding } from "db";

import { BuildingInfoModal } from "./building-info-modal";

interface TownBuildingInfoModalProps {
  setSelectedBuildingType: (type: TownBuilding["type"]) => void;
}

const TownBuildingInfoModal: FC<TownBuildingInfoModalProps> = () => {
  return <BuildingInfoModal />;
};

export { TownBuildingInfoModal };
