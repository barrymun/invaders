import "./layout.scss";

import { FC } from "react";
import { Outlet } from "react-router-dom";

import { AssetsTabs } from "components";

interface LayoutProps {}

export const Layout: FC<LayoutProps> = () => {
  return (
    <>
      <AssetsTabs />
      <Outlet />
    </>
  );
};
