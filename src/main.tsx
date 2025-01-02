import "@i18n/config";
import "@_reset.scss";
import "@mantine/core/styles.css";
import "@_variables.scss";
import "@_main.scss";

import { createTheme, MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { CitiesProvider } from "@hooks/use-cities";
import { HeroGearProvider } from "@hooks/use-hero-gear";
import { LocalStorageProvider } from "@hooks/use-local-storage";
import { PlayerProvider } from "@hooks/use-player";
import { SelectedCityProvider } from "@hooks/use-selected-city";
import { router } from "@router";

const mantineTheme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={mantineTheme}>
      <LocalStorageProvider>
        <PlayerProvider>
          <HeroGearProvider>
            <CitiesProvider>
              <SelectedCityProvider>
                <RouterProvider router={router} />
              </SelectedCityProvider>
            </CitiesProvider>
          </HeroGearProvider>
        </PlayerProvider>
      </LocalStorageProvider>
    </MantineProvider>
  </StrictMode>
);
