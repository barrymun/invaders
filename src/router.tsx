import { createBrowserRouter } from "react-router-dom";

// TODO: lazy load pages
import { Layout } from "components";
import { County } from "pages/county";
import { Home } from "pages/home";
import { Resources } from "pages/resources";
import { Settings } from "pages/settings";
import { Town } from "pages/town";
import { Troops } from "pages/troops";

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
    ],
  },
]);
