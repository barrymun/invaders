import { Box, Button, Card, Group, Modal, Text, Title } from "@mantine/core";
import classNames from "classnames";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useGlobalState, useSelectedCity } from "hooks";
import { FixedLengthArray } from "utils";
import { buildingEmojiMap, canBuildTownBuilding, TownBuilding } from "utils/global-state";

import classes from "./new-building-modal.module.scss";

interface NewBuildingModalProps {
  opened: boolean;
  close: () => void;
  selectedBuildingIndex: number | null;
  setSelectedBuildingIndex: (index: number | null) => void;
  selectedBuildingType: TownBuilding["type"] | null;
  setSelectedBuildingType: (type: TownBuilding["type"] | null) => void;
}

const NewBuildingModal: FC<NewBuildingModalProps> = (props) => {
  const { t } = useTranslation("translation", { keyPrefix: "town" });

  const { opened, close, selectedBuildingIndex, selectedBuildingType, setSelectedBuildingType } = props;

  const { selectedCity, selectedCityIndex } = useSelectedCity();
  const { setGlobalState } = useGlobalState();

  const handleSelectBuildingType = (index: number) => () => {
    if (selectedBuildingIndex === null) {
      return;
    }
    const proposedBuildingType = Object.keys(buildingEmojiMap)[index] as TownBuilding["type"];
    const canBuild = canBuildTownBuilding({
      buildings: selectedCity.town.buildings,
      buildingIndex: selectedBuildingIndex,
      proposedBuildingType,
    });
    if (!canBuild) {
      return;
    }
    setSelectedBuildingType(proposedBuildingType);
  };

  const handleConfirmBuild = () => {
    if (selectedBuildingIndex === null || selectedBuildingType === null) {
      return;
    }
    const canBuild = canBuildTownBuilding({
      buildings: selectedCity.town.buildings,
      buildingIndex: selectedBuildingIndex,
      proposedBuildingType: selectedBuildingType,
    });
    if (!canBuild) {
      return;
    }
    setGlobalState((prev) => ({
      ...prev,
      cities: [
        ...prev.cities.slice(0, selectedCityIndex),
        {
          ...prev.cities[selectedCityIndex],
          town: {
            ...prev.cities[selectedCityIndex].town,
            buildings: [
              ...prev.cities[selectedCityIndex].town.buildings.slice(0, selectedBuildingIndex),
              {
                type: selectedBuildingType,
                level: 1,
              },
              ...prev.cities[selectedCityIndex].town.buildings.slice(selectedBuildingIndex + 1),
            ] as FixedLengthArray<TownBuilding | null, 32>,
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
      className={classes.townModal}
    >
      <Modal.Body>
        <Box className={classes.modalBuildings}>
          {selectedBuildingIndex &&
            Object.entries(buildingEmojiMap).map(([type, emoji], index) => {
              const buildingType = type as TownBuilding["type"];
              const canBuild = canBuildTownBuilding({
                buildings: selectedCity.town.buildings,
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
                    <Text>{t(`build.modal.cityBuildings.${buildingType}`)}</Text>
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
