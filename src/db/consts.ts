import { countries, getCountryCode, ICountry } from "countries-list";

import { getFlagEmoji } from "./helpers";
import { City, CountyBuilding, HeroGear, Player, TownBuilding } from "./models";
import { ResourceType, TroopType } from "./types";

export const worldMapSize = 15; // number of tiles on the x and y axis

export const playerNameMaxLength = 20;

export const minCities = 1;

export const maxCities = 10;

export const maxTownBuildings = 32;

export const maxCountyBuildings = 40;

export const defaultProductionRatePerHour = 100;

export const maxNonCottageNonBarracksBuildings = 1;

export const goldEmoji = "💰";

export const resourceUpdateTimeout = 1000 * 15; // 15 seconds

export const resourceBaseProductionRate = 10;

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

export const defaultCountryName = "Unaffiliated";

export const defaultCountryFlag = "🏳️";

export const defaultCountry: ICountry = {
  capital: "",
  continent: "EU",
  currency: [],
  languages: [],
  name: defaultCountryName,
  native: defaultCountryName,
  phone: [],
};

export const defaultCountryData = { defaultCountry, ...countries };

export const defaultCountrySelectData = Object.values(defaultCountryData).map((c) => ({
  value: c.name,
  label: `${c.name} ${getFlagEmoji(getCountryCode(c.name) || null)}`,
}));

export const defaultCity: Omit<City, "id" | "playerId"> = {
  index: 0,
  name: "City 1",
  townHall: {
    level: 1,
  },
  walls: {
    level: 1,
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
};

export const defaultPlayer: Omit<Player, "id"> = {
  name: "",
  country: defaultCountry,
  gold: 10000,
};

export const maxHeroCount = 10;

export const minHeroLevel = 1;

export const maxHeroLevel = 100;

export const minHeroStat = 10;

export const maxHeroStat = 100;

export const defaultHeroGear: Omit<HeroGear, "id" | "playerId"> = {
  weaponryLevel: 1,
  weaponryStarLevel: 1,
  mountTrainingLevel: 1,
  mountTrainingStarLevel: 1,
  charmLevel: 1,
  charmStarLevel: 1,
  helmetLevel: 1,
  helmetStarLevel: 1,
  chestArmorLevel: 1,
  chestArmorStarLevel: 1,
  gauntletsLevel: 1,
  gauntletsStarLevel: 1,
  legsArmorLevel: 1,
  legsArmorStarLevel: 1,
  shieldLevel: 1,
  shieldStarLevel: 1,
  necklaceLevel: 1,
  necklaceStarLevel: 1,
  ringLevel: 1,
  ringStarLevel: 1,
  spauldersLevel: 1,
  spauldersStarLevel: 1,
  backArmorLevel: 1,
  backArmorStarLevel: 1,
  beltLevel: 1,
  beltStarLevel: 1,
  bootsLevel: 1,
  bootsStarLevel: 1,
};
