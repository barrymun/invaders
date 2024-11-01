import { ICountry } from "countries-list";

import { ZeroToNumberRange, OneToTen, OneToOneHundred, OneToFifteen } from "utils";

import { maxCities, maxCountyBuildings, maxTownBuildings } from "./consts";
import { TileType } from "./enums";
import { Resources, Troops } from "./types";

interface DatabaseRequiredFields {
  id: number;
}

export interface Hero extends DatabaseRequiredFields {
  playerId: number;
  cityId: number;
  name: string;
  level: OneToOneHundred;
  experience: number;
  politics: number;
  intelligence: number;
  attack: number;
}

export interface HirableHero extends Hero {}

export interface HeroGear extends DatabaseRequiredFields {
  playerId: number;
  weaponryLevel: OneToTen;
  weaponryStarLevel: OneToFifteen;
  mountTrainingLevel: OneToTen;
  mountTrainingStarLevel: OneToFifteen;
  charmLevel: OneToTen;
  charmStarLevel: OneToFifteen;
  helmetLevel: OneToTen;
  helmetStarLevel: OneToFifteen;
  chestArmorLevel: OneToTen;
  chestArmorStarLevel: OneToFifteen;
  gauntletsLevel: OneToTen;
  gauntletsStarLevel: OneToFifteen;
  legsArmorLevel: OneToTen;
  legsArmorStarLevel: OneToFifteen;
  shieldLevel: OneToTen;
  shieldStarLevel: OneToFifteen;
  necklaceLevel: OneToTen;
  necklaceStarLevel: OneToFifteen;
  ringLevel: OneToTen;
  ringStarLevel: OneToFifteen;
  spauldersLevel: OneToTen;
  spauldersStarLevel: OneToFifteen;
  backArmorLevel: OneToTen;
  backArmorStarLevel: OneToFifteen;
  beltLevel: OneToTen;
  beltStarLevel: OneToFifteen;
  bootsLevel: OneToTen;
  bootsStarLevel: OneToFifteen;
}

export interface Building extends DatabaseRequiredFields {
  playerId: number;
  cityId: number;
  level: OneToTen;
}

/**
 * all building can be built only once except for barracks
 * and cottages which can be built multiple times
 */
export interface TownBuilding extends Building {
  type:
    | "inn" // recruit heroes
    | "diningHall" // store heroes
    | "market" // trade resources
    | "academy" // research
    | "rallySpot" // how many troops & waves can be sent
    | "forge" // improves speed at which troops are trained
    | "workshop" // improve hero gear
    | "reliefStation" // how fast resources are moved between cities
    | "beaconTower" // improved scouting information
    // v2
    // | "embassy"
    // | "warehouse"
    // | "stable"
    | "barracks" // train troops
    | "cottage"; // store workers which are used for resource production
  index: ZeroToNumberRange<typeof maxTownBuildings>;
}

export interface CountyBuilding extends Building {
  type: "farm" | "sawmill" | "quarry" | "mine";
  index: ZeroToNumberRange<typeof maxCountyBuildings>;
}

export interface Flat extends DatabaseRequiredFields {
  resources: Resources;
  troops: Troops;
}

export interface Lake extends Flat {
  level: OneToTen;
} // extra food

export interface Forest extends Flat {
  level: OneToTen;
} // extra lumber

export interface Desert extends Flat {
  level: OneToTen;
} // extra stone

export interface Mountain extends Flat {
  level: OneToTen;
} // extra iron

export interface NPC extends Flat {
  name: string;
  townHall: Pick<Building, "level">;
  walls: Pick<Building, "level">;
}

export interface City extends NPC {
  playerId: number;
  index: ZeroToNumberRange<typeof maxCities>;
}

export interface Player extends DatabaseRequiredFields {
  name: string;
  country: ICountry;
  gold: number;
}

export interface WorldMap extends DatabaseRequiredFields {
  x: OneToFifteen;
  y: OneToFifteen;
  tileType: TileType;
  tileId: number; // points to the id of the tile type
}
