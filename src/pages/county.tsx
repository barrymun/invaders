import { FC } from "react";

import { County as CountyComponent } from "@components/county";

interface CountyProps {}

export const County: FC<CountyProps> = () => {
  return <CountyComponent />;
};
