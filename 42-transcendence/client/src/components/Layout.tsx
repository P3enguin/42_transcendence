import React, { ReactNode } from 'react';
import NavBar from './NavBar';
import { motion } from 'framer-motion';
interface Props {
    children: ReactNode;
  }
  
function NavBarLayout({ children }: Props) {
    return (<div className="content">
        <NavBar />
        {children}
    </div> );
}

export default NavBarLayout;