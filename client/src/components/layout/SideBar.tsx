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
    <div className="flex h-[calc(100%-64px)] flex-row">
      {/* For normal page */}
      <motion.aside
        id="userSideBar"
        className={` hidden h-full w-16 shrink-0 flex-col
              items-center  justify-between gap-6 rounded-br-3xl border
              border-t-0 border-[#0097E2] bg-gradient-to-t from-[#141E4A] to-[#28346C] sm:flex`}
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
      {/* For Mobile Pages */}
      <AnimatePresence>
        {isVisible && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'Tween' }}
            id="userSideBar"
            className={` flex h-full w-16 shrink-0 flex-col
              items-center  justify-between gap-6 rounded-bl-3xl border
              border-t-0 border-[#0097E2] bg-gradient-to-t from-[#141E4A] to-[#28346C] sm:hidden`}
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
      <div className="w-full flex justify-center">{children}</div>
    </div>
  );
}

export default SideBar;
