import { FC } from "react";

import { Town as TownComponent } from "@components/town";

interface TownProps {}

export const Town: FC<TownProps> = () => {
  return <TownComponent />;
};
