import { Box, Text } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { getDb, worldMapSize } from "db";
import { convertTo2DArray } from "utils";

import { Tile } from "./tile";
import classes from "./world-map.module.scss";

const db = getDb();

let isDragging = false;
let startX = 0;
let startY = 0;
let initialScrollLeft = 0;
let initialScrollTop = 0;

interface WorldMapProps {}

const WorldMap: FC<WorldMapProps> = () => {
  const { t } = useTranslation("translation");

  const worldMapData = useLiveQuery(() => db.worldMap.toArray()) ?? [];

  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

  const worldMapTarget = useRef<HTMLDivElement | null>(null);

  const worldMap2D = useMemo(() => convertTo2DArray(worldMapData, worldMapSize), [worldMapData]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!worldMapTarget?.current) {
      return;
    }
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialScrollLeft = worldMapTarget.current.offsetLeft;
    initialScrollTop = worldMapTarget.current.offsetTop;
    setCursor("grabbing");
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) {
      return;
    }
    if (!worldMapTarget?.current) {
      return;
    }
    e.preventDefault(); // prevent text selection while dragging

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    setScrollLeft(initialScrollLeft + deltaX);
    setScrollTop(initialScrollTop + deltaY);
  };

  const handleMouseUp = (_event: MouseEvent) => {
    isDragging = false;
    setCursor("grab");
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (worldMapData.length === 0) {
    return <Text>{t("loading")}</Text>;
  }

  return (
    <Box className={classes.worldMapContainer}>
      <Box
        ref={worldMapTarget}
        style={{
          left: scrollLeft,
          top: scrollTop,
          cursor,
        }}
        onMouseDown={handleMouseDown}
        className={classes.worldMap}
      >
        {worldMap2D.map((worldMapRow, index) => (
          <Box key={index} className={classes.worldMapRow}>
            {worldMapRow.map((tile) => (
              <Tile key={tile.id} tile={tile} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export { WorldMap };
