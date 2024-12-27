import { ActionIcon, Box, Group, Modal, Stack } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { NavbarGold, NavbarResources, NavbarSelect } from "components";

import classes from "./navbar.module.scss";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "navbar" });

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <Box className={classes.navbar}>
      <Box className={classes.navbarEnd}>
        <Box className={classes.largeMenu}>
          <Group>
            <NavbarGold />
            <NavbarResources />
            <NavbarSelect />
          </Group>
        </Box>

        <Box className={classes.smallMenu}>
          <ActionIcon onClick={() => setMobileMenuOpen(true)}>
            <IconMenu2 />
          </ActionIcon>
        </Box>
      </Box>

      <Modal
        opened={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={t("small-menu.title")}
        fullScreen
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Modal.Body>
          <Stack>
            <NavbarSelect />
            <NavbarGold />
            <NavbarResources />
          </Stack>
        </Modal.Body>
      </Modal>
    </Box>
  );
};

export { Navbar };
