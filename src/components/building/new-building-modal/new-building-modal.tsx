import { Box, Button, Card, Group, Modal, Text, Title } from "@mantine/core";
import classNames from "classnames";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { countyBuildingEmojiMap, townBuildingEmojiMap } from "@db/consts";
import { CountyBuilding, TownBuilding } from "@db/models";
import { useBuildingModal } from "@hooks/use-building-modal";

import classes from "./new-building-modal.module.scss";

interface CanBuildNewBuildingProps {
  buildingIndex: number;
  proposedBuildingType: TownBuilding["type"] | CountyBuilding["type"];
}

interface NewBuildingModalProps {
  canBuildFn: (props: CanBuildNewBuildingProps) => boolean;
  handleSelectBuildingType: (index: number) => () => void;
  handleConfirmBuild: () => Promise<void>;
}

const NewBuildingModal: FC<NewBuildingModalProps> = (props) => {
  const { canBuildFn, handleSelectBuildingType, handleConfirmBuild } = props;

  const { cityAreaType, opened, selectedBuildingIndex, selectedBuildingType, close } = useBuildingModal();

  const { t } = useTranslation("translation", { keyPrefix: cityAreaType });

  const buildingEmojiMap = cityAreaType === "town" ? townBuildingEmojiMap : countyBuildingEmojiMap;

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
