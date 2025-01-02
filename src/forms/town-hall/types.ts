import { Hero } from "@db/models";

export interface TownHallForm {
  mayorId: Hero["id"] | null;
}
