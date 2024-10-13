import translation from "assets/_locales/en/messages.json";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resources = {
  translation,
} as const;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
