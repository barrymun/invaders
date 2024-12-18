import { Text } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { defaultPlayer, initializeDatabase, isGameReady, Player, getDb } from "db";

const db = getDb();

interface PlayerContextProps {
  player: Player;
}

interface PlayerProviderProps {
  children: React.ReactNode;
}

const PlayerContext = createContext<PlayerContextProps>({
  player: { ...defaultPlayer, id: 0 }, // using id 0 as a placeholder
});

const PlayerProvider: FC<PlayerProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  const playersData = useLiveQuery(() => db.players.toArray()) ?? [];

  const [player, setPlayer] = useState<Player | null>(null);

  const handleInitDatabase = async () => {
    const r = await isGameReady();
    console.log({ r });
    if (!r) {
      await initializeDatabase();
    }
  };

  const value = useMemo(
    () => ({
      player,
    }),
    [player]
  );

  useEffect(() => {
    handleInitDatabase();
  }, []);

  useEffect(() => {
    if (playersData.length === 0) {
      return;
    }
    setPlayer(playersData[0]);
  }, [playersData]);

  // ensure player is loaded
  if (!player) {
    return <Text>{t("loading")}</Text>;
  }

  return <PlayerContext.Provider value={value as PlayerContextProps}>{children}</PlayerContext.Provider>;
};

const usePlayer = () => useContext(PlayerContext);

export { PlayerProvider, usePlayer };
