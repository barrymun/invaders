import { GlobalState } from "utils/global-state/types";

export const globalStateTimeout = 1000 * 15; // 15 seconds
export const resourceBaseProductionRate = 10;
export const defaultGlobalState: GlobalState = {
  player: {
    name: "",
    flag: "",
    gold: 10000,
  },
  city: {
    name: "",
    townHall: {
      level: 1,
    },
    walls: {
      level: 1,
    },
    town: {
      buildings: [],
    },
    country: {
      buildings: [
        {
          level: 1,
          type: "farm",
        },
        {
          level: 1,
          type: "sawmill",
        },
        {
          level: 1,
          type: "quarry",
        },
        {
          level: 1,
          type: "mine",
        },
        {
          level: 10,
          type: "farm",
        },
      ],
    },
    resources: {
      food: 1000,
      wood: 1000,
      stone: 1000,
      iron: 1000,
    },
  },
};

export const defaultProductionRatePerHour = 100;
