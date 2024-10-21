import { Modal } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useBuildingModal } from "hooks";

import classes from "./building-info-modal.module.scss";
import { Inn } from "./inn";

interface BuildingInfoModalProps {}

const BuildingInfoModal: FC<BuildingInfoModalProps> = () => {
  const { cityAreaType, opened, selectedBuildingType, close } = useBuildingModal();

  const { t } = useTranslation("translation", { keyPrefix: cityAreaType });

  const getModalBody = () => {
    switch (selectedBuildingType) {
      case "inn":
        return <Inn />;
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
