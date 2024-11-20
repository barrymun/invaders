import { Box } from "@mantine/core";
import { FC } from "react";

import { WorldMap } from "db";

import classes from "./tile.module.scss";

interface TileProps {
  tile: WorldMap;
}

const Tile: FC<TileProps> = (props) => {
  const { tile } = props;

  return (
    <Box className={classes.tile}>
      {tile.x}, {tile.y}
    </Box>
  );
};

export { Tile };
