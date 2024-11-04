import { getAllKeys, hasAllKeys } from "utils";

import { defaultCity, defaultHeroGear, defaultPlayer } from "./consts";
import { getDb } from "./db";
import { generateWorldMap } from "./helpers";
import { City, HeroGear, Player } from "./models";

const db = getDb();

let isInitializingDatabaseLock = false;

export async function createPlayer() {
  const allPlayerKeys = getAllKeys<Omit<Player, "id">>(defaultPlayer);
  if (!hasAllKeys<Omit<Player, "id">>(defaultPlayer, allPlayerKeys)) {
    throw new Error("Default player object is missing keys");
  }
  const playerId = (await db.table("players").add(defaultPlayer)) as number;
  return playerId;
}

export async function createPlayerFirstCity(playerId: number) {
  const cityObject = { ...defaultCity, playerId } satisfies Omit<City, "id">;
  const allCityKeys = getAllKeys<Omit<City, "id">>(cityObject);
  if (!hasAllKeys<Omit<City, "id">>(cityObject, allCityKeys)) {
    throw new Error("Default city object is missing keys");
  }
  const cityId = (await db.table("cities").add(cityObject)) as number;
  return cityId;
}

export async function createPlayerHeroGear(playerId: number) {
  const heroGearObject = { ...defaultHeroGear, playerId } satisfies Omit<HeroGear, "id">;
  const allHeroGearKeys = getAllKeys<Omit<HeroGear, "id">>(heroGearObject);
  if (!hasAllKeys<Omit<HeroGear, "id">>(heroGearObject, allHeroGearKeys)) {
    throw new Error("Default hero gear object is missing keys");
  }
  const heroGearId = (await db.table("heroGear").add(heroGearObject)) as number;
  return heroGearId;
}

export async function initializeDatabase() {
  if (isInitializingDatabaseLock) {
    return;
  }
  isInitializingDatabaseLock = true;

  const dbInitializedSuccessfully = await isGameReady();
  if (dbInitializedSuccessfully) {
    return;
  }

  const playerId = await createPlayer();
  await createPlayerFirstCity(playerId);
  await createPlayerHeroGear(playerId);
  await generateWorldMap();

  isInitializingDatabaseLock = false;
}

export async function isGameReady(): Promise<boolean> {
  const playerCount = await db.table("players").count();
  return playerCount > 0;
}
