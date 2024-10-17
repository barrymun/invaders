import { Box, Button, Card, Text, Title } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { buildingEmojiMap, City, emptyLandPlotEmoji } from "utils/global-state";

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
  building: City["town"]["buildings"][number];
  handleBuild: () => void;
  handleInfo: () => void;
}

const Building: FC<BuildingProps> = (props) => {
  const { t } = useTranslation("translation", { keyPrefix: "town" });

  const { building, handleBuild, handleInfo } = props;

  if (!building) {
    return (
      <Container>
        <Title>{emptyLandPlotEmoji}</Title>
        <Text>{t("build.emptyLandPlot")}</Text>
        <Button size="compact-sm" onClick={handleBuild} color="teal">
          {t("build.openModal")}
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{buildingEmojiMap[building.type]}</Title>
      <Text>{t(`build.modal.cityBuildings.${building.type}`)}</Text>
      <Button size="compact-sm" onClick={handleInfo}>
        {t("info.openModal")}
      </Button>
    </Container>
  );
};

export { Building };
