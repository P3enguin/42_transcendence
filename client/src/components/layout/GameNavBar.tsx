import Image from "next/image";
import Link from "next/link";

import { SideBarIcon, LogoutIcon, SearchBarIcon } from "../icons/Icons";

interface FunctionProps {
  toggleSideBar: () => void;
  handleLogOut: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function GameNavBar({ toggleSideBar, handleLogOut }: FunctionProps) {
  return (
    <div
      className="  w-full h-16 z-0 bg-gradient-to-r border  border-[#0097E2] rounded-tr-3xl rounded-bl-3xl
    from-[#28346C] via-[#121C46] to-[#263268] flex flex-row items-center sm:justify-center justify-between"
    >
      <div className="flex flex-row gap-10 items-center">
        <a className="ml-3 mt-1 sm:hidden flex" href="#">
          <Image src="/logo.svg" alt="logo" width={39} height={41} />
        </a>
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
  );
}

export default GameNavBar;
