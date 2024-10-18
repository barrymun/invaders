import { Group, Code, Box } from "@mantine/core";
import { IconBuildingFactory, IconBuildingCastle, IconSwords, IconShovelPitchforks } from "@tabler/icons-react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import classes from "./sidebar.module.scss";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const data = [
    { link: "/town", label: t("sidebar.links.town"), icon: IconBuildingCastle },
    { link: "/county", label: t("sidebar.links.county"), icon: IconShovelPitchforks },
    { link: "/resources", label: t("sidebar.links.resources"), icon: IconBuildingFactory },
    { link: "/troops", label: t("sidebar.links.troops"), icon: IconSwords },
  ];

  const [active, setActive] = useState<string>(
    data.find((item) => item.link === location.pathname)?.label ?? t("sidebar.links.town")
  );

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.sidebar}>
      <Box className={classes.sidebarMain}>
        <Group className={classes.header} justify="space-between">
          <Code fw={700}>{t("sidebar.version", { version: import.meta.env.APP_VERSION })}</Code>
        </Group>
        {links}
      </Box>
    </nav>
  );
};

export { Sidebar };
