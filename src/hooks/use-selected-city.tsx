import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";

import { useGlobalState } from "hooks";
import { City } from "utils/global-state";

const defaultIndex = 0;

interface SelectedCityContextProps {
  selectedCity: City;
  selectedCityIndex: number;
  handleSetSelectedCity: (index: number) => void;
}

interface SelectedCityProviderProps {
  children: React.ReactNode;
}

const SelectedCityContext = createContext<SelectedCityContextProps>({
  selectedCity: {} as City,
  selectedCityIndex: defaultIndex,
  handleSetSelectedCity: (_: number) => {},
});

const SelectedCityProvider: FC<SelectedCityProviderProps> = ({ children }) => {
  const { globalState } = useGlobalState();

  const [selectedCityIndex, setSelectedIndex] = useState<number>(defaultIndex);
  const [selectedCity, setSelectedCity] = useState<City>(globalState.cities[defaultIndex]);

  const handleSetSelectedCity = (index: number) => {
    setSelectedIndex(index);
  };

  const value = useMemo(
    () => ({
      selectedCity,
      selectedCityIndex,
      handleSetSelectedCity,
    }),
    [selectedCity, selectedCityIndex, handleSetSelectedCity]
  );

  useEffect(() => {
    setSelectedCity(globalState.cities[selectedCityIndex]);
  }, [globalState, selectedCityIndex]);

  return <SelectedCityContext.Provider value={value}>{children}</SelectedCityContext.Provider>;
};

const useSelectedCity = () => useContext(SelectedCityContext);

export { SelectedCityProvider, useSelectedCity };
