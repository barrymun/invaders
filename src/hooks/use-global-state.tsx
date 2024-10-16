import { Text } from "@mantine/core";
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLocalStorage } from "hooks";
import { getAllKeys, hasAllKeys } from "utils";
import { calculateCityResourceUpdates, defaultGlobalState, GlobalState, globalStateTimeout } from "utils/global-state";
import { LocalStorageKeys } from "utils/local-storage";

interface GlobalStateContextProps {
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

interface GlobalStateProviderProps {
  children: React.ReactNode;
}

const GlobalStateContext = createContext<GlobalStateContextProps>({
  globalState: defaultGlobalState,
  setGlobalState: () => {},
});

const GlobalStateProvider: FC<GlobalStateProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  const { getItem, setItem } = useLocalStorage();

  const [globalState, setGlobalState] = useState<GlobalState>(defaultGlobalState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const value = useMemo(
    () => ({
      globalState,
      setGlobalState,
    }),
    [globalState, setGlobalState]
  );

  const handleUpdateResources = useCallback(() => {
    const newCities = calculateCityResourceUpdates(globalState);
    setGlobalState((prev) => ({
      ...prev,
      cities: newCities,
    }));
  }, [globalState]);

  const handleBeforeUnload = useCallback(
    (_event: BeforeUnloadEvent) => {
      console.log("Saving global state on unmount...");
      setItem(LocalStorageKeys.GlobalState, globalState);
    },
    [globalState]
  );

  useEffect(() => {
    const item = getItem(LocalStorageKeys.GlobalState);
    if (item) {
      const allKeys = getAllKeys<GlobalState>(globalState);
      if (hasAllKeys<GlobalState>(item, allKeys)) {
        console.log(item);
        setGlobalState(item);
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * calculate resource updates given an interval
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleUpdateResources();
    }, globalStateTimeout);
    return () => {
      clearInterval(intervalId);
    };
  }, [globalState]);

  /**
   * save global state to local storage given an interval
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Saving global state...");
      setItem(LocalStorageKeys.GlobalState, globalState);
    }, globalStateTimeout);
    return () => {
      clearInterval(intervalId);
    };
  }, [globalState]);

  /**
   * save global state to local storage before unload
   */
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [globalState]);

  if (isLoading) {
    return <Text>{t("loading")}</Text>;
  }

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
};

const useGlobalState = () => useContext(GlobalStateContext);

export { GlobalStateProvider, useGlobalState };
