import { Box } from "@mantine/core";
import { FC } from "react";

import { NavbarSelect } from "components";

import classes from "./navbar.module.scss";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  return (
    <Box className={classes.navbar}>
      <NavbarSelect />
    </Box>
  );
};

export { Navbar };
