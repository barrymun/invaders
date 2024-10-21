import { ICountry } from "countries-list";

import { ZeroToNumberRange, OneToTen, OneToOneHundred } from "utils";

import { maxCities, maxCountyBuildings, maxTownBuildings } from "./consts";
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

export interface City extends DatabaseRequiredFields {
  playerId: number;
  index: ZeroToNumberRange<typeof maxCities>;
  name: string;
  townHall: Pick<Building, "level">;
  walls: Pick<Building, "level">;
  resources: Resources;
  troops: Troops;
}

export interface Player extends DatabaseRequiredFields {
  name: string;
  country: ICountry;
  gold: number;
}
