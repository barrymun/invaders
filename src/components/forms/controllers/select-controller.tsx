import { Box, Select, SelectProps } from "@mantine/core";
import { Controller, FieldValues, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FormError } from "components";

interface SelectControllerProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<SelectProps, "name" | "defaultValue"> {
  formMethods: UseFormReturn<T>;
}

const SelectController = <T extends FieldValues>(props: SelectControllerProps<T>) => {
  const {
    name,
    data,
    label,
    searchable,
    formMethods: {
      control,
      watch,
      formState: { errors },
    },
  } = props;

  const value = watch(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <Box>
          <Select
            label={label}
            onChange={(value) => {
              if (value === "") {
                onChange(null);
              } else {
                onChange(value);
              }
            }}
            value={value}
            data={data}
            searchable={searchable}
          />
          <FormError name={name} errors={errors} />
        </Box>
      )}
    />
  );
};

export { SelectController };
