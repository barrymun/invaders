// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { createTheme, MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, it, vitest } from "vitest";

import { HeroGear } from "./hero-gear";

const mantineTheme = createTheme({});

describe("HeroGear", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vitest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vitest.fn(),
        removeListener: vitest.fn(),
        addEventListener: vitest.fn(),
        removeEventListener: vitest.fn(),
        dispatchEvent: vitest.fn(),
      })),
    });
  });

  it("renders the page", async () => {
    render(
      <MantineProvider theme={mantineTheme}>
        <HeroGear />
      </MantineProvider>
    );
    await screen.findByText("Weaponry");
  });
});
