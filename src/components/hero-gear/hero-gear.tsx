import { Box, Button, Card, Divider } from "@mantine/core";
import {
  IconBrandBootstrap,
  IconDeviceWatch,
  IconDiamond,
  IconHandStop,
  IconHelmet,
  IconHorse,
  IconRings,
  IconShield,
  IconShieldChevron,
  IconShieldDown,
  IconShieldUp,
  IconShoe,
  IconSock,
  IconStarFilled,
  IconSword,
} from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { upgradeHeroGearLevel, upgradeHeroGearStarLevel } from "@db/helpers";
import { HeroGear as HeroGearType } from "@db/models";
import { useHeroGear } from "@hooks/use-hero-gear";
import { heroGearLevelColourMap } from "@utils/consts";

import classes from "./hero-gear.module.scss";

interface GearDetails {
  title: string;
  name:
    | "weaponry"
    | "mountTraining"
    | "charm"
    | "helmet"
    | "chestArmor"
    | "gauntlets"
    | "legsArmor"
    | "shield"
    | "necklace"
    | "ring"
    | "spaulders"
    | "backArmor"
    | "belt"
    | "boots";
  level: keyof typeof heroGearLevelColourMap;
  starLevel: number;
  icon: React.ReactNode;
}

interface GearItemProps {
  details: GearDetails;
}

const GearItem: FC<GearItemProps> = (props) => {
  const { details } = props;

  const { t } = useTranslation("translation");

  const heroGear = useHeroGear();

  const handleUpgradeLevel = async () => {
    const heroGearLevelKey = (details.name + "Level") as keyof Omit<HeroGearType, "id" | "playerId">;
    await upgradeHeroGearLevel({ heroGear, name: heroGearLevelKey });
  };

  const handleUpgradeStarLevel = async () => {
    const heroGearStarLevelKey = (details.name + "StarLevel") as keyof Omit<HeroGearType, "id" | "playerId">;
    await upgradeHeroGearStarLevel({ heroGear, name: heroGearStarLevelKey });
  };

  return (
    <Card className={classes.gearItem}>
      <Card.Section className={classes.gearItemIcon} style={{ backgroundColor: heroGearLevelColourMap[details.level] }}>
        {details.icon}
      </Card.Section>
      <Divider />
      <Card.Section className={classes.gearItemName}>{details.title}</Card.Section>
      <Card.Section className={classes.gearItemName}>
        {t("general.lvl")} {details.level}
      </Card.Section>
      <Card.Section className={classes.gearItemStars}>
        {Array.from({ length: details.starLevel }, (_, index) => (
          <IconStarFilled key={index} />
        ))}
      </Card.Section>
      <Card.Section className={classes.gearItemActions}>
        <Button size="compact-sm" color="blue" onClick={handleUpgradeLevel}>
          {t("hero-gear.gear-items.modal.upgrade-level")}
        </Button>
        <Button size="compact-sm" color="blue" onClick={handleUpgradeStarLevel}>
          {t("hero-gear.gear-items.modal.upgrade-stars")}
        </Button>
      </Card.Section>
    </Card>
  );
};

interface HeroGearProps {}

const HeroGear: FC<HeroGearProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "hero-gear" });

  const heroGear = useHeroGear();

  const gearDetails: GearDetails[] = [
    {
      title: t("gear-items.weaponry"),
      name: "weaponry",
      level: heroGear.weaponryLevel,
      starLevel: heroGear.weaponryStarLevel,
      icon: <IconSword color="white" />,
    },
    {
      title: t("gear-items.mountTraining"),
      name: "mountTraining",
      level: heroGear.mountTrainingLevel,
      starLevel: heroGear.mountTrainingStarLevel,
      icon: <IconHorse color="white" />,
    },
    {
      title: t("gear-items.charm"),
      name: "charm",
      level: heroGear.charmLevel,
      starLevel: heroGear.charmStarLevel,
      icon: <IconDeviceWatch color="white" />,
    },
    {
      title: t("gear-items.helmet"),
      name: "helmet",
      level: heroGear.helmetLevel,
      starLevel: heroGear.helmetStarLevel,
      icon: <IconHelmet color="white" />,
    },
    {
      title: t("gear-items.chestArmor"),
      name: "chestArmor",
      level: heroGear.chestArmorLevel,
      starLevel: heroGear.chestArmorStarLevel,
      icon: <IconShieldUp color="white" />,
    },
    {
      title: t("gear-items.gauntlets"),
      name: "gauntlets",
      level: heroGear.gauntletsLevel,
      starLevel: heroGear.gauntletsStarLevel,
      icon: <IconHandStop color="white" />,
    },
    {
      title: t("gear-items.legsArmor"),
      name: "legsArmor",
      level: heroGear.legsArmorLevel,
      starLevel: heroGear.legsArmorStarLevel,
      icon: <IconSock color="white" />,
    },
    {
      title: t("gear-items.shield"),
      name: "shield",
      level: heroGear.shieldLevel,
      starLevel: heroGear.shieldStarLevel,
      icon: <IconShield color="white" />,
    },
    {
      title: t("gear-items.necklace"),
      name: "necklace",
      level: heroGear.necklaceLevel,
      starLevel: heroGear.necklaceStarLevel,
      icon: <IconDiamond color="white" />,
    },
    {
      title: t("gear-items.ring"),
      name: "ring",
      level: heroGear.ringLevel,
      starLevel: heroGear.ringStarLevel,
      icon: <IconRings color="white" />,
    },
    {
      title: t("gear-items.spaulders"),
      name: "spaulders",
      level: heroGear.spauldersLevel,
      starLevel: heroGear.spauldersStarLevel,
      icon: <IconShieldChevron color="white" />,
    },
    {
      title: t("gear-items.backArmor"),
      name: "backArmor",
      level: heroGear.backArmorLevel,
      starLevel: heroGear.backArmorStarLevel,
      icon: <IconShieldDown color="white" />,
    },
    {
      title: t("gear-items.belt"),
      name: "belt",
      level: heroGear.beltLevel,
      starLevel: heroGear.beltStarLevel,
      icon: <IconBrandBootstrap color="white" />,
    },
    {
      title: t("gear-items.boots"),
      name: "boots",
      level: heroGear.bootsLevel,
      starLevel: heroGear.bootsStarLevel,
      icon: <IconShoe color="white" />,
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
