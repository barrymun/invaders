import "fake-indexeddb/auto";

import "../src/i18n/config"; // for jsdom tests

import { beforeAll } from "vitest";

import { initializeDatabase } from "../src/db/utils";

beforeAll(async () => {
  await initializeDatabase();
});
