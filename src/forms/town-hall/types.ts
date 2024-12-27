import { Hero } from "db";

export interface TownHallForm {
  mayorId: Hero["id"] | null;
}
