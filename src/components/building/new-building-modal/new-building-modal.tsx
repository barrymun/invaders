import { Box, Button, Card, Group, Modal, Text, Title } from "@mantine/core";
import classNames from "classnames";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useGlobalState, useBuildingModal, useSelectedCity } from "hooks";
import { townBuildingEmojiMap, TownBuilding, City, CountyBuilding, countyBuildingEmojiMap } from "utils/global-state";

import classes from "./new-building-modal.module.scss";

interface CanBuildNewBuildingProps {
  buildingIndex: number;
  proposedBuildingType: TownBuilding["type"] | CountyBuilding["type"];
}

interface NewBuildingModalProps {
  canBuildFn: (props: CanBuildNewBuildingProps) => boolean;
  handleSelectBuildingType: (index: number) => () => void;
}

const NewBuildingModal: FC<NewBuildingModalProps> = (props) => {
  const { canBuildFn, handleSelectBuildingType } = props;

  const { cityAreaType, opened, selectedBuildingIndex, selectedBuildingType, close } = useBuildingModal();

  const { t } = useTranslation("translation", { keyPrefix: cityAreaType });

  const { setGlobalState } = useGlobalState();
  const { selectedCityIndex } = useSelectedCity();

  const buildingEmojiMap = cityAreaType === "town" ? townBuildingEmojiMap : countyBuildingEmojiMap;

  const handleConfirmBuild = () => {
    if (selectedBuildingIndex === null || selectedBuildingType === null) {
      return;
    }
    if (!canBuildFn({ buildingIndex: selectedBuildingIndex, proposedBuildingType: selectedBuildingType })) {
      return;
    }
    setGlobalState((prev) => ({
      ...prev,
      cities: [
        ...prev.cities.slice(0, selectedCityIndex),
        {
          ...prev.cities[selectedCityIndex],
          [cityAreaType]: {
            ...prev.cities[selectedCityIndex][cityAreaType],
            buildings: [
              ...prev.cities[selectedCityIndex][cityAreaType].buildings.slice(0, selectedBuildingIndex),
              {
                type: selectedBuildingType,
                level: 1,
              },
              ...prev.cities[selectedCityIndex][cityAreaType].buildings.slice(selectedBuildingIndex + 1),
            ] as City[typeof cityAreaType]["buildings"],
          },
        },
        ...prev.cities.slice(selectedCityIndex + 1),
      ],
    }));
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={t("build.modal.title")}
      centered
      size="xl"
      className={classes.newBuildingModal}
    >
      <Modal.Body>
        <Box className={classes.modalBuildings}>
          {selectedBuildingIndex !== null &&
            Object.entries(buildingEmojiMap).map(([type, emoji], index) => {
              const buildingType =
                cityAreaType === "town" ? (type as TownBuilding["type"]) : (type as CountyBuilding["type"]);
              const canBuild = canBuildFn({
                buildingIndex: selectedBuildingIndex,
                proposedBuildingType: buildingType,
              });
              return (
                <Card
                  key={index}
                  className={classNames(classes.modalBuilding, {
                    [classes.modalBuildingSelected]: type === selectedBuildingType,
                    [classes.modalBuildingDisabled]: !canBuild,
                  })}
                  onClick={handleSelectBuildingType(index)}
                >
                  <Group>
                    <Title>{emoji}</Title>
                    <Text>{t(`build.modal.buildings.${buildingType}`)}</Text>
                  </Group>
                </Card>
              );
            })}
        </Box>
      </Modal.Body>

      <Group mt="xl">
        <Button disabled={selectedBuildingType === null} onClick={handleConfirmBuild}>
          {t("build.modal.confirmBuild")}
        </Button>
      </Group>
    </Modal>
  );
};

export { NewBuildingModal };
export { type CanBuildNewBuildingProps };
