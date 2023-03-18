import { AnimatePresence, LazyMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SideBarIcon, LogoutIcon, SearchBarIcon } from "../icons/Icons";

interface FunctionProps {
  toggleSideBar: () => void;
  handleLogOut: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isVisible: boolean;
}
function GameNavBar({ toggleSideBar, handleLogOut, isVisible }: FunctionProps) {
  return (
    <div className="flex flex-row w-full  ">
      <div
        className="w-[64px] shrink-0 z-0 bg-[#2A3568]
                  border-b-0 border-t sm:border-l border-[#0097E2] 
                    justify-center items-center  rounded-bl-3xl sm:rounded-none flex"
      >
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "Tween" }}
              className="absolute flex justify-center  items-center top-0 left-0
            bg-[#2A3568] border w-[64px] h-[64px] border-[#0097E2] 
              border-b-0  border-r-1  rounded-tr-3xl sm:hidden"
            ></motion.div>
          )}
        </AnimatePresence>
      </div>
      <div
        className="absolute flex justify-center  items-center top-0 left-0
            bg-[#2A3568] border w-[64px] h-[64px] border-[#0097E2] 
              rounded-tr-3xl rounded-bl-3xl"
      >
        <Link className="" href="/home">
          <Image
            className=""
            src="/logo.svg"
            alt="logo"
            width={39}
            height={41}
          />
        </Link>
      </div>
      <div
        className="w-full h-16 z-0 bg-gradient-to-r border  border-[#0097E2] 
      from-[#28346C] via-[#121C46] to-[#263268] flex flex-row items-center
           border-l-0 sm:justify-center justify-between rounded-br-3xl"
      >
        <div className="flex flex-row items-center ml-4">
          <button
            type="button"
            className="text-[#8BD9FF] rounded-lg sm:hidden"
            onClick={toggleSideBar}
          >
            <SideBarIcon />
          </button>
        </div>
        <form className="w-1/2 sm:w-1/4 flex flex-row items-center justify-center ">
          <input
            type="search"
            id="search-bar"
            placeholder="search here for players,channels... "
            className="bg-[#2F3C78] rounded-xl border-none w-full text-sm text-white overflow-hidden truncate "
          ></input>
          <label htmlFor="search-bar " className="relative right-7 top-1">
            <button type="submit">
              <SearchBarIcon />
            </button>
          </label>
        </form>
        <div className="absolute hidden sm:flex right-12">
          <button onClick={handleLogOut}>
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameNavBar;
