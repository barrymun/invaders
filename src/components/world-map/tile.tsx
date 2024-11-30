import { Box, Image } from "@mantine/core";
import { FC } from "react";

import mountain from "assets/img/mountain.png";
import { WorldMap } from "db";

import classes from "./tile.module.scss";

interface TileProps {
  tile: WorldMap;
}

const Tile: FC<TileProps> = (props) => {
  const { tile } = props;

  const getImageSrc = () => {
    if (tile.tileType === "mountain") {
      return mountain;
    }
    return "";
  };

  return (
    <Box className={classes.tile}>
      {/* {tile.x}, {tile.y} */}
      <Image src={getImageSrc()} alt={`Tile ${tile.x}, ${tile.y}`} draggable={false} />
    </Box>
  );
};

export { Tile };
