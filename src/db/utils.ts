import { getAllKeys, hasAllKeys } from "utils";

import { defaultCity, defaultHeroGear, defaultPlayer } from "./consts";
import { getDb } from "./db";
import { City, HeroGear, Player } from "./models";

const db = getDb();

let isInitializingDatabaseLock = false;

export async function isDatabaseConfigured(): Promise<boolean> {
  const playerCount = await db.table("players").count();
  return playerCount > 0;
}

export async function setupDatabase() {
  if (isInitializingDatabaseLock) {
    return;
  }
  isInitializingDatabaseLock = true;

  const dbInitializedSuccessfully = await isDatabaseConfigured();
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
