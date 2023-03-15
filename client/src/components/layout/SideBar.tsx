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
    <AnimatePresence>
      <div className="flex flex-row h-[95%]">
        <motion.aside
          id="userSideBar"
          className={` flex-col items-center w-16 h-full justify-between
              border  rounded-bl-3xl border-[#0097E2] bg-gradient-to-t from-[#141E4A]
              to-[#28346C] gap-6 border-t-0 sm:flex hidden`}
        >
          <div className="flex-col items-center flex h-1/3 justify-around">
            <Link
              className="flex items-center justify-center w-12 h-12 mt-2 "
              href="/home"
            >
              <HomeIcon svgIndex={svgIndex} />
            </Link>

            <Link
              className="flex items-center justify-center w-12 h-12 mt-2  "
              href="/chat"
            >
              <ChatIcon svgIndex={svgIndex} />
            </Link>

            <Link
              className="flex items-center justify-center w-12 h-12 mt-2   "
              href="/game"
            >
              <GameIcon svgIndex={svgIndex} />
            </Link>

            <Link
              className="flex items-center justify-center w-12 h-12 mt-2   "
              href="/profile"
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
              >
                <SettingsIcon svgIndex={svgIndex} />
              </Link>
            </div>
          </div>
        </motion.aside>
        {isVisible && (
          <motion.aside
          initial={{x:"-100%"}}
          animate={{x:0}}
          exit={{x:"-100%"}}
            id="userSideBar"
            className={` flex-col items-center w-16 h-full justify-between
              border  rounded-bl-3xl border-[#0097E2] bg-gradient-to-t from-[#141E4A]
              to-[#28346C] gap-6 border-t-0 sm:hidden flex`}
          >
            <div className="flex-col items-center flex h-1/3 justify-around">
              <Link
                className="flex items-center justify-center w-12 h-12 mt-2 "
                href="/home"
              >
                <HomeIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="flex items-center justify-center w-12 h-12 mt-2  "
                href="/chat"
              >
                <ChatIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="flex items-center justify-center w-12 h-12 mt-2   "
                href="/game"
              >
                <GameIcon svgIndex={svgIndex} />
              </Link>

              <Link
                className="flex items-center justify-center w-12 h-12 mt-2   "
                href="/profile"
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
                >
                  <SettingsIcon svgIndex={svgIndex} />
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
        <motion.div>{children}</motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SideBar;
