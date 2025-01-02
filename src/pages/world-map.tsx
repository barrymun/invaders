import { FC } from "react";

import { WorldMap as WorldMapComponent } from "@components/world-map";

interface WorldMapProps {}

export const WorldMap: FC<WorldMapProps> = () => {
  return <WorldMapComponent />;
};
