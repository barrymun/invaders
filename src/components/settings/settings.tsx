import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, Group, Text } from "@mantine/core";
import { getCountryCode } from "countries-list";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { SelectController } from "components";
import { SettingsForm } from "forms";
import { useGlobalState } from "hooks";
import {
  defaultCountry,
  defaultCountrySelectData,
  defaultCountryFlag,
  defaultCountryData,
  getFlagEmoji,
} from "utils/global-state";

import classes from "./settings.module.scss";

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "settings" });

  const { globalState, setGlobalState } = useGlobalState();

  const [flag, setFlag] = useState<string>(defaultCountryFlag);

  const validationSchema = Yup.object().shape({
    countryName: Yup.string().required(),
  });

  const formMethods = useForm<SettingsForm>({
    values: {
      countryName: globalState.player.country.name,
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

  const handleSave = () => {
    setGlobalState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        country:
          Object.values(defaultCountryData).find((country) => country.name === getValues("countryName")) ??
          defaultCountry,
      },
    }));
    reset({ countryName: getValues("countryName") });
  };

  useEffect(() => {
    const countryCode = getCountryCode(getValues("countryName"));
    if (!countryCode) {
      setFlag(defaultCountryFlag);
      return;
    }
    const newFlag = getFlagEmoji(countryCode);
    setFlag(newFlag);
  }, [formMethods.getValues("countryName")]);

  return (
    <Box className={classes.settings}>
      <form onSubmit={handleSubmit(handleSave)}>
        <Card padding="xs">
          <Text size="xl">{t("title")}</Text>
          <Box className={classes.flag}>{flag}</Box>
          <Group gap="xs">
            <SelectController
              name="countryName"
              formMethods={formMethods}
              label={t("form.countrySelect")}
              data={defaultCountrySelectData}
              searchable
            />
          </Group>

          <Group gap="xs" className={classes.formButtons}>
            <Button size="compact-sm" variant="outline" disabled={!isDirty} onClick={handleReset}>
              {t("form.reset")}
            </Button>
            <Button size="compact-sm" type="submit" disabled={!isDirty}>
              {t("form.save")}
            </Button>
          </Group>
        </Card>
      </form>
    </Box>
  );
};

export { Settings };
