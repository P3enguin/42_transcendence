import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import {
  LogoutIcon,
  HomeIcon,
  ChatIcon,
  GameIcon,
  ProfileIcon,
  SettingsIcon,
} from "../icons/Icons";

function SideBar({
  isVisible,
  svgIndex,
}: {
  isVisible: boolean;
  svgIndex: number;
}) {
  const variants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <motion.nav
      animate={isVisible ? "open" : "closed"}
      variants={variants}
      exit={{ opacity: 0 }}
    >
      <div
        id="userSideBar"
        className={`absolute top-0 sm:top-10 z-10  flex-col items-center w-16 h-5/6 overflow-hidden
            border rounded-tr-3xl rounded-bl-3xl border-[#0097E2] bg-gradient-to-t from-[#141E4A]
            to-[#28346C] gap-6  ${isVisible ? "flex" : "hidden"}`}
      >
        <a className="flex items-center justify-center mt-3" href="#">
          <Image src="/logo.png" alt="logo" width={39} height={41} />
        </a>
        <div
          className=" border-b  border-t-0 border-r-0 border-l  rounded-bl-3xl
                border-[#0097E2]  w-16 h-[20px] absolute top-[43px]"
        ></div>
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
            <LogoutIcon />
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
    </motion.nav>
  );
}

export default SideBar;
