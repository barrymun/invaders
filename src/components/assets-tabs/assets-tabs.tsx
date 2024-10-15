import "./assets-tabs.scss";

import { Tabs, TabList, TabPanels, Tab, Card, CardBody } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { ResourcesTabPanel } from "./resources-tab-panel";

interface AssetsTabsProps {}

const AssetsTabs: FC<AssetsTabsProps> = () => {
  const { t } = useTranslation();

  return (
    <div className="assets-tabs">
      <Card>
        <CardBody>
          <Tabs variant="soft-rounded">
            <TabList>
              <Tab>{t("assets-tabs.resources.title")}</Tab>
            </TabList>

            <TabPanels>
              <ResourcesTabPanel />
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export { AssetsTabs };
