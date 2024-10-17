import { FixedLengthArray } from "utils";
import { GlobalState, TownBuilding } from "utils/global-state";

export const globalStateTimeout = 1000 * 15; // 15 seconds

export const resourceBaseProductionRate = 10;

export const maxTownBuildings = 32;

export const defaultProductionRatePerHour = 100;

export const maxNonCottageNonBarracksBuildings = 1;

export const townHallEmoji = "🏛️";

export const wallsEmoji = "🏰";

export const emptyLandPlotEmoji = "🌲";

export const buildingEmojiMap: Record<TownBuilding["type"], string> = {
  barracks: "⚔️",
  cottage: "🏡",
  inn: "🏨",
  diningHall: "🍽️",
  market: "🏪",
  academy: "📚",
  rallySpot: "🚩",
  forge: "🔨",
  workshop: "🧰",
  reliefStation: "🚚",
  beaconTower: "🔭",
};

export const defaultGlobalState: GlobalState = {
  player: {
    name: "",
    flag: "",
    gold: 10000,
  },
  cities: [
    {
      name: "City 1",
      townHall: {
        level: 1,
      },
      walls: {
        level: 1,
      },
      town: {
        buildings: new Array(maxTownBuildings).fill(null) as FixedLengthArray<TownBuilding | null, 32>,
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
        lumber: 1000,
        stone: 1000,
        iron: 1000,
      },
      troops: {
        worker: 10,
        warrior: 10,
        scout: 10,
        swordsman: 10,
        pikeman: 10,
        archer: 10,
        cavalry: 10,
        cataphract: 10,
        transporter: 10,
        ram: 10,
        ballista: 10,
        catapult: 10,
      },
    },
    {
      name: "City 2",
      townHall: {
        level: 1,
      },
      walls: {
        level: 1,
      },
      town: {
        buildings: new Array(maxTownBuildings).fill(null) as FixedLengthArray<TownBuilding | null, 32>,
      },
      country: {
        buildings: [
          {
            level: 1,
            type: "farm",
          },
          {
            level: 10,
            type: "sawmill",
          },
          {
            level: 10,
            type: "sawmill",
          },
          {
            level: 10,
            type: "sawmill",
          },
        ],
      },
      resources: {
        food: 1000,
        lumber: 1000,
        stone: 1000,
        iron: 1000,
      },
      troops: {
        worker: 10,
        warrior: 10,
        scout: 10,
        swordsman: 10,
        pikeman: 10,
        archer: 10,
        cavalry: 10,
        cataphract: 10,
        transporter: 10,
        ram: 10,
        ballista: 10,
        catapult: 10,
      },
    },
  ],
};
