import { Box } from "@mantine/core";
import { FC } from "react";

import { useGlobalState } from "hooks";

interface ResourcesProps {}

export const Resources: FC<ResourcesProps> = () => {
  const { globalState } = useGlobalState();

  return (
    <Box>
      {Object.entries(globalState.city.resources).map(([resource, amount]) => (
        <p key={resource}>
          {resource}: {amount}
        </p>
      ))}
    </Box>
  );
};
