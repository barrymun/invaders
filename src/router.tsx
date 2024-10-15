import { createBrowserRouter } from "react-router-dom";

import { Layout } from "components";
import { Home } from "pages/home";
import { Town } from "pages/town";

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
    ],
  },
]);
