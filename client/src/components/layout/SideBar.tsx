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
  (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

function SideBar({
  isVisible,
  svgIndex,
  handleLogOut,
  children,
}: {
  isVisible: boolean;
  svgIndex: number;
  handleLogOut: FunctionProps;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-row h-[95%]">
      {/* For normal page */}
      <motion.aside
        id="userSideBar"
        className={` flex-col items-center w-16 h-full justify-between
              border  rounded-br-3xl border-[#0097E2] bg-gradient-to-t from-[#141E4A]
              to-[#28346C] gap-6 border-t-0 sm:flex hidden shrink-0`}
      >
        <div className="flex-col items-center flex h-1/3 justify-around">
          <Link
            className="flex items-center justify-center w-12 h-12 mt-2 "
            href="/home"
            shallow
          >
            <HomeIcon svgIndex={svgIndex} />
          </Link>

          <Link
            className="flex items-center justify-center w-12 h-12 mt-2  "
            href="/chat"
            shallow
          >
            <ChatIcon svgIndex={svgIndex} />
          </Link>

          <Link
            className="flex items-center justify-center w-12 h-12 mt-2   "
            href="/game"
            shallow
          >
            <GameIcon svgIndex={svgIndex} />
          </Link>

          <Link
            className="flex items-center justify-center w-12 h-12 mt-2   "
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
              className="flex items-center justify-center w-12 h-12 mt-2"
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
        {isVisible && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "Tween" }}
            id="userSideBar"
            className={` flex-col items-center w-16 h-full justify-between
              border  rounded-bl-3xl border-[#0097E2] bg-gradient-to-t from-[#141E4A]
              to-[#28346C] gap-6 border-t-0 sm:hidden flex shrink-0 absolute z-10`}
          >
            <div className="flex-col items-center flex h-1/3 justify-around">
              <Link
                className="flex items-center justify-center w-12 h-12 mt-2 "
                href="/home"
                shallow
              >
                <HomeIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="flex items-center justify-center w-12 h-12 mt-2  "
                href="/chat"
                shallow
              >
                <ChatIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="flex items-center justify-center w-12 h-12 mt-2   "
                href="/game"
                shallow
              >
                <GameIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="flex items-center justify-center w-12 h-12 mt-2   "
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
                  className="flex items-center justify-center w-12 h-12 mt-2"
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
      <motion.div
        animate={{
          opacity: isVisible ? 0.1 : 1,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default SideBar;
