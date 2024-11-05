import { Box, Text } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getDb, worldMapSize } from "db";
import { convertTo2DArray } from "utils";

import { Tile } from "./tile";
import classes from "./world-map.module.scss";

const db = getDb();

interface WorldMapProps {}

const WorldMap: FC<WorldMapProps> = () => {
  const { t } = useTranslation("translation");

  const worldMapData = useLiveQuery(() => db.worldMap.toArray()) ?? [];

  const worldMap2D = useMemo(() => convertTo2DArray(worldMapData, worldMapSize), [worldMapData]);

  if (worldMapData.length === 0) {
    return <Text>{t("loading")}</Text>;
  }

  return (
    <Box className={classes.worldMap}>
      {worldMap2D.map((worldMapRow) => (
        <Box className={classes.worldMapRow}>
          {worldMapRow.map((tile) => (
            <Tile key={tile.id} tile={tile} />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export { WorldMap };
