import { GlobalState } from "utils/global-state/types";

export const defaultGlobalState: GlobalState = {
  player: {
    name: "",
    flag: "",
  },
  city: {
    name: "",
    townHall: {
      level: 1,
    },
    walls: {
      level: 1,
    },
    innerCity: {
      buildings: [],
    },
    outerCity: {
      buildings: [],
    },
  },
};
