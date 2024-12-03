import { Box, Image } from "@mantine/core";
import { FC } from "react";

import desertImg from "assets/img/desert.png";
import flatImg from "assets/img/flat.png";
import forestImg from "assets/img/forest.png";
import lakeImg from "assets/img/lake.png";
import mountainImg from "assets/img/mountain.png";
import { TileType, WorldMap } from "db";

import classes from "./tile.module.scss";

interface TileProps {
  tile: WorldMap;
}

const Tile: FC<TileProps> = (props) => {
  const { tile } = props;

  const getImageSrc = () => {
    switch (tile.tileType) {
      case TileType.Flat:
        return flatImg;
      case TileType.Lake:
        return lakeImg;
      case TileType.Mountain:
        return mountainImg;
      case TileType.Forest:
        return forestImg;
      case TileType.Desert:
        return desertImg;
      default:
        return "";
    }
  };

  return (
    <Box className={classes.tile}>
      {/* {tile.x}, {tile.y} */}
      <Image src={getImageSrc()} alt={`Tile ${tile.x}, ${tile.y}`} draggable={false} />
    </Box>
  );
};

export { Tile };
