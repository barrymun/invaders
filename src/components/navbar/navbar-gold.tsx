import { Card, Group, Text } from "@mantine/core";
import { abbreviateNumber } from "js-abbreviation-number";
import { FC } from "react";

import { goldEmoji } from "@db/consts";
import { usePlayer } from "@hooks/use-player";

const NavbarGold: FC = () => {
  const { player } = usePlayer();

  return (
    <Card padding="xs">
      <Group gap="xs">
        <Text>{goldEmoji}</Text>
        <Text>{abbreviateNumber(player.gold, 1, { padding: false })}</Text>
      </Group>
    </Card>
  );
};

export { NavbarGold };
