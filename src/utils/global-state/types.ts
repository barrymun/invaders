import { OneToTen } from "utils/types";

export interface Building {
  level: OneToTen;
}

export interface CityBuilding extends Building {}

export interface CountryBuilding extends Building {
  type: "farm" | "sawmill" | "quarry" | "mine" | null;
}

export type ResourceType = "food" | "wood" | "stone" | "iron";

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
  | "ram"
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
    buildings: CityBuilding[];
  };
  country: {
    buildings: CountryBuilding[];
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
