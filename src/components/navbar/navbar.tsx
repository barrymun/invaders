import { Group, Code } from "@mantine/core";
import { IconBuildingFactory, IconBuildingCastle, IconSwitchHorizontal, IconLogout } from "@tabler/icons-react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import classes from "./navbar.module.scss";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const data = [
    { link: "/town", label: t("navbar.links.town"), icon: IconBuildingCastle },
    { link: "/resources", label: t("navbar.links.resources"), icon: IconBuildingFactory },
  ];

  const [active, setActive] = useState<string>(
    data.find((item) => item.link === location.pathname)?.label ?? t("navbar.links.town")
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
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Code fw={700}>v3.1.2</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export { Navbar };