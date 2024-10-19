import { Text } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { createContext, FC, useCallback, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { db, resourceUpdateTimeout, updateCitiesResources } from "db";
import { City } from "db";
import { usePlayer } from "hooks";

interface CitiesContextProps {
  cities: City[];
}

interface CitiesProviderProps {
  children: React.ReactNode;
}

const CitiesContext = createContext<CitiesContextProps>({
  cities: [],
});

const CitiesProvider: FC<CitiesProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  const { player } = usePlayer();

  const cities = useLiveQuery(() => db.cities.where({ playerId: player.id }).toArray()) ?? [];

  const handleUpdateResources = useCallback(async () => {
    console.log("updating resources");
    updateCitiesResources(cities);
  }, [cities]);

  const value = useMemo(
    () => ({
      cities,
    }),
    [cities]
  );

  /**
   * calculate resource updates given an interval
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleUpdateResources();
    }, resourceUpdateTimeout);
    return () => {
      clearInterval(intervalId);
    };
  }, [cities]);

  if (cities.length === 0) {
    return <Text>{t("loading")}</Text>;
  }

  return <CitiesContext.Provider value={value as CitiesContextProps}>{children}</CitiesContext.Provider>;
};

const useCities = () => useContext(CitiesContext);

export { CitiesProvider, useCities };
