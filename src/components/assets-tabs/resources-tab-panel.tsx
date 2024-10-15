import "./resources-tab-panel.scss";

import { TabPanel } from "@chakra-ui/react";
import { FC } from "react";

import { useGlobalState } from "hooks";

interface ResourcesTabPanelProps {}

const ResourcesTabPanel: FC<ResourcesTabPanelProps> = () => {
  const { globalState } = useGlobalState();

  return (
    <TabPanel>
      {Object.entries(globalState.city.resources).map(([resource, amount]) => (
        <p key={resource}>
          {resource}: {amount}
        </p>
      ))}
    </TabPanel>
  );
};

export { ResourcesTabPanel };
