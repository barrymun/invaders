import { Box, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, useEffect, useMemo, useState } from "react";

import { Building } from "components";
import { CountyBuildingInfoModal, NewCountyBuildingModal } from "components/building";
import { CountyBuilding, maxCountyBuildings } from "db";
import { BuildingModalProvider, useSelectedCity } from "hooks";
import { FixedLengthArray } from "utils";

import classes from "./county.module.scss";

interface CountyProps {}

const County: FC<CountyProps> = () => {
  const [buildModalOpened, { open: openBuildModal, close: closeBuildModal }] = useDisclosure(false);
  const [infoModalOpened, { open: openInfoModal, close: closeInfoModal }] = useDisclosure(false);

  const { selectedCity, countyBuildings } = useSelectedCity();

  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState<number | null>(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<CountyBuilding["type"] | null>(null);

  const mergedCountyBuildings = useMemo(
    () =>
      (
        new Array(maxCountyBuildings).fill(null) as FixedLengthArray<CountyBuilding | null, typeof maxCountyBuildings>
      ).map((_, index) => countyBuildings.find((b) => b.index === index) ?? null),
    [countyBuildings]
  );

  const handleOpenBuildModal = (index: number) => () => {
    setSelectedBuildingIndex(index);
    openBuildModal();
  };

  const handleOpenInfoModal =
    ({ index, type }: { index: number; type: CountyBuilding["type"] | null }) =>
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
      <Box className={classes.county}>
        <Group>
          {mergedCountyBuildings.map((building, index) => (
            <Building
              cityAreaType="county"
              key={index}
              building={building}
              handleBuild={handleOpenBuildModal(index)}
              handleInfo={handleOpenInfoModal({ index, type: building ? building.type : null })}
            />
          ))}
        </Group>
      </Box>

      <BuildingModalProvider
        cityAreaType="county"
        opened={buildModalOpened}
        selectedBuildingIndex={selectedBuildingIndex}
        selectedBuildingType={selectedBuildingType}
        close={closeBuildModal}
      >
        <NewCountyBuildingModal setSelectedBuildingType={setSelectedBuildingType} />
      </BuildingModalProvider>

      <BuildingModalProvider
        cityAreaType="county"
        opened={infoModalOpened}
        selectedBuildingIndex={selectedBuildingIndex}
        selectedBuildingType={selectedBuildingType}
        close={closeInfoModal}
      >
        <CountyBuildingInfoModal />
      </BuildingModalProvider>
    </>
  );
};

export { County };
