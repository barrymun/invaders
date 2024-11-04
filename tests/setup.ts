import "fake-indexeddb/auto";

import { beforeAll } from "vitest";

import { initializeDatabase } from "../src/db/utils";

beforeAll(async () => {
  await initializeDatabase();
});
