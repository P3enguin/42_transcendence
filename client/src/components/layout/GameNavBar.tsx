import { AnimatePresence, LazyMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SideBarIcon, LogoutIcon, SearchBarIcon,NotificationIcon } from '../icons/Icons';
import { useRouter } from 'next/router';

interface FunctionProps {
  toggleSideBar: () => void;
  handleLogOut: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isVisible: boolean;
}

function GameNavBar({ toggleSideBar, handleLogOut, isVisible }: FunctionProps) {
  const [notif,setNotif] = useState(false);
  const router = useRouter();

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const data = (document.getElementById('search-bar') as HTMLInputElement)
      .value;
    if (data) {
      router.push({ pathname: '/search', query: { search: data } }, '/search');
    }
  }

  return (
    <div className="flex w-full flex-row ">
      <div
        className="z-0 flex w-[64px] shrink-0
                  items-center justify-center rounded-bl-3xl border-b-0 
                    border-t border-[#0097E2]  bg-[#2A3568] sm:rounded-none sm:border-l"
      >
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'Tween' }}
              className="border-r-1 absolute top-0  left-0 flex h-[64px]
            w-[64px] items-center justify-center rounded-tr-3xl border 
              border-b-0  border-[#0097E2]  bg-[#2A3568] sm:hidden"
            ></motion.div>
          )}
        </AnimatePresence>
      </div>
      <div
        className="absolute top-0 left-0  flex h-[64px] w-[64px]
            items-center justify-center rounded-tr-3xl rounded-bl-3xl border 
              border-[#0097E2] bg-[#2A3568]"
      >
        <Link className="" href="/home">
          <img className="" src="/logo.svg" alt="logo" width={39} height={41} />
        </Link>
      </div>
      <div
        className="z-0 flex h-16 w-full flex-row  items-center 
      justify-between rounded-br-3xl border border-l-0 border-[#0097E2] bg-gradient-to-r
           from-[#28346C] via-[#121C46] to-[#263268] sm:justify-center"
      >
        <div className="ml-4 flex flex-row items-center">
          <button
            type="button"
            className="rounded-lg text-[#8BD9FF] sm:hidden"
            onClick={toggleSideBar}
          >
            <SideBarIcon />
          </button>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex sm:w-1/3  w-1/2 flex-row items-center justify-center lg:w-1/4 "
        >
          <input
            type="search"
            id="search-bar"
            placeholder="search here for players,channels..."
            className="w-full overflow-hidden truncate rounded-xl border-none bg-[#2F3C78] text-sm text-white "
          ></input>
          <label htmlFor="search-bar" className="relative right-7 top-1">
            <button type="submit">
              <SearchBarIcon />
            </button>
          </label>
        </form>
        <div className="sm:absolute relative right-12 flex">
          <button onClick={() => setNotif(!notif)}>
            <NotificationIcon/>
          </button>
        </div>
      </div>
    {notif && <div x-show="dropdownOpen" className="absolute top-[56px] right-12 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50 w-[20rem]" >
          <div className="py-2">
              <a href="#" className="flex items-center px-4 py-3 border-b hover:bg-[#8fd4f6] -mx-2">
                  <img className="h-8 w-8 rounded-full object-cover mx-1" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" alt="avatar"/>
                  <p className="text-[#2F3C78] text-sm mx-2">
                      <span className="font-bold">Sara Salah</span> replied on the <span className="font-bold text-blue-500" >Upload Image</span> artical . 2m
                  </p>
              </a>
              <a href="#" className="flex items-center px-4 py-3 border-b hover:bg-[#8fd4f6] -mx-2">
                  <img className="h-8 w-8 rounded-full object-cover mx-1" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" alt="avatar"/>
                  <p className="text-[#2F3C78] text-sm mx-2">
                      <span className="font-bold">Slick Net</span> start following you . 45m
                  </p>
              </a>
              <a href="#" className="flex items-center px-4 py-3 border-b hover:bg-[#8fd4f6] -mx-2">
                  <img className="h-8 w-8 rounded-full object-cover mx-1" src="https://images.unsplash.com/photo-1450297350677-623de575f31c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" alt="avatar"/>
                  <p className="text-[#2F3C78] text-sm mx-2">
                      <span className="font-bold" >Jane Doe</span> Like Your reply on <span className="font-bold text-blue-500" >Test with TDD</span> artical . 1h
                  </p>
              </a>
              <a href="#" className="flex items-center px-4 py-3 hover:bg-[#8fd4f6] -mx-2">
                  <img className="h-8 w-8 rounded-full object-cover mx-1" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=398&q=80" alt="avatar"/>
                  <p className="text-[#2F3C78] text-sm mx-2">
                      <span className="font-bold" >Abigail Bennett</span> start following you . 3h
                  </p>
              </a>
          </div>
          <a href="#" className="block bg-gray-800 text-white text-center font-bold py-2">See all notifications</a>
      </div>}
    </div>
  );
}

export default GameNavBar;
