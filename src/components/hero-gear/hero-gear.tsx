import { Box, Card, Divider } from "@mantine/core";
// import {
//   IconBrandBootstrap,
//   IconDeviceWatch,
//   IconDiamond,
//   IconHandStop,
//   IconHelmet,
//   IconHorse,
//   IconRings,
//   IconShield,
//   IconShieldChevron,
//   IconShieldDown,
//   IconShieldUp,
//   IconShoe,
//   IconSock,
//   IconSword,
// } from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useHeroGear } from "hooks";
import { heroGearLevelColourMap } from "utils";

import classes from "./hero-gear.module.scss";

interface GearDetails {
  name: string;
  level: keyof typeof heroGearLevelColourMap;
  // icon: React.ReactNode;
}

interface GearItemProps {
  details: GearDetails;
}

const GearItem: FC<GearItemProps> = (props) => {
  const { details } = props;

  return (
    <Card className={classes.gearItem}>
      <Card.Section className={classes.gearItemIcon} style={{ backgroundColor: heroGearLevelColourMap[details.level] }}>
        {/* {details.icon} */}
      </Card.Section>
      <Divider />
      <Card.Section className={classes.gearItemName}>{details.name}</Card.Section>
      <Card.Section className={classes.gearItemName}>{details.level}</Card.Section>
    </Card>
  );
};

interface HeroGearProps {}

const HeroGear: FC<HeroGearProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "hero-gear" });

  const heroGear = useHeroGear();

  const gearDetails: GearDetails[] = [
    {
      name: t("gear-items.weaponry"),
      level: heroGear.weaponryLevel,
      // icon: <IconSword color="white" />,
    },
    {
      name: t("gear-items.mountTraining"),
      level: heroGear.mountTrainingLevel,
      // icon: <IconHorse color="white" />,
    },
    {
      name: t("gear-items.charm"),
      level: heroGear.charmLevel,
      // icon: <IconDeviceWatch color="white" />,
    },
    {
      name: t("gear-items.helmet"),
      level: heroGear.helmetLevel,
      // icon: <IconHelmet color="white" />,
    },
    {
      name: t("gear-items.chestArmor"),
      level: heroGear.chestArmorLevel,
      // icon: <IconShieldUp color="white" />,
    },
    {
      name: t("gear-items.gauntlets"),
      level: heroGear.gauntletsLevel,
      // icon: <IconHandStop color="white" />,
    },
    {
      name: t("gear-items.legsArmor"),
      level: heroGear.legsArmorLevel,
      // icon: <IconSock color="white" />,
    },
    {
      name: t("gear-items.shield"),
      level: heroGear.shieldLevel,
      // icon: <IconShield color="white" />,
    },
    {
      name: t("gear-items.necklace"),
      level: heroGear.necklaceLevel,
      // icon: <IconDiamond color="white" />,
    },
    {
      name: t("gear-items.ring"),
      level: heroGear.ringLevel,
      // icon: <IconRings color="white" />,
    },
    {
      name: t("gear-items.spaulders"),
      level: heroGear.spauldersLevel,
      // icon: <IconShieldChevron color="white" />,
    },
    {
      name: t("gear-items.backArmor"),
      level: heroGear.backArmorLevel,
      // icon: <IconShieldDown color="white" />,
    },
    {
      name: t("gear-items.belt"),
      level: heroGear.beltLevel,
      // icon: <IconBrandBootstrap color="white" />,
    },
    {
      name: t("gear-items.boots"),
      level: heroGear.bootsLevel,
      // icon: <IconShoe color="white" />,
    },
  ];

  return (
    <Box className={classes.gearItems}>
      {gearDetails.map((gearDetail, index) => (
        <GearItem key={index} details={gearDetail} />
      ))}
    </Box>
  );
};

export { HeroGear };
