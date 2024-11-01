import Dexie, { type EntityTable } from "dexie";

import {
  City,
  CountyBuilding,
  Desert,
  Flat,
  Forest,
  Hero,
  HeroGear,
  HirableHero,
  Lake,
  Mountain,
  NPC,
  Player,
  TownBuilding,
  WorldMap,
} from "./models";

let db: GameDatabase | undefined;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class GameDatabase extends Dexie {
  worldMap: EntityTable<WorldMap, "id">;
  flats: EntityTable<Flat, "id">;
  lakes: EntityTable<Lake, "id">;
  forests: EntityTable<Forest, "id">;
  deserts: EntityTable<Desert, "id">;
  mountains: EntityTable<Mountain, "id">;
  npcs: EntityTable<NPC, "id">;
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
      worldMap: "++id",
      flats: "++id",
      lakes: "++id",
      forests: "++id",
      deserts: "++id",
      mountains: "++id",
      npcs: "++id",
      players: "++id",
      cities: "++id, playerId",
      townBuildings: "++id, playerId, cityId, [playerId+cityId]",
      countyBuildings: "++id, playerId, cityId, [playerId+cityId]",
      heroes: "++id, playerId, cityId, [playerId+cityId]",
      hireableHeroes: "++id, playerId, cityId, [playerId+cityId]",
      heroGear: "++id, playerId",
    });

    this.worldMap = this.table("worldMap");
    this.flats = this.table("flats");
    this.lakes = this.table("lakes");
    this.forests = this.table("forests");
    this.deserts = this.table("deserts");
    this.mountains = this.table("mountains");
    this.npcs = this.table("npcs");
    this.players = this.table("players");
    this.cities = this.table("cities");
    this.townBuildings = this.table("townBuildings");
    this.countyBuildings = this.table("countyBuildings");
    this.heroes = this.table("heroes");
    this.hireableHeroes = this.table("hireableHeroes");
    this.heroGear = this.table("heroGear");
  }
}

// TODO: revisit this logic as it is a little hacky, but it works for now
export function setDb(): GameDatabase {
  db = new GameDatabase();
  return db;
}

export function getDb(): GameDatabase {
  if (!db) {
    return setDb();
  }
  return db;
}

setDb();
