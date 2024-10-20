import Dexie, { type EntityTable } from "dexie";

import { getAllKeys, hasAllKeys } from "utils";

import { defaultCity, defaultPlayer } from "./consts";
import { City, CountyBuilding, Player, TownBuilding } from "./models";

class GameDatabase extends Dexie {
  players: EntityTable<Player, "id">;
  cities: EntityTable<City, "id">;
  townBuildings: EntityTable<TownBuilding, "id">;
  countyBuildings: EntityTable<CountyBuilding, "id">;

  constructor() {
    super("GameDatabase");
    // Schema declaration: (any updates to the schema should increment the schema version)
    this.version(1).stores({
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
  const dbInitializedSuccessfully = await isDatabaseInitialized();
  if (dbInitializedSuccessfully) {
    return;
  }

  const allPlayerKeys = getAllKeys<Omit<Player, "id">>(defaultPlayer);
  if (!hasAllKeys<Omit<Player, "id">>(defaultPlayer, allPlayerKeys)) {
    throw new Error("Default player object is missing keys");
  }
  const playerId = await db.table("players").add(defaultPlayer);

  const cityObject = { ...defaultCity, playerId: playerId as number } satisfies Omit<City, "id">;
  const allCityKeys = getAllKeys<Omit<City, "id">>(cityObject);
  if (!hasAllKeys<Omit<City, "id">>(cityObject, allCityKeys)) {
    throw new Error("Default city object is missing keys");
  }
  await db.table("cities").add(cityObject);
}
