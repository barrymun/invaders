import { FC } from "react";

import { HeroGear as HeroGearComponent } from "@components/hero-gear";

interface HeroGearProps {}

export const HeroGear: FC<HeroGearProps> = () => {
  return <HeroGearComponent />;
};
