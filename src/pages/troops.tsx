import { FC } from "react";

import { Troops as TroopsComponent } from "@components/troops";

interface TroopsProps {}

const Troops: FC<TroopsProps> = () => {
  return <TroopsComponent />;
};

export { Troops };
