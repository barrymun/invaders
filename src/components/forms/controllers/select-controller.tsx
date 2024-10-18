import { Select, SelectProps } from "@mantine/core";
import { Controller, FieldValues, UseControllerProps, UseFormReturn } from "react-hook-form";

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
    formMethods: { control, watch },
  } = props;

  const value = watch(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <Select label={label} onChange={onChange} value={value} data={data} searchable={searchable} />
      )}
    />
  );
};

export { SelectController };
