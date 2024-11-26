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

  const worldMapContainerTarget = useRef<HTMLDivElement | null>(null);
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

    if (!worldMapContainerTarget?.current || !worldMapTarget?.current) {
      return;
    }

    e.preventDefault(); // prevent text selection while dragging

    const maxScrollLeft = worldMapTarget.current.clientWidth - worldMapContainerTarget.current.clientWidth;
    const maxScrollTop = worldMapTarget.current.clientHeight - worldMapContainerTarget.current.clientHeight;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newScrollLeft = initialScrollLeft + deltaX;
    console.log(newScrollLeft);
    if (newScrollLeft > 0) {
      newScrollLeft = 0;
    } else if (Math.abs(newScrollLeft) > maxScrollLeft) {
      newScrollLeft = Math.abs(maxScrollLeft) * -1;
    }

    let newScrollTop = initialScrollTop + deltaY;
    if (newScrollTop > 0) {
      newScrollTop = 0;
    } else if (Math.abs(newScrollTop) > maxScrollTop) {
      newScrollTop = Math.abs(maxScrollTop) * -1;
    }

    setScrollLeft(newScrollLeft);
    setScrollTop(newScrollTop);
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
    <Box ref={worldMapContainerTarget} className={classes.worldMapContainer}>
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
