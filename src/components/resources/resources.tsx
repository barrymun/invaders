import { Table, Card, Box, Text } from "@mantine/core";
import { IconDiamond, IconMeat, IconWall, IconWood } from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useGlobalState } from "hooks";
import { ResourceType } from "utils/global-state";

import classes from "./resources.module.scss";

const resourceImageMap: Record<ResourceType, React.ReactNode> = {
  food: <IconMeat />,
  wood: <IconWood />,
  stone: <IconWall />,
  iron: <IconDiamond />,
};

interface ResourcesProps {}

const Resources: FC<ResourcesProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "resources" });
  const { globalState } = useGlobalState();

  return (
    <Box className={classes.resources}>
      {globalState.cities.map((city, index) => (
        <Box key={index} className={classes.resource}>
          <Card>
            <Box>
              <Text size="lg">{city.name}</Text>
            </Box>
            <Table verticalSpacing="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th />
                  <Table.Th>{t("resource")}</Table.Th>
                  <Table.Th>{t("amount")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(city.resources).map(([resource, amount], index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{resourceImageMap[resource as ResourceType]}</Table.Td>
                    <Table.Td>{resource}</Table.Td>
                    <Table.Td>{amount}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export { Resources };
