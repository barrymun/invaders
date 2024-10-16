import { Box, Card, Divider, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Building } from "components";
import { NewTownBuildingModal, TownBuildingInfoModal } from "components/building";
import { BuildingModalProvider, useSelectedCity } from "hooks";
import { TownBuilding, townHallEmoji, wallsEmoji } from "utils/global-state";

import classes from "./town.module.scss";

interface TownProps {}

export const Town: FC<TownProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "town" });

  const [buildModalOpened, { open: openBuildModal, close: closeBuildModal }] = useDisclosure(false);
  const [infoModalOpened, { open: openInfoModal, close: closeInfoModal }] = useDisclosure(false);

  const { selectedCity, selectedCityIndex } = useSelectedCity();

  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState<number | null>(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<TownBuilding["type"] | null>(null);

  const handleOpenBuildModal = (index: number) => () => {
    setSelectedBuildingIndex(index);
    openBuildModal();
  };

  const handleOpenInfoModal = (index: number) => () => {
    setSelectedBuildingIndex(index);
    openInfoModal();
  };

  useEffect(() => {
    if (!buildModalOpened) {
      setSelectedBuildingIndex(null);
      setSelectedBuildingType(null);
    }
  }, [buildModalOpened]);

  useEffect(() => {
    setSelectedBuildingIndex(null);
    setSelectedBuildingType(null);
  }, [selectedCityIndex]);

  return (
    <>
      <Box className={classes.town}>
        <Group>
          <Box className={classes.townHall}>
            <Card className={classes.townHallCard}>
              <Title className={classes.largeTitle}>{townHallEmoji}</Title>
              <Text>{t("townHall")}</Text>
              <Text>{selectedCity.townHall.level}</Text>
            </Card>
          </Box>
          <Box className={classes.walls}>
            <Card className={classes.wallsCard}>
              <Title className={classes.largeTitle}>{wallsEmoji}</Title>
              <Text>{t("walls")}</Text>
              <Text>{selectedCity.walls.level}</Text>
            </Card>
          </Box>
        </Group>
        <Divider my="md" />
        <Group>
          {selectedCity.town.buildings.map((building, index) => (
            <Building
              cityAreaType="town"
              key={index}
              building={building}
              handleBuild={handleOpenBuildModal(index)}
              handleInfo={handleOpenInfoModal(index)}
            />
          ))}
        </Group>
      </Box>

      <BuildingModalProvider
        cityAreaType="town"
        opened={buildModalOpened}
        selectedBuildingIndex={selectedBuildingIndex}
        selectedBuildingType={selectedBuildingType}
        close={closeBuildModal}
      >
        <NewTownBuildingModal setSelectedBuildingType={setSelectedBuildingType} />
      </BuildingModalProvider>

      <BuildingModalProvider
        cityAreaType="town"
        opened={infoModalOpened}
        selectedBuildingIndex={selectedBuildingIndex}
        selectedBuildingType={selectedBuildingType}
        close={closeInfoModal}
      >
        <TownBuildingInfoModal setSelectedBuildingType={setSelectedBuildingType} />
      </BuildingModalProvider>
    </>
  );
};
