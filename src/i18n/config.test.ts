import { describe, it, expect, beforeAll } from "vitest";

import enTranslation from "assets/_locales/en/messages.json";

import i18n from "./config";

describe("i18n configuration", () => {
  beforeAll(async () => {
    if (!i18n.isInitialized) {
      await i18n.init();
    }
  });

  it("should use English as the default fallback language", () => {
    expect(i18n.options.fallbackLng).toEqual(["en"]);
  });

  it("should load English translations correctly", () => {
    const key = Object.keys(enTranslation)[0] as keyof typeof enTranslation;
    const translation = enTranslation[key];

    expect(i18n.t(key, { returnObjects: true })).toStrictEqual(translation);
  });

  it("should not escape interpolation values", () => {
    expect(i18n.options.interpolation?.escapeValue).toBe(false);
  });

  it("should detect and use the correct language", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");
  });

  it("should return the key if translation is missing", () => {
    const missingKey = "missing.key";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(i18n.t(missingKey as any)).toBe(missingKey);
  });
});
