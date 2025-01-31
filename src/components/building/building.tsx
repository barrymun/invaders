import { Box, Button, Card, Text, Title } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { countyBuildingEmojiMap, emptyCountyLandEmoji, emptyTownLandEmoji, townBuildingEmojiMap } from "@db/consts";
import { CountyBuilding, TownBuilding } from "@db/models";

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
        <Text>{t("build.empty-land-plot")}</Text>
        <Button size="compact-sm" onClick={handleBuild} color="teal">
          {t("build.open-modal")}
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
        {t("info.open-modal")}
      </Button>
    </Container>
  );
};

export { Building };
