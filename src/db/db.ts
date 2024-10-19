import Dexie, { type EntityTable } from "dexie";

import { defaultCity, defaultPlayer } from "./consts";
import { City, CountyBuilding, Player, TownBuilding } from "./models";

const schemaVersion = 1;

class GameDatabase extends Dexie {
  players: EntityTable<Player, "id">;
  cities: EntityTable<City, "id">;
  townBuildings: EntityTable<TownBuilding, "id">;
  countyBuildings: EntityTable<CountyBuilding, "id">;

  constructor() {
    super("GameDatabase");
    // Schema declaration: (any updates to the schema should increment the schema version)
    this.version(schemaVersion).stores({
      players: "++id",
      cities: "++id, playerId",
      townBuildings: "++id, playerId, cityId, [playerId+cityId]",
      countyBuildings: "++id, playerId, cityId, [playerId+cityId]",
    });
    this.players = this.table("players");
    this.cities = this.table("cities");
    this.townBuildings = this.table("townBuildings");
    this.countyBuildings = this.table("countyBuildings");
  }
}

export const db = new GameDatabase();

export async function isDatabaseInitialized(): Promise<boolean> {
  const playerCount = await db.table("players").count();
  return playerCount > 0;
}

export async function initDatabase() {
  if (!(await isDatabaseInitialized())) {
    const playerId = await db.table("players").add(defaultPlayer);
    await db.table("cities").add({ ...defaultCity, playerId });
  }
}
