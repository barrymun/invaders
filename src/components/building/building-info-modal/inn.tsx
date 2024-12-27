import { Box, Button, Table } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";
import { FC, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { canRecruitHero, generateRandomHeroes, getDb, Hero, recruitHero } from "db";
import { usePlayer, useSelectedCity } from "hooks";

const db = getDb();

interface InnProps {}

const Inn: FC<InnProps> = () => {
  const { t } = useTranslation("translation", { keyPrefix: "town.info.modal.inn" });

  const { player } = usePlayer();
  const { heroes, selectedCity, townBuildings } = useSelectedCity();

  const hireableHeroes = useLiveQuery(() => db.hireableHeroes.toArray()) ?? [];

  const canRecruit = useMemo(() => canRecruitHero({ townBuildings, heroes }), [townBuildings, heroes]);

  const handleRecruitment = (hireableHero: Hero) => async () => {
    await recruitHero({ townBuildings, heroes, hireableHero, playerId: player.id, cityId: selectedCity.id });
  };

  const tableRows = hireableHeroes.map((hero, index) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{hero.name}</Table.Td>
        <Table.Td>{hero.level}</Table.Td>
        <Table.Td>{hero.politics}</Table.Td>
        <Table.Td>{hero.intelligence}</Table.Td>
        <Table.Td>{hero.attack}</Table.Td>
        <Table.Td>
          <Button size="compact-sm" variant="outline" disabled={!canRecruit} onClick={handleRecruitment(hero)}>
            {t("recruit")}
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  useEffect(() => {
    generateRandomHeroes({
      inn: townBuildings.find((b) => b.type === "inn"),
      playerId: player.id,
      cityId: selectedCity.id,
    });
  }, [townBuildings, player, selectedCity]);

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

export { Inn };
