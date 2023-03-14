import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LayoutProps } from "./layout";

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
  children:ReactNode
}) {
  const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <div className="flex flex-row  h-full">
      <div
        id="userSideBar"
        className={`flex-col items-center w-16 h-full
            border  rounded-bl-3xl border-[#0097E2] bg-gradient-to-t from-[#141E4A]
            to-[#28346C] gap-6 border-t-0 ${isVisible ? "flex" : "hidden"}`}
      >
        <Link
          className="flex items-center justify-center w-12 h-12 mt-2 rounded"
          href="/home"
        >
          <HomeIcon svgIndex={svgIndex} />
        </Link>

        <Link
          className="flex items-center justify-center w-12 h-12 mt-2 rounded "
          href="/chat"
        >
          <ChatIcon svgIndex={svgIndex} />
        </Link>

        <Link
          className="flex items-center justify-center w-12 h-12 mt-2 rounded  "
          href="/game"
        >
          <GameIcon svgIndex={svgIndex} />
        </Link>

        <Link
          className="flex items-center justify-center w-12 h-12 mt-2 rounded  "
          href="/profile"
        >
          <ProfileIcon svgIndex={svgIndex} />
        </Link>

        <div className="flex flex-col absolute bottom-0 items-center gap-7">
          <div className="flex sm:hidden">
            <button onClick={handleLogOut}>
              <LogoutIcon />
            </button>
          </div>
          <div className=" mb-3 ">
            <Link
              className="flex items-center justify-center w-12 h-12 mt-2 "
              href="/settings"
            >
              <SettingsIcon svgIndex={svgIndex} />
            </Link>
          </div>
        </div>
      </div>
     <div>{children}</div>
    </div>
  );
}

export default SideBar;
