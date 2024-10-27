import Dexie, { type EntityTable } from "dexie";

import { getAllKeys, hasAllKeys } from "utils";

import { defaultCity, defaultHeroGear, defaultPlayer } from "./consts";
import { City, CountyBuilding, Hero, HeroGear, HirableHero, Player, TownBuilding } from "./models";

let isInitializingDatabaseLock = false;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class GameDatabase extends Dexie {
  players: EntityTable<Player, "id">;
  cities: EntityTable<City, "id">;
  townBuildings: EntityTable<TownBuilding, "id">;
  countyBuildings: EntityTable<CountyBuilding, "id">;
  heroes: EntityTable<Hero, "id">;
  hireableHeroes: EntityTable<HirableHero, "id">;
  heroGear: EntityTable<HeroGear, "id">;

  constructor() {
    super("GameDatabase");

    // Schema declaration: (any updates to the schema should increment the schema version)
    this.version(1).stores({
      players: "++id",
      cities: "++id, playerId",
      townBuildings: "++id, playerId, cityId, [playerId+cityId]",
      countyBuildings: "++id, playerId, cityId, [playerId+cityId]",
      heroes: "++id, playerId, cityId, [playerId+cityId]",
      hireableHeroes: "++id, playerId, cityId, [playerId+cityId]",
      heroGear: "++id, playerId",
    });

    this.players = this.table("players");
    this.cities = this.table("cities");
    this.townBuildings = this.table("townBuildings");
    this.countyBuildings = this.table("countyBuildings");
    this.heroes = this.table("heroes");
    this.hireableHeroes = this.table("hireableHeroes");
    this.heroGear = this.table("heroGear");
  }
}

export const db = new GameDatabase();

export async function isDatabaseInitialized(): Promise<boolean> {
  const playerCount = await db.table("players").count();
  return playerCount > 0;
}

export async function initDatabase() {
  if (isInitializingDatabaseLock) {
    return;
  }
  isInitializingDatabaseLock = true;

  const dbInitializedSuccessfully = await isDatabaseInitialized();
  if (dbInitializedSuccessfully) {
    return;
  }

  const allPlayerKeys = getAllKeys<Omit<Player, "id">>(defaultPlayer);
  if (!hasAllKeys<Omit<Player, "id">>(defaultPlayer, allPlayerKeys)) {
    throw new Error("Default player object is missing keys");
  }
  const playerId = (await db.table("players").add(defaultPlayer)) as number;

  const cityObject = { ...defaultCity, playerId } satisfies Omit<City, "id">;
  const allCityKeys = getAllKeys<Omit<City, "id">>(cityObject);
  if (!hasAllKeys<Omit<City, "id">>(cityObject, allCityKeys)) {
    throw new Error("Default city object is missing keys");
  }
  await db.table("cities").add(cityObject);

  const heroGearObject = { ...defaultHeroGear, playerId } satisfies Omit<HeroGear, "id">;
  const allHeroGearKeys = getAllKeys<Omit<HeroGear, "id">>(heroGearObject);
  if (!hasAllKeys<Omit<HeroGear, "id">>(heroGearObject, allHeroGearKeys)) {
    throw new Error("Default hero gear object is missing keys");
  }
  await db.table("heroGear").add(heroGearObject);

  isInitializingDatabaseLock = false;
}
