import { Box, Button, Table } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { getDb } from "@db/db";
import { City } from "@db/models";
import { useSelectedCity } from "@hooks/use-selected-city";

const db = getDb();

interface DiningHallProps {}

const DiningHall: FC<DiningHallProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "town.info.modal.diningHall" });

  const { heroes, selectedCity } = useSelectedCity();

  const handleRemoveMayor = async () => {
    await db.cities.update(selectedCity.id, {
      mayorId: null,
    });
  };

  const handleSaveMayor = (mayorId: City["mayorId"]) => async () => {
    await db.cities.update(selectedCity.id, {
      mayorId,
    });
  };

  const tableRows = heroes.map((hero, index) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{hero.name}</Table.Td>
        <Table.Td>{hero.level}</Table.Td>
        <Table.Td>{hero.politics}</Table.Td>
        <Table.Td>{hero.intelligence}</Table.Td>
        <Table.Td>{hero.attack}</Table.Td>
        <Table.Td>
          {selectedCity.mayorId === hero.id ? (
            <Button size="compact-sm" onClick={handleRemoveMayor}>
              {t("remove-mayor")}
            </Button>
          ) : (
            <Button size="compact-sm" onClick={handleSaveMayor(hero.id)}>
              {t("save-mayor")}
            </Button>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("name")}</Table.Th>
            <Table.Th>{t("level")}</Table.Th>
            <Table.Th>{t("politics")}</Table.Th>
            <Table.Th>{t("intelligence")}</Table.Th>
            <Table.Th>{t("attack")}</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{tableRows}</Table.Tbody>
      </Table>
    </Box>
  );
};

export { DiningHall };
