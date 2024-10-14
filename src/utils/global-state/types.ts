import { OneToTen } from "utils/types";

export interface Building {
  level: OneToTen;
}

export interface InnerCityBuilding extends Building {}

export interface OuterCityBuilding extends Building {
  type: "farm" | "sawmill" | "quarry" | "mine";
}

export interface GlobalState {
  player: {
    name: string;
    flag: string;
  };
  city: {
    name: string;
    townHall: Building;
    walls: Building;
    innerCity: {
      buildings: InnerCityBuilding[];
    };
    outerCity: {
      buildings: OuterCityBuilding[];
    };
  };
}
