import { Table, Card, Box, Text } from "@mantine/core";
import {
  IconArcheryArrow,
  IconAxe,
  IconBackhoe,
  IconBow,
  IconBulldozer,
  IconHorse,
  IconHorseToy,
  IconPick,
  IconSleigh,
  IconSpy,
  IconSword,
  IconTrident,
} from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useGlobalState } from "hooks";
import { TroopType } from "utils/global-state";

import classes from "./troops.module.scss";

const troopImageMap: Record<TroopType, React.ReactNode> = {
  worker: <IconPick />,
  warrior: <IconAxe />,
  scout: <IconSpy />, // or brand-redhat
  swordsman: <IconSword />,
  pikeman: <IconTrident />,
  archer: <IconBow />,
  cavalry: <IconHorse />,
  cataphract: <IconHorseToy />,
  transporter: <IconSleigh />,
  ram: <IconBulldozer />,
  ballista: <IconArcheryArrow />,
  catapult: <IconBackhoe />,
};

interface TroopsProps {}

const Troops: FC<TroopsProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "troops" });
  const { globalState } = useGlobalState();

  return (
    <Box className={classes.troops}>
      {globalState.cities.map((city, index) => (
        <Box key={index} className={classes.troop}>
          <Card>
            <Box>
              <Text size="lg">{city.name}</Text>
            </Box>
            <Table verticalSpacing="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th />
                  <Table.Th>{t("troop")}</Table.Th>
                  <Table.Th>{t("amount")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(city.troops).map(([troop, amount], index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{troopImageMap[troop as TroopType]}</Table.Td>
                    <Table.Td>{troop}</Table.Td>
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

export { Troops };
