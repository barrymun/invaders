import { Box, Button, Card, Text, Title } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { wallsEmoji } from "@db/consts";
import { useSelectedCity } from "@hooks/use-selected-city";

import classes from "./town.module.scss";

interface WallsProps {}

const Walls: FC<WallsProps> = () => {
  const { t } = useTranslation("translation");

  const { selectedCity } = useSelectedCity();

  return (
    <Box className={classes.walls}>
      <Card className={classes.wallsCard}>
        <Title className={classes.largeTitle}>{wallsEmoji}</Title>
        <Text>{t("town.walls")}</Text>
        <Text>
          {t("general.lvl")} {selectedCity.walls.level}
        </Text>
        <Button size="compact-sm">{t("general.info")}</Button>
      </Card>
    </Box>
  );
};

export { Walls };
