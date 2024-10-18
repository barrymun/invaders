import { FixedLengthArray } from "utils";
import { CountyBuilding, GlobalState, ResourceType, TownBuilding, TroopType } from "utils/global-state";

export const globalStateTimeout = 1000 * 15; // 15 seconds

export const resourceBaseProductionRate = 10;

export const maxTownBuildings = 32;

export const maxCountyBuildings = 40;

export const defaultProductionRatePerHour = 100;

export const maxNonCottageNonBarracksBuildings = 1;

export const goldEmoji = "💰";

export const resourceEmojiMap: Record<ResourceType, string> = {
  food: "🌾",
  lumber: "🪵",
  stone: "🪨",
  iron: "🪙",
};

export const troopEmojiMap: Record<TroopType, string> = {
  worker: "⛏️",
  warrior: "🪓",
  scout: "🥷",
  swordsman: "🗡️",
  pikeman: "🔱",
  archer: "🏹",
  cavalry: "🐎",
  cataphract: "🛡️",
  transporter: "🫏",
  batteringRam: "💣",
  ballista: "🎯",
  catapult: "💥",
};

export const townHallEmoji = "🏛️";

export const wallsEmoji = "🏰";

export const emptyTownLandEmoji = "🌲";

export const townBuildingEmojiMap: Record<TownBuilding["type"], string> = {
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

export const emptyCountyLandEmoji = "🌳";

export const countyBuildingEmojiMap: Record<CountyBuilding["type"], string> = {
  farm: "🚜",
  sawmill: "🪚",
  quarry: "🏗️",
  mine: "🏭",
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
        buildings: new Array(maxTownBuildings).fill(null) as FixedLengthArray<
          TownBuilding | null,
          typeof maxTownBuildings
        >,
      },
      county: {
        buildings: new Array(maxCountyBuildings).fill(null) as FixedLengthArray<
          CountyBuilding | null,
          typeof maxCountyBuildings
        >,
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
        batteringRam: 10,
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
        buildings: new Array(maxTownBuildings).fill(null) as FixedLengthArray<
          TownBuilding | null,
          typeof maxTownBuildings
        >,
      },
      county: {
        buildings: new Array(maxCountyBuildings).fill(null) as FixedLengthArray<
          CountyBuilding | null,
          typeof maxCountyBuildings
        >,
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
        batteringRam: 10,
        ballista: 10,
        catapult: 10,
      },
    },
  ],
};
