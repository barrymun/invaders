import { Group, Code, Box } from "@mantine/core";
import {
  IconBuildingFactory,
  IconBuildingCastle,
  IconSwords,
  IconShovelPitchforks,
  IconSettings,
  IconProps,
  Icon,
  IconUserShield,
  IconWorld,
} from "@tabler/icons-react";
import { FC, ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import classes from "./sidebar.module.scss";

interface SidebarLinkDataProps {
  link: string;
  label: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

interface SidebarLinkProps {
  item: SidebarLinkDataProps;
  active: string;
  setActive: (label: string) => void;
}

const SidebarLink: FC<SidebarLinkProps> = ({ item, active, setActive }) => (
  <Link
    className={classes.link}
    data-active={item.label === active || undefined}
    to={item.link}
    onClick={() => {
      setActive(item.label);
    }}
  >
    <item.icon className={classes.linkIcon} />
    <span className={classes.linkLabel}>{item.label}</span>
  </Link>
);

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const linksData: SidebarLinkDataProps[] = [
    { link: "/town", label: t("sidebar.links.town"), icon: IconBuildingCastle },
    { link: "/county", label: t("sidebar.links.county"), icon: IconShovelPitchforks },
    { link: "/resources", label: t("sidebar.links.resources"), icon: IconBuildingFactory },
    { link: "/troops", label: t("sidebar.links.troops"), icon: IconSwords },
    { link: "/hero-gear", label: t("sidebar.links.hero-gear"), icon: IconUserShield },
    { link: "/world-map", label: t("sidebar.links.world-map"), icon: IconWorld },
  ];

  const footerLinksData: SidebarLinkDataProps[] = [
    { link: "/settings", label: t("sidebar.links.settings"), icon: IconSettings },
  ];

  const [active, setActive] = useState<string>(
    [...linksData, ...footerLinksData].find((item) => item.link === location.pathname)?.label ?? t("sidebar.links.town")
  );

  const links = linksData.map((item, index) => (
    <SidebarLink key={index} item={item} active={active} setActive={setActive} />
  ));

  const footerLinks = footerLinksData.map((item, index) => (
    <SidebarLink key={index} item={item} active={active} setActive={setActive} />
  ));

  return (
    <aside className={classes.sidebar}>
      <Box className={classes.sidebarMain}>
        <Box>
          <Group className={classes.header} justify="space-between">
            <Code fw={700}>{t("sidebar.version", { version: import.meta.env.APP_VERSION })}</Code>
          </Group>
          {links}
        </Box>
        {/* <Group className={classes.footer}>{footerLinks}</Group> */}
        <Box className={classes.footer}>{footerLinks}</Box>
      </Box>
    </aside>
  );
};

export { Sidebar };
