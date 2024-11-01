import "fake-indexeddb/auto";

import { beforeAll } from "vitest";

import { setDb } from "../src/db/db";
import { setupDatabase } from "../src/db/utils";

beforeAll(async () => {
  setDb();
  await setupDatabase();
});
