import { Text } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { createContext, FC, useCallback, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { resourceUpdateTimeout } from "@db/consts";
import { getDb } from "@db/db";
import { updateCitiesResources } from "@db/helpers";
import { City } from "@db/models";

import { usePlayer } from "./use-player";

const db = getDb();

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  if (cities.length === 0) {
    return <Text>{t("loading")}</Text>;
  }

  return <CitiesContext.Provider value={value as CitiesContextProps}>{children}</CitiesContext.Provider>;
};

const useCities = () => useContext(CitiesContext);

export { CitiesProvider, useCities };
