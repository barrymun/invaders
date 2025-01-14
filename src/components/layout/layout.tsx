import { Box } from "@mantine/core";
import { FC } from "react";
import { Outlet } from "react-router-dom";

import { Navbar } from "@components/navbar";
import { Sidebar } from "@components/sidebar";

import classes from "./layout.module.scss";

interface LayoutProps {}

export const Layout: FC<LayoutProps> = () => {
  return (
    <>
      <Navbar />
      <Box className={classes.layout}>
        <Sidebar />
        <main className={classes.outletContainer}>
          <Outlet />
        </main>
      </Box>
    </>
  );
};
