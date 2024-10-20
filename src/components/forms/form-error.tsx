import { ErrorMessage, FieldValuesFromFieldErrors } from "@hookform/error-message";
import { Text } from "@mantine/core";
import { FieldErrors, FieldName, FieldValues, Path } from "react-hook-form";

interface FormErrorProps<T> {
  name: Path<T>;
  errors: FieldErrors;
}

const FormError = <T extends FieldValues>({ name, errors }: FormErrorProps<T>) => {
  return (
    <ErrorMessage
      errors={errors}
      name={name as unknown as FieldName<FieldValuesFromFieldErrors<FieldErrors<T>>>}
      render={({ message }) => (
        <Text component="span" c="red">
          {message}
        </Text>
      )}
    />
  );
};

export { FormError };
