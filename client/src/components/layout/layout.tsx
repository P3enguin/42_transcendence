import SideNavBar from "./SideNavBar";

import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <SideNavBar children={children}/>
      {/* <main>{children}</main> */}
    </>
  );
};



export default Layout;
