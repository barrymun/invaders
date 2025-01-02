import { Box, Text } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { worldMapSize } from "@db/consts";
import { getDb } from "@db/db";
import { TileType } from "@db/enums";
import { convertTo2DArray } from "@utils/helpers";

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

  const [searchParams, _setSearchParams] = useSearchParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const worldMapData = useLiveQuery(() => db.worldMap.toArray()) ?? [];

  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

  const worldMapContainerTarget = useRef<HTMLDivElement | null>(null);
  const worldMapTarget = useRef<HTMLDivElement | null>(null);

  const worldMap2D = useMemo(() => convertTo2DArray(worldMapData, worldMapSize), [worldMapData]);

  const handleDownStartEvent = ({ x, y }: { x: number; y: number }) => {
    if (!worldMapTarget?.current) {
      return;
    }
    isDragging = true;
    startX = x;
    startY = y;
    initialScrollLeft = worldMapTarget.current.offsetLeft;
    initialScrollTop = worldMapTarget.current.offsetTop;
    setCursor("grabbing");
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // ignore right click or 2 finger click on trackpad
    if (e.button === 2 || e.buttons === 2) {
      return;
    }
    handleDownStartEvent({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleDownStartEvent({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMoveEvent = ({ x, y }: { x: number; y: number }) => {
    if (!isDragging) {
      return;
    }

    if (!worldMapContainerTarget?.current || !worldMapTarget?.current) {
      return;
    }

    const maxScrollLeft = worldMapTarget.current.clientWidth - worldMapContainerTarget.current.clientWidth;
    const maxScrollTop = worldMapTarget.current.clientHeight - worldMapContainerTarget.current.clientHeight;

    const deltaX = x - startX;
    const deltaY = y - startY;

    let newScrollLeft = initialScrollLeft + deltaX;
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

    // handle case where the width or height of the world map is smaller than the container
    if (worldMapTarget.current.clientWidth <= worldMapContainerTarget.current.clientWidth) {
      newScrollLeft = 0;
    }
    if (worldMapTarget.current.clientHeight <= worldMapContainerTarget.current.clientHeight) {
      newScrollTop = 0;
    }

    setScrollLeft(newScrollLeft);
    setScrollTop(newScrollTop);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault(); // prevent text selection while dragging
    handleMoveEvent({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMoveEvent({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleUpEvent = () => {
    isDragging = false;
    setCursor("grab");
  };

  const handleMouseUp = (_e: MouseEvent) => {
    handleUpEvent();
  };

  const handleTouchUp = (_e: TouchEvent) => {
    handleUpEvent();
  };

  const handleResize = () => {
    setScrollLeft(0);
    setScrollTop(0);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchUp);
    window.addEventListener("touchcancel", handleTouchUp);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchUp);
      window.removeEventListener("touchcancel", handleTouchUp);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * if the x and y query params are present, scroll to the target tile
   * otherwise scroll to the player's city
   */
  useEffect(() => {
    let targetTile: HTMLElement | null = null;
    if (searchParams.has("x") && searchParams.has("y")) {
      targetTile = document.getElementById(`tile-${searchParams.get("x")}-${searchParams.get("y")}`);
    } else {
      const playerCity = worldMapData.find((tile) => tile.tileType === TileType.City);
      if (playerCity) {
        targetTile = document.getElementById(`tile-${playerCity.x}-${playerCity.y}`);
      }
    }

    if (!targetTile) {
      return;
    }

    initialScrollLeft = targetTile.offsetLeft;
    initialScrollTop = targetTile.offsetTop;

    if (!worldMapContainerTarget?.current || !worldMapTarget?.current) {
      return;
    }

    const maxScrollLeft = worldMapTarget.current.clientWidth - worldMapContainerTarget.current.clientWidth;
    const maxScrollTop = worldMapTarget.current.clientHeight - worldMapContainerTarget.current.clientHeight;

    if (initialScrollLeft > maxScrollLeft) {
      initialScrollLeft = maxScrollLeft;
    }

    if (initialScrollTop > maxScrollTop) {
      initialScrollTop = maxScrollTop;
    }

    setScrollLeft(-initialScrollLeft);
    setScrollTop(-initialScrollTop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldMapData]);

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
        onTouchStart={handleTouchStart}
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
