import "i18n/config";
import "./_reset.scss";
import "@mantine/core/styles.css";
import "./_variables.scss";
import "./_main.scss";

import { createTheme, MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { GlobalStateProvider, LocalStorageProvider, SelectedCityProvider } from "hooks";
import { router } from "router";

const mantineTheme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={mantineTheme}>
      <LocalStorageProvider>
        <GlobalStateProvider>
          <SelectedCityProvider>
            <RouterProvider router={router} />
          </SelectedCityProvider>
        </GlobalStateProvider>
      </LocalStorageProvider>
    </MantineProvider>
  </StrictMode>
);
