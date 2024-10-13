import { createContext, FC, useContext, useEffect, useMemo } from "react";

import { LocalStorageKeys } from "utils";

interface LocalStorageContextProps {
  getItem: <T extends LocalStorageKeys>(key: string) => T | null;
  setItem: <T extends LocalStorageKeys>(key: string, value: T) => void;
}

interface LocalStorageProviderProps {
  children: React.ReactNode;
}

const LocalStorageContext = createContext<LocalStorageContextProps>({
  getItem: () => null,
  setItem: () => {},
});

const LocalStorageProvider: FC<LocalStorageProviderProps> = ({ children }) => {
  const getItem = <T extends LocalStorageKeys>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  };

  const setItem = <T extends LocalStorageKeys>(key: string, value: T): void => {
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
