import { useLiveQuery } from "dexie-react-hooks";
import { createContext, Dispatch, FC, SetStateAction, useContext, useEffect, useMemo, useState } from "react";

import { City, CountyBuilding, db, TownBuilding } from "db";
import { useCities, usePlayer } from "hooks";

const defaultIndex = 0;

interface SelectedCityContextProps {
  selectedCity: City;
  townBuildings: TownBuilding[];
  countyBuildings: CountyBuilding[];
  setSelectedCity: Dispatch<SetStateAction<City>>;
}

interface SelectedCityProviderProps {
  children: React.ReactNode;
}

const SelectedCityContext = createContext<SelectedCityContextProps>({
  selectedCity: {} as City,
  townBuildings: [],
  countyBuildings: [],
  setSelectedCity: () => {},
});

const SelectedCityProvider: FC<SelectedCityProviderProps> = ({ children }) => {
  const { player } = usePlayer();
  const { cities } = useCities();

  const townBuildings =
    useLiveQuery(() => db.townBuildings.where({ playerId: player.id, cityId: selectedCity.id }).toArray()) ?? [];

  const countyBuildings =
    useLiveQuery(() => db.countyBuildings.where({ playerId: player.id, cityId: selectedCity.id }).toArray()) ?? [];

  const [selectedCity, setSelectedCity] = useState<City>(cities[defaultIndex]);

  const value = useMemo(
    () => ({
      selectedCity,
      townBuildings,
      countyBuildings,
      setSelectedCity,
    }),
    [selectedCity, townBuildings, countyBuildings, setSelectedCity]
  );

  /**
   * ensure that the selected city is always in sync with the cities array
   */
  useEffect(() => {
    setSelectedCity(cities.find((city) => city.id === selectedCity.id) ?? cities[defaultIndex]);
  }, [cities]);

  return <SelectedCityContext.Provider value={value}>{children}</SelectedCityContext.Provider>;
};

const useSelectedCity = () => useContext(SelectedCityContext);

export { SelectedCityProvider, useSelectedCity };
