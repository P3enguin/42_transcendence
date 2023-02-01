import React, { ReactNode } from 'react';
import NavBar from './NavBar';

interface Props {
    children: ReactNode;
  }
  
function Layout({ children }: Props) {
    return (<div className="content">
        <NavBar />
        {children}
    </div> );
}

export default Layout;