import "i18n/config";
import "./_reset.scss";
import "./_main.scss";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { GlobalStateProvider, LocalStorageProvider } from "hooks";
import { router } from "router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <LocalStorageProvider>
        <GlobalStateProvider>
          <RouterProvider router={router} />
        </GlobalStateProvider>
      </LocalStorageProvider>
    </MantineProvider>
  </StrictMode>
);
