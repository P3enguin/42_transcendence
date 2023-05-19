import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SideBar from './SideBar';
import GameNavBar from './GameNavBar';
import NavBar from '../home/NavBar';
import React from 'react';
import Router from 'next/router';
import { LayoutProps } from './layout';
import { Socket, io } from 'socket.io-client';
import { verifyToken } from '../VerifyToken';

import NextApiRequest from 'next';
import GameInvitation from './GameInvitation';
let socket: Socket;

function SideNavBar({ children }: LayoutProps) {
  const [svgIndex, setSvgIndex] = useState(5);
  const [isVisible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pages = [
    { path: '/home', index: 0 },
    { path: '/chat', index: 1 },
    { path: '/chat/[id]', index: 1 },
    { path: '/game', index: 2 },
    { path: '/game/[id]', index: 2 },
    { path: '/game/ai', index: 2 },
    { path: '/profile', index: 3 },
    { path: '/users/[id]', index: 3 },
    { path: '/shop', index: 4 },
    { path: '/settings', index: 5 },
  ];

  const router = useRouter();

  function toggleSideBar() {
    setVisible(!isVisible);
  }

  useEffect(() => {
    if (React.isValidElement(children)) {
      socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/`, {
        auth: {
          token: children.props.jwt_token,
        },
      });
    }
    const handleVisibilityChange = () => {
      if (document.hidden) {
        socket.emit('away', {});
      } else {
        socket.emit('online', {});
      }
    };
    socket.on('connected', (data) => {
      handleVisibilityChange();
      console.log('connected');

      document.addEventListener('visibilitychange', handleVisibilityChange);
    });

    return () => {
      socket.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // socket emmit everytime route cahnges
  useEffect(() => {
    if (socket) {
      if (router.pathname === '/game/[id]' || router.pathname === '/game/ai') {
        socket.emit('inGame', {});
      } else {
        socket.emit('online', {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, socket]);

  // to fix later
  useEffect(() => {
    const hanldeResize = () => {
      if (window.innerWidth <= 640 && !isMobile) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setVisible(false);
      }
    };

    window.addEventListener('resize', hanldeResize);
    hanldeResize();
    return () => window.removeEventListener('resize', hanldeResize);
  }, []);

  // Handle the color of the icon based on the page we are in
  useEffect(() => {
    pages.forEach((page) => {
      if (page.path == router.pathname) setSvgIndex(page.index);
    });
  }, [router.pathname,pages]);

  async function handleLogOut(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();

    const url = process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/logout';
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (resp.status === 201) Router.push('/');
  }

  return (
    <div className="relative h-full w-full ">
      {/* navbar */}
      <GameNavBar
        toggleSideBar={toggleSideBar}
        handleLogOut={handleLogOut}
        isVisible={isVisible}
      />

      {/* SideBar */}
      <SideBar
        isVisible={isVisible}
        svgIndex={svgIndex}
        handleLogOut={handleLogOut}
        isMobile={isMobile}
        toggleSideBar={toggleSideBar}
      >
        {/* pass the socket to children */}
        {React.Children.map(children, (child) => {
          return React.cloneElement(child as React.ReactElement, {
            ws: socket,
          });
        })}
      </SideBar>
      <GameInvitation ws={socket} />
    </div>
  );
}

export default SideNavBar;
