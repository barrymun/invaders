import { OneToTen } from "utils/types";

export interface Building {
  level: OneToTen;
}

export interface CityBuilding extends Building {}

export interface CountryBuilding extends Building {
  type: "farm" | "sawmill" | "quarry" | "mine" | null;
}

export interface GlobalState {
  player: {
    name: string;
    flag: string;
    gold: number;
  };
  city: {
    name: string;
    townHall: Building;
    walls: Building;
    town: {
      buildings: CityBuilding[];
    };
    country: {
      buildings: CountryBuilding[];
    };
    resources: {
      food: number;
      wood: number;
      stone: number;
      iron: number;
    };
  };
}
