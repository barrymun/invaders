import { Modal } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useBuildingModal } from "@hooks/use-building-modal";

import classes from "./building-info-modal.module.scss";
import { DiningHall } from "./dining-hall";
import { Inn } from "./inn";

interface BuildingInfoModalProps {}

const BuildingInfoModal: FC<BuildingInfoModalProps> = () => {
  const { cityAreaType, opened, selectedBuildingType, close } = useBuildingModal();

  const { t } = useTranslation("translation", { keyPrefix: cityAreaType });

  const getModalBody = () => {
    switch (selectedBuildingType) {
      case "inn":
        return <Inn />;
      case "diningHall":
        return <DiningHall />;
      default:
        return null;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={t("info.modal.title")}
      centered
      size="xl"
      className={classes.newBuildingModal}
    >
      <Modal.Body>{getModalBody()}</Modal.Body>
    </Modal>
  );
};

export { BuildingInfoModal };
