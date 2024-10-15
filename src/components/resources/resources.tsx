import { Table, Card, Box, Text } from "@mantine/core";
import { IconDiamond, IconMeat, IconWall, IconWood } from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useGlobalState } from "hooks";

import classes from "./resources.module.scss";

const resourceImageMap: Record<string, React.ReactNode> = {
  food: <IconMeat />,
  wood: <IconWood />,
  stone: <IconWall />,
  iron: <IconDiamond />,
};

interface ResourcesProps {}

const Resources: FC<ResourcesProps> = () => {
  const { t } = useTranslation();
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
                  <Table.Th>{t("resources.resource")}</Table.Th>
                  <Table.Th>{t("resources.amount")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(city.resources).map(([resource, amount]) => (
                  <Table.Tr key={resource}>
                    <Table.Td>{resourceImageMap[resource]}</Table.Td>
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
