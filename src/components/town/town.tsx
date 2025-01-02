import { Box, Divider, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, useEffect, useMemo, useState } from "react";

import { Building, NewTownBuildingModal, TownBuildingInfoModal } from "@components/building";
import { maxTownBuildings } from "@db/consts";
import { TownBuilding } from "@db/models";
import { BuildingModalProvider } from "@hooks/use-building-modal";
import { useSelectedCity } from "@hooks/use-selected-city";
import { FixedLengthArray } from "@utils/types";

import { TownHall } from "./town-hall";
import classes from "./town.module.scss";
import { Walls } from "./walls";

interface TownProps {}

export const Town: FC<TownProps> = () => {
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
          <TownHall />
          <Walls />
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
