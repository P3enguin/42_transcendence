import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LayoutProps } from './layout';
import { AnimatePresence } from 'framer-motion';
import {
  LogoutIcon,
  HomeIcon,
  ChatIcon,
  GameIcon,
  ProfileIcon,
  ShopIcon,
  SettingsIcon,
} from '../icons/Icons';
import { ReactNode } from 'react';

interface FunctionProps {
  (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

interface FunctionProps2 {
  (): void;
}

function SideBar({
  isVisible,
  svgIndex,
  handleLogOut,
  children,
  isMobile,
  toggleSideBar,
}: {
  isVisible: boolean;
  svgIndex: number;
  handleLogOut: FunctionProps;
  children: ReactNode;
  isMobile: boolean;
  toggleSideBar: FunctionProps2;
}) {
  return (
    <div className="flex h-[calc(100vh-64px)] min-h-0 flex-row ">
      {/* For normal page */}
      <div className="flex h-full flex-col ">
        <motion.aside
          id="userSideBar"
          className={`hidden h-full w-16  flex-col
              items-center  justify-between gap-6 overflow-auto rounded-br-3xl
              border border-t-0 border-[#0097E2] bg-gradient-to-t from-[#141E4A] to-[#28346C] scrollbar-hide sm:flex`}
        >
          <div className="flex h-auto flex-col items-center justify-around gap-10">
            <Link
              className="mt-2 flex h-12 w-12 items-center justify-center "
              href="/home"
              shallow
            >
              <HomeIcon svgIndex={svgIndex} />
            </Link>

            <Link
              className="mt-2 flex h-12 w-12 items-center justify-center "
              href="/chat"
              shallow
            >
              <ChatIcon svgIndex={svgIndex} />
            </Link>

            <Link
              className="mt-2 flex h-12 w-12 items-center justify-center "
              href="/game"
              shallow
            >
              <GameIcon svgIndex={svgIndex} />
            </Link>

            <Link
              className="mt-2 flex h-12 w-12 items-center justify-center "
              href="/profile"
              shallow
            >
              <ProfileIcon svgIndex={svgIndex} />
            </Link>

            <Link
              className="mt-2 flex h-12 w-12 items-center justify-center"
              href="/shop"
              shallow
            >
              <ShopIcon svgIndex={svgIndex} />
            </Link>
          </div>

          <div className="ml-1 mt-10 flex flex-col items-center gap-10">
            <div className="flex">
              <button onClick={handleLogOut}>
                <LogoutIcon />
              </button>
            </div>
            <div className="mb-3 ">
              <Link
                className="mt-2 flex h-12 w-12 items-center justify-center"
                href="/settings"
                shallow
              >
                <SettingsIcon svgIndex={svgIndex} />
              </Link>
            </div>
          </div>
        </motion.aside>
      </div>
      {/* For Mobile Pages */}
      <AnimatePresence>
        {isVisible && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'Tween' }}
            id="userSideBar"
            className={` absolute z-20 flex  h-[calc(100vh-64px)] w-16
              flex-col items-center justify-between gap-6 overflow-auto
              rounded-bl-3xl border border-t-0 border-[#0097E2] bg-gradient-to-t  from-[#141E4A] to-[#28346C] scrollbar-hide sm:hidden`}
          >
            <div className="flex h-auto flex-col items-center justify-around gap-10">
              <Link
                className="mt-2 flex h-12 w-12 items-center justify-center"
                href="/home"
                shallow
              >
                <HomeIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="mt-2 flex h-12 w-12 items-center justify-center"
                href="/chat"
                shallow
              >
                <ChatIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="mt-2 flex h-12 w-12 items-center justify-center"
                href="/game"
                shallow
              >
                <GameIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="mt-2 flex h-12 w-12 items-center justify-center"
                href="/profile"
                shallow
              >
                <ProfileIcon svgIndex={svgIndex} />
              </Link>
            </div>

            <div className="ml-1 mt-10 flex flex-col items-center gap-10">
              <button onClick={handleLogOut}>
                <LogoutIcon />
              </button>
              <div className="mb-3">
                <Link
                  className="mt-2 flex h-12 w-12 items-center justify-center"
                  href="/settings"
                  shallow
                >
                  <SettingsIcon svgIndex={svgIndex} />
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <div
        className={`${
          isMobile && isVisible
            ? 'absolute flex h-[calc(100%-64px)] w-full'
            : 'hidden'
        } z-10`}
        onClick={toggleSideBar}
      ></div>
      <motion.div
        animate={{
          opacity: isMobile && isVisible ? 0.1 : 1,
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="flex h-full w-full justify-center overflow-scroll scrollbar-hide"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default SideBar;
