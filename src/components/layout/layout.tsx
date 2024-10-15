import { Box } from "@mantine/core";
import { FC } from "react";
import { Outlet } from "react-router-dom";

import { Navbar } from "components";

import classes from "./layout.module.scss";

interface LayoutProps {}

export const Layout: FC<LayoutProps> = () => {
  return (
    <Box className={classes.layout}>
      <Navbar />
      <Box className={classes.outletContainer}>
        <Outlet />
      </Box>
    </Box>
  );
};
