import { Box, Card, Divider, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Building } from "components";
import { NewTownBuildingModal, TownBuildingInfoModal } from "components/building";
import { maxTownBuildings, TownBuilding, townHallEmoji, wallsEmoji } from "db";
import { BuildingModalProvider, useSelectedCity } from "hooks";
import { FixedLengthArray } from "utils";

import classes from "./town.module.scss";

interface TownProps {}

export const Town: FC<TownProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "town" });

  const [buildModalOpened, { open: openBuildModal, close: closeBuildModal }] = useDisclosure(false);
  const [infoModalOpened, { open: openInfoModal, close: closeInfoModal }] = useDisclosure(false);

  const { selectedCity, townBuildings } = useSelectedCity();

  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState<number | null>(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<TownBuilding["type"] | null>(null);

  const mergedTownBuildings = useMemo(
    () =>
      (new Array(maxTownBuildings).fill(null) as FixedLengthArray<TownBuilding | null, typeof maxTownBuildings>).map(
        (_, index) => townBuildings.find((b) => b.index === index) ?? null
      ),
    [townBuildings]
  );

  const handleOpenBuildModal = (index: number) => () => {
    setSelectedBuildingIndex(index);
    openBuildModal();
  };

  const handleOpenInfoModal =
    ({ index, type }: { index: number; type: TownBuilding["type"] | null }) =>
    () => {
      setSelectedBuildingIndex(index);
      setSelectedBuildingType(type);
      openInfoModal();
    };

  useEffect(() => {
    if (!buildModalOpened) {
      setSelectedBuildingIndex(null);
      setSelectedBuildingType(null);
    }
  }, [buildModalOpened]);

  useEffect(() => {
    if (!infoModalOpened) {
      setSelectedBuildingIndex(null);
      setSelectedBuildingType(null);
    }
  }, [infoModalOpened]);

  useEffect(() => {
    setSelectedBuildingIndex(null);
    setSelectedBuildingType(null);
  }, [selectedCity.id]);

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
          {mergedTownBuildings.map((building, index) => (
            <Building
              cityAreaType="town"
              key={index}
              building={building}
              handleBuild={handleOpenBuildModal(index)}
              handleInfo={handleOpenInfoModal({ index, type: building ? building.type : null })}
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
        <TownBuildingInfoModal />
      </BuildingModalProvider>
    </>
  );
};
