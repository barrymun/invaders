import "i18n/config";
import "./reset.scss";
import "./main.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { GlobalStateProvider, LocalStorageProvider } from "hooks";
import { router } from "router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocalStorageProvider>
      <GlobalStateProvider>
        <RouterProvider router={router} />
      </GlobalStateProvider>
    </LocalStorageProvider>
  </StrictMode>
);
