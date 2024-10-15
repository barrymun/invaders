import { Box, Text } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface HomeProps {}

export const Home: FC<HomeProps> = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Text>{t("home")}</Text>
    </Box>
  );
};
