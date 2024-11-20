import { useLiveQuery } from "dexie-react-hooks";
import { createContext, Dispatch, FC, SetStateAction, useContext, useEffect, useMemo, useState } from "react";

import { City, CountyBuilding, getDb, Hero, TownBuilding } from "db";
import { useCities, usePlayer } from "hooks";

const db = getDb();
const defaultIndex = 0;

interface SelectedCityContextProps {
  selectedCity: City;
  townBuildings: TownBuilding[];
  countyBuildings: CountyBuilding[];
  heroes: Hero[];
  setSelectedCity: Dispatch<SetStateAction<City>>;
}

interface SelectedCityProviderProps {
  children: React.ReactNode;
}

const SelectedCityContext = createContext<SelectedCityContextProps>({
  selectedCity: {} as City,
  townBuildings: [],
  countyBuildings: [],
  heroes: [],
  setSelectedCity: () => {},
});

const SelectedCityProvider: FC<SelectedCityProviderProps> = ({ children }) => {
  const { player } = usePlayer();
  const { cities } = useCities();

  const [selectedCity, setSelectedCity] = useState<City>(cities[defaultIndex]);

  const townBuildings =
    useLiveQuery(() => db.townBuildings.where({ playerId: player.id, cityId: selectedCity.id }).toArray()) ?? [];

  const countyBuildings =
    useLiveQuery(() => db.countyBuildings.where({ playerId: player.id, cityId: selectedCity.id }).toArray()) ?? [];

  const heroes = useLiveQuery(() => db.heroes.where({ playerId: player.id, cityId: selectedCity.id }).toArray()) ?? [];

  const value = useMemo(
    () => ({
      selectedCity,
      townBuildings,
      countyBuildings,
      heroes,
      setSelectedCity,
    }),
    [selectedCity, townBuildings, countyBuildings, heroes, setSelectedCity]
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
