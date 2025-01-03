import { createBrowserRouter } from "react-router-dom";

// TODO: lazy load pages
import { Layout } from "@components/layout";
import { County } from "@pages/county";
import { HeroGear } from "@pages/hero-gear";
import { Home } from "@pages/home";
import { Resources } from "@pages/resources";
import { Settings } from "@pages/settings";
import { Town } from "@pages/town";
import { Troops } from "@pages/troops";
import { WorldMap } from "@pages/world-map";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/town",
        element: <Town />,
      },
      {
        path: "/county",
        element: <County />,
      },
      {
        path: "/resources",
        element: <Resources />,
      },
      {
        path: "/troops",
        element: <Troops />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/hero-gear",
        element: <HeroGear />,
      },
      {
        path: "/world-map",
        element: <WorldMap />,
      },
    ],
  },
]);
