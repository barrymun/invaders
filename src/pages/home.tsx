import { FC } from "react";
import { useTranslation } from "react-i18next";

interface HomeProps {}

export const Home: FC<HomeProps> = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("home")}</h1>
    </div>
  );
};
