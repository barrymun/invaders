import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLocalStorage } from "hooks";
import { getAllKeys, hasAllKeys } from "utils";
import { calculateResourceUpdates, defaultGlobalState, GlobalState, globalStateTimeout } from "utils/global-state";
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
    const newResources = calculateResourceUpdates(globalState);
    setGlobalState((prev) => ({
      ...prev,
      city: {
        ...prev.city,
        resources: {
          ...newResources,
        },
      },
    }));
  }, [globalState]);

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

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
};

const useGlobalState = () => useContext(GlobalStateContext);

export { GlobalStateProvider, useGlobalState };
