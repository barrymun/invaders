import { Box, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, useEffect, useState } from "react";

import { Building } from "components";
import { CountyBuildingInfoModal, NewCountyBuildingModal } from "components/building";
import { BuildingModalProvider, useSelectedCity } from "hooks";
import { CountyBuilding } from "utils/global-state";

import classes from "./county.module.scss";

interface CountyProps {}

const County: FC<CountyProps> = () => {
  const [buildModalOpened, { open: openBuildModal, close: closeBuildModal }] = useDisclosure(false);
  const [infoModalOpened, { open: openInfoModal, close: closeInfoModal }] = useDisclosure(false);

  const { selectedCity, selectedCityIndex } = useSelectedCity();

  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState<number | null>(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<CountyBuilding["type"] | null>(null);

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
      <Box className={classes.county}>
        <Group>
          {selectedCity.county.buildings.map((building, index) => (
            <Building
              cityAreaType="county"
              key={index}
              building={building}
              handleBuild={handleOpenBuildModal(index)}
              handleInfo={handleOpenInfoModal(index)}
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
        <CountyBuildingInfoModal setSelectedBuildingType={setSelectedBuildingType} />
      </BuildingModalProvider>
    </>
  );
};

export { County };
