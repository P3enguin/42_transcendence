import SideNavBar from "./SideNavBar";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  jwt_token: string
}

const Layout = ({ children,jwt_token }: LayoutProps) => {
  return (
    <>
      <SideNavBar jwt_token={jwt_token} />
      <main>{children}</main>
    </>
  );
};



export default Layout;
