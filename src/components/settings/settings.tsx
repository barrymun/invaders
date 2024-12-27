import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, Group, Text } from "@mantine/core";
import { getCountryCode } from "countries-list";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { InputController, SelectController } from "components";
import {
  defaultCountry,
  defaultCountrySelectData,
  defaultCountryFlag,
  defaultCountryData,
  playerNameMaxLength,
  getDb,
  getEmojiFlagExtended,
} from "db";
import { SettingsForm } from "forms";
import { usePlayer } from "hooks";

import classes from "./settings.module.scss";

const db = getDb();

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const { t } = useTranslation("translation");

  const { player } = usePlayer();

  const [flag, setFlag] = useState<string>(defaultCountryFlag);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().max(playerNameMaxLength),
    countryName: Yup.string().required(),
  });

  const formMethods = useForm<SettingsForm>({
    values: {
      name: player.name,
      countryName: player.country.name,
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
      await db.players.update(player.id, {
        name: getValues("name"),
        country:
          Object.values(defaultCountryData).find((country) => country.name === getValues("countryName")) ??
          defaultCountry,
      });
      reset({ name: getValues("name"), countryName: getValues("countryName") });
    } catch (_err) {
      // no op
    }
  };

  useEffect(() => {
    const countryCode = getCountryCode(getValues("countryName"));
    if (!countryCode) {
      setFlag(defaultCountryFlag);
      return;
    }
    const newFlag = getEmojiFlagExtended(countryCode);
    setFlag(newFlag);
  }, [formMethods.getValues("countryName")]);

  return (
    <Box className={classes.settings}>
      <form onSubmit={handleSubmit(handleSave)}>
        <Card padding="xs">
          <Card.Section withBorder inheritPadding py="xs">
            <Text size="xl">{t("settings.title")}</Text>
          </Card.Section>

          <Group gap="xs">
            <InputController name="name" formMethods={formMethods} label={t("settings.form.name")} />
          </Group>

          <Box className={classes.flag}>{flag}</Box>
          <Group gap="xs">
            <SelectController
              name="countryName"
              formMethods={formMethods}
              label={t("settings.form.countrySelect")}
              data={defaultCountrySelectData}
              searchable
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
        </Card>
      </form>
    </Box>
  );
};

export { Settings };
