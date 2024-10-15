import { Box } from "@mantine/core";
import { FC } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "components";

import classes from "./layout.module.scss";

interface LayoutProps {}

export const Layout: FC<LayoutProps> = () => {
  return (
    <Box className={classes.layout}>
      <Sidebar />
      <Box className={classes.outletContainer}>
        <Outlet />
      </Box>
    </Box>
  );
};
