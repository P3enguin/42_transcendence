import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LayoutProps } from "./layout";
import { AnimatePresence } from "framer-motion";
import {
  LogoutIcon,
  HomeIcon,
  ChatIcon,
  GameIcon,
  ProfileIcon,
  SettingsIcon,
} from "../icons/Icons";
import { ReactNode } from "react";

interface FunctionProps {
 (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) : void;
}

interface FunctionProps2 {
  () : void;
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
  isMobile: boolean,
  toggleSideBar : FunctionProps2,
}) {
  
  return (
    <div className="flex h-[calc(100%-64px)] flex-row">
      {/* For normal page */}
      <motion.aside
        id="userSideBar"
        className={` hidden h-full w-16 shrink-0 flex-col
              items-center  justify-between gap-6 rounded-br-3xl border
              border-t-0 border-[#0097E2] bg-gradient-to-t from-[#141E4A] to-[#28346C] sm:flex min-h-[900px]`}
      >
        <div className="flex h-1/3 flex-col items-center justify-around">
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
        </div>

        <div className="flex flex-col items-center gap-10">
          <div className="flex sm:hidden">
            <button onClick={handleLogOut}>/wallpaper.png
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
      {/* For Mobile Pages */}
      <AnimatePresence>
        {isVisible  && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'Tween' }}
            id="userSideBar"
            className={` flex-col items-center w-16 h-[calc(100%-64px)]  justify-between
              border  rounded-bl-3xl border-[#0097E2] bg-gradient-to-t from-[#141E4A]
              to-[#28346C] gap-6 border-t-0 sm:hidden flex shrink-0 absolute z-20 min-h-[700px] `}
            // className={` flex h-full w-16 shrink-0 flex-col
            //   items-center  justify-between gap-6 rounded-bl-3xl border
            //   border-t-0 border-[#0097E2] bg-gradient-to-t from-[#141E4A] to-[#28346C] sm:hidden`}
          >
            <div className="flex h-1/3 flex-col items-center justify-around">
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
            </div>

            <div className="flex flex-col items-center gap-10">
              <div className="flex sm:hidden">
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
        )}
      </AnimatePresence>
      <div className={`${isMobile && isVisible ? "flex h-full w-full absolute": "hidden"} z-10`} 
            onClick={toggleSideBar} >
            </div>
      <motion.div
        animate={{
          opacity: (isMobile && isVisible) ? 0.1 : 1,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="w-full flex justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default SideBar;
