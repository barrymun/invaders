import { Card, Group, Text } from "@mantine/core";
import { abbreviateNumber } from "js-abbreviation-number";
import { FC } from "react";

import { resourceEmojiMap } from "@db/consts";
import { ResourceType } from "@db/types";
import { useSelectedCity } from "@hooks/use-selected-city";

const NavbarResources: FC = () => {
  const { selectedCity } = useSelectedCity();

  return (
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
  );
};

export { NavbarResources };
