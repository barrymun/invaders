import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLocalStorage } from "hooks";
import { getAllKeys, hasAllKeys } from "utils";
import { defaultGlobalState, GlobalState } from "utils/global-state";
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

  const { getItem } = useLocalStorage();

  const [globalState, setGlobalState] = useState<GlobalState>(defaultGlobalState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const value = useMemo(
    () => ({
      globalState,
      setGlobalState,
    }),
    [globalState, setGlobalState]
  );

  useEffect(() => {
    const item = getItem(LocalStorageKeys.GlobalState);
    if (item) {
      const allKeys = getAllKeys<GlobalState>(globalState);
      console.log(allKeys);
      if (hasAllKeys<GlobalState>(item, allKeys)) {
        setGlobalState(item);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
};

const useGlobalState = () => useContext(GlobalStateContext);

export { GlobalStateProvider, useGlobalState };
