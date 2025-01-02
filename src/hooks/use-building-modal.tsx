import { createContext, FC, useContext, useMemo } from "react";

import { CountyBuilding, TownBuilding } from "@db/models";

interface BuildingModalContextProviderProps {
  cityAreaType: "town" | "county";
  opened: boolean;
  selectedBuildingIndex: number | null;
  selectedBuildingType: TownBuilding["type"] | CountyBuilding["type"] | null;
  close: () => void;
}

interface BuildingModalContextProps extends BuildingModalContextProviderProps {}

interface BuildingModalProviderProps extends BuildingModalContextProviderProps {
  children: React.ReactNode;
}

const BuildingModalContext = createContext<BuildingModalContextProps>({
  cityAreaType: "town",
  opened: false,
  selectedBuildingIndex: null,
  selectedBuildingType: null,
  close: () => {},
});

const BuildingModalProvider: FC<BuildingModalProviderProps> = (props) => {
  const { cityAreaType, opened, selectedBuildingIndex, selectedBuildingType, close, children } = props;

  const value = useMemo(
    () => ({
      cityAreaType,
      opened,
      selectedBuildingIndex,
      selectedBuildingType,
      close,
    }),
    [cityAreaType, opened, selectedBuildingIndex, selectedBuildingType, close]
  );

  return <BuildingModalContext.Provider value={value}>{children}</BuildingModalContext.Provider>;
};

const useBuildingModal = () => useContext(BuildingModalContext);

export { BuildingModalProvider, useBuildingModal };
export { type BuildingModalContextProviderProps };
