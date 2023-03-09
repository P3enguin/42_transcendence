import SideNavBar from "./SideNavBar";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <SideNavBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
