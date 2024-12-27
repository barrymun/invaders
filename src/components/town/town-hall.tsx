import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { SelectController } from "components/forms";
import { getDb, townHallEmoji } from "db";
import { cleanFormData, TownHallForm } from "forms";
import { useSelectedCity } from "hooks";
import { noneSelected } from "utils";

import classes from "./town.module.scss";

const db = getDb();

interface TownHallProps {}

const TownHall: FC<TownHallProps> = () => {
  const { t } = useTranslation("translation");

  const { selectedCity, heroes } = useSelectedCity();

  const formattedHeroes = useMemo(
    () => [
      { value: "", label: noneSelected },
      ...heroes.map((hero) => ({ value: hero.id.toString(), label: hero.name })),
    ],
    [heroes]
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    mayorId: Yup.number().nullable().defined(),
  });

  const formMethods = useForm<TownHallForm>({
    values: {
      mayorId: selectedCity.mayorId,
    },
    resolver: yupResolver(validationSchema),
  });

  const {
    getValues,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = formMethods;

  const handleReset = () => {
    reset();
  };

  const handleSave = async () => {
    try {
      const { mayorId } = cleanFormData(getValues());
      await db.cities.update(selectedCity.id, { mayorId });
      reset({ mayorId });
    } catch (_err) {
      // no op
    }
  };

  return (
    <>
      <Box className={classes.townHall}>
        <Card className={classes.townHallCard}>
          <Title className={classes.largeTitle}>{townHallEmoji}</Title>
          <Text>{t("town.town-hall.name")}</Text>
          <Text>
            {t("general.lvl")} {selectedCity.townHall.level}
          </Text>
          <Button size="compact-sm" onClick={() => setModalOpen(true)}>
            {t("general.info")}
          </Button>
        </Card>
      </Box>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={t("general.info")} centered size="xl">
        <Modal.Body>
          <form onSubmit={handleSubmit(handleSave)}>
            <Stack>
              <Group gap="xs">
                <SelectController
                  name="mayorId"
                  formMethods={formMethods}
                  label={t("town.town-hall.mayor")}
                  placeholder={t("town.town-hall.select-mayor")}
                  data={formattedHeroes}
                />
              </Group>

              <Group gap="xs" className={classes.formButtons}>
                <Button size="compact-sm" variant="outline" disabled={!isDirty} onClick={handleReset}>
                  {t("general.form.reset")}
                </Button>
                <Button size="compact-sm" type="submit" disabled={!isDirty}>
                  {t("general.form.save")}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { TownHall };
