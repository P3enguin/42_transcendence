import SideNavBar from "./SideNavBar";

import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <SideNavBar children={children}/>
    </>
  );
};



export default Layout;
