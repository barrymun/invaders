import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";

import { useGlobalState } from "hooks";
import { City } from "utils/global-state";

interface SelectedCityContextProps {
  selectedCity: City;
  handleSetSelectedCity: (index: number) => void;
}

interface SelectedCityProviderProps {
  children: React.ReactNode;
}

const SelectedCityContext = createContext<SelectedCityContextProps>({
  selectedCity: {} as City,
  handleSetSelectedCity: (_: number) => {},
});

const SelectedCityProvider: FC<SelectedCityProviderProps> = ({ children }) => {
  const { globalState } = useGlobalState();

  const defaultIndex = 0;

  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
  const [selectedCity, setSelectedCity] = useState<City>(globalState.cities[defaultIndex]);

  const handleSetSelectedCity = (index: number) => {
    setSelectedIndex(index);
  };

  const value = useMemo(
    () => ({
      selectedCity,
      handleSetSelectedCity,
    }),
    [selectedCity, handleSetSelectedCity]
  );

  useEffect(() => {
    setSelectedCity(globalState.cities[selectedIndex]);
  }, [globalState, selectedIndex]);

  return <SelectedCityContext.Provider value={value}>{children}</SelectedCityContext.Provider>;
};

const useSelectedCity = () => useContext(SelectedCityContext);

export { SelectedCityProvider, useSelectedCity };
