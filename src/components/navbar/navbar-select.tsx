import { Box, CheckIcon, Combobox, Group, Input, InputBase, Text, useCombobox } from "@mantine/core";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useGlobalState, useSelectedCity } from "hooks";

import classes from "./navbar-select.module.scss";

interface Item {
  label: string;
}

function SelectOption({ label }: Item) {
  return (
    <Box component="span">
      <Text>{label}</Text>
    </Box>
  );
}

interface NavbarSelectProps {}

const NavbarSelect: FC<NavbarSelectProps> = () => {
  const { t } = useTranslation();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const { globalState } = useGlobalState();
  const { selectedCity, selectedCityIndex, handleSetSelectedCity } = useSelectedCity();

  const selectedOption = useMemo(() => ({ label: selectedCity.name }), [selectedCity]);

  const options = useMemo(
    () =>
      globalState.cities.map((city, index) => (
        <Combobox.Option key={index} value={index.toString()} active={index === selectedCityIndex}>
          <Group gap="xs">
            {index === selectedCityIndex && <CheckIcon size={12} />}
            <SelectOption {...{ label: city.name }} />
          </Group>
        </Combobox.Option>
      )),
    [globalState.cities, selectedCityIndex]
  );

  const handleChange = (value: number) => {
    handleSetSelectedCity(value);
  };

  return (
    <Box className={classes.navbarSelect}>
      <Combobox
        store={combobox}
        withinPortal={false}
        onOptionSubmit={(val, _option) => {
          handleChange(parseInt(val, 10));
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
            multiline
          >
            {selectedOption ? (
              <SelectOption {...selectedOption} />
            ) : (
              <Input.Placeholder>{t("navbar.citySelect.placeholder")}</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
};

export { NavbarSelect };
