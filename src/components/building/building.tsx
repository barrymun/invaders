import { Box, Button, Card, Text, Title } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  townBuildingEmojiMap,
  emptyTownLandEmoji,
  TownBuilding,
  CountyBuilding,
  emptyCountyLandEmoji,
  countyBuildingEmojiMap,
} from "utils/global-state";

import classes from "./building.module.scss";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  return (
    <Box className={classes.building}>
      <Card className={classes.buildingCard}>
        <Box className={classes.buildingInfo}>{children}</Box>
      </Card>
    </Box>
  );
};

interface BuildingProps {
  cityAreaType: "town" | "county";
  building: TownBuilding | CountyBuilding | null;
  handleBuild: () => void;
  handleInfo: () => void;
}

const Building: FC<BuildingProps> = (props) => {
  const { cityAreaType, building, handleBuild, handleInfo } = props;

  const { t } = useTranslation("translation", { keyPrefix: cityAreaType });

  const landEmoji = cityAreaType === "town" ? emptyTownLandEmoji : emptyCountyLandEmoji;

  if (!building) {
    return (
      <Container>
        <Title>{landEmoji}</Title>
        <Text>{t("build.emptyLandPlot")}</Text>
        <Button size="compact-sm" onClick={handleBuild} color="teal">
          {t("build.openModal")}
        </Button>
      </Container>
    );
  }

  // building must not be null after this point
  const buildingEmoji =
    cityAreaType === "town"
      ? townBuildingEmojiMap[(building as TownBuilding).type]
      : countyBuildingEmojiMap[(building as CountyBuilding).type];

  return (
    <Container>
      <Title>{buildingEmoji}</Title>
      <Text>{t(`build.modal.buildings.${building.type}`)}</Text>
      <Button size="compact-sm" onClick={handleInfo}>
        {t("info.openModal")}
      </Button>
    </Container>
  );
};

export { Building };
