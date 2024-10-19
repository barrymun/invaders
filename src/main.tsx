import "i18n/config";
import "./_reset.scss";
import "@mantine/core/styles.css";
import "./_variables.scss";
import "./_main.scss";

import { createTheme, MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { PlayerProvider, LocalStorageProvider, SelectedCityProvider, CitiesProvider } from "hooks";
import { router } from "router";

const mantineTheme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={mantineTheme}>
      <LocalStorageProvider>
        <PlayerProvider>
          <CitiesProvider>
            <SelectedCityProvider>
              <RouterProvider router={router} />
            </SelectedCityProvider>
          </CitiesProvider>
        </PlayerProvider>
      </LocalStorageProvider>
    </MantineProvider>
  </StrictMode>
);
