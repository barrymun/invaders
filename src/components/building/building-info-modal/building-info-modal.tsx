import { Modal } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useBuildingModal } from "hooks";

import classes from "./building-info-modal.module.scss";

interface BuildingInfoModalProps {}

const BuildingInfoModal: FC<BuildingInfoModalProps> = () => {
  const { cityAreaType, opened, close } = useBuildingModal();

  const { t } = useTranslation("translation", { keyPrefix: cityAreaType });

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={t("info.modal.title")}
      centered
      size="xl"
      className={classes.newBuildingModal}
    >
      <Modal.Body>INFO</Modal.Body>
    </Modal>
  );
};

export { BuildingInfoModal };
