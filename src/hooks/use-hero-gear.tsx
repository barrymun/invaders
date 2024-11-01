import { Text } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { defaultHeroGear, getDb, HeroGear } from "db";

import { usePlayer } from "./use-player";

const db = getDb();

interface HeroGearContextProps extends HeroGear {}

interface HeroGearProviderProps {
  children: React.ReactNode;
}

const HeroGearContext = createContext<HeroGearContextProps>({
  id: 0,
  playerId: 0,
  ...defaultHeroGear,
});

const HeroGearProvider: FC<HeroGearProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  const { player } = usePlayer();

  const [heroGear, setHeroGear] = useState<HeroGear | null>(null);

  const heroGearData = useLiveQuery(() => db.heroGear.where({ playerId: player.id }).toArray()) ?? [];

  const value = useMemo(
    () => ({
      ...heroGear,
    }),
    [heroGear]
  );

  useEffect(() => {
    if (heroGearData.length === 0) {
      return;
    }
    setHeroGear(heroGearData[0]);
  }, [heroGearData]);

  if (!heroGear) {
    return <Text>{t("loading")}</Text>;
  }

  return <HeroGearContext.Provider value={value as HeroGearContextProps}>{children}</HeroGearContext.Provider>;
};

const useHeroGear = () => useContext(HeroGearContext);

export { HeroGearProvider, useHeroGear };
