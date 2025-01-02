import { InputWrapperProps, Input, Box } from "@mantine/core";
import { Controller, FieldValues, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FormError } from "@components/forms/form-error";

interface InputControllerProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<InputWrapperProps, "defaultValue"> {
  formMethods: UseFormReturn<T>;
}

const InputController = <T extends FieldValues>(props: InputControllerProps<T>) => {
  const {
    name,
    label,
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
          <Input.Wrapper label={label}>
            <Input value={value} onChange={onChange} />
          </Input.Wrapper>
          <FormError name={name} errors={errors} />
        </Box>
      )}
    />
  );
};

export { InputController };
