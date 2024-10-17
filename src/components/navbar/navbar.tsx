import { Box, Card, Group, Text } from "@mantine/core";
import { abbreviateNumber } from "js-abbreviation-number";
import { FC } from "react";

import { NavbarSelect } from "components";
import { useGlobalState, useSelectedCity } from "hooks";
import { goldEmoji, resourceEmojiMap, ResourceType } from "utils/global-state";

import classes from "./navbar.module.scss";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { globalState } = useGlobalState();
  const { selectedCity } = useSelectedCity();

  return (
    <Box className={classes.navbar}>
      <Box className={classes.navbarEnd}>
        <Group>
          <Card padding="xs">
            <Group gap="xs">
              <Text>{goldEmoji}</Text>
              <Text>{abbreviateNumber(globalState.player.gold, 1, { padding: false })}</Text>
            </Group>
          </Card>
          <Card padding="xs">
            <Group>
              {Object.entries(selectedCity.resources).map(([resource, amount], index) => {
                return (
                  <Group key={index} gap="xs">
                    <Text>{resourceEmojiMap[resource as ResourceType]}</Text>
                    <Text>{abbreviateNumber(amount, 1, { padding: false })}</Text>
                  </Group>
                );
              })}
            </Group>
          </Card>
          <NavbarSelect />
        </Group>
      </Box>
    </Box>
  );
};

export { Navbar };
