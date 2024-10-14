import { createContext, FC, useContext, useEffect, useMemo } from "react";

import { LocalStorageKeys, LocalStorageValueMap } from "utils/local-storage";

interface LocalStorageContextProps {
  getItem: <K extends LocalStorageKeys>(key: K) => LocalStorageValueMap[K] | null;
  setItem: <K extends LocalStorageKeys>(key: K, value: LocalStorageValueMap[K]) => void;
}

interface LocalStorageProviderProps {
  children: React.ReactNode;
}

const LocalStorageContext = createContext<LocalStorageContextProps>({
  getItem: () => null,
  setItem: () => {},
});

const LocalStorageProvider: FC<LocalStorageProviderProps> = ({ children }) => {
  const getItem = <K extends LocalStorageKeys>(key: K): LocalStorageValueMap[K] | null => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value) as LocalStorageValueMap[K];
      } catch {
        return null;
      }
    }
    return null;
  };

  const setItem = <K extends LocalStorageKeys>(key: K, value: LocalStorageValueMap[K]): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const value = useMemo(
    () => ({
      getItem,
      setItem,
    }),
    [getItem, setItem]
  );

  useEffect(() => {}, []);

  return <LocalStorageContext.Provider value={value}>{children}</LocalStorageContext.Provider>;
};

const useLocalStorage = () => useContext(LocalStorageContext);

export { LocalStorageProvider, useLocalStorage };
