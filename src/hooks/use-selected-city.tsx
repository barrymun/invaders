import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";

import { useGlobalState } from "hooks";
import { City } from "utils/global-state";

const defaultIndex = 0;

interface SelectedCityContextProps {
  selectedCity: City;
  selectedIndex: number;
  handleSetSelectedCity: (index: number) => void;
}

interface SelectedCityProviderProps {
  children: React.ReactNode;
}

const SelectedCityContext = createContext<SelectedCityContextProps>({
  selectedCity: {} as City,
  selectedIndex: defaultIndex,
  handleSetSelectedCity: (_: number) => {},
});

const SelectedCityProvider: FC<SelectedCityProviderProps> = ({ children }) => {
  const { globalState } = useGlobalState();

  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
  const [selectedCity, setSelectedCity] = useState<City>(globalState.cities[defaultIndex]);

  const handleSetSelectedCity = (index: number) => {
    setSelectedIndex(index);
  };

  const value = useMemo(
    () => ({
      selectedCity,
      selectedIndex,
      handleSetSelectedCity,
    }),
    [selectedCity, selectedIndex, handleSetSelectedCity]
  );

  useEffect(() => {
    setSelectedCity(globalState.cities[selectedIndex]);
  }, [globalState, selectedIndex]);

  return <SelectedCityContext.Provider value={value}>{children}</SelectedCityContext.Provider>;
};

const useSelectedCity = () => useContext(SelectedCityContext);

export { SelectedCityProvider, useSelectedCity };
