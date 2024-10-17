import { FixedLengthArray, OneToTen } from "utils/types";

export interface Building {
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
}

export interface CountryBuilding extends Building {
  type: "farm" | "sawmill" | "quarry" | "mine";
}

export type ResourceType = "food" | "lumber" | "stone" | "iron";

export type Resources = {
  [key in ResourceType]: number;
};

export type TroopType =
  | "worker"
  | "warrior"
  | "scout"
  | "swordsman"
  | "pikeman"
  | "archer"
  | "cavalry"
  | "cataphract"
  | "transporter"
  | "batteringRam"
  | "ballista"
  | "catapult";

export type Troops = {
  [key in TroopType]: number;
};

export interface City {
  name: string;
  townHall: Building;
  walls: Building;
  town: {
    buildings: FixedLengthArray<TownBuilding | null, 32>;
  };
  country: {
    buildings: (CountryBuilding | null)[];
  };
  resources: Resources;
  troops: Troops;
}

export interface GlobalState {
  player: {
    name: string;
    flag: string;
    gold: number;
  };
  cities: City[];
}
