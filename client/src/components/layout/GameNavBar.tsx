import { AnimatePresence, LazyMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SideBarIcon, SearchBarIcon, NotificationIcon } from '../icons/Icons';
import { NotiDrop } from './Notification';
import { useRouter } from 'next/router';
import { RefObject } from 'react';

interface FunctionProps {
  toggleSideBar: () => void;
  handleLogOut: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isVisible: boolean;
}

function GameNavBar({ toggleSideBar, handleLogOut, isVisible }: FunctionProps) {
  const [notif, setNotif] = useState(false);
  const router = useRouter();
  const notificationRef = useRef<HTMLDivElement>(null); // Add the useRef hook

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const data = (document.getElementById('search-bar') as HTMLInputElement)
      .value;
    if (data) {
      router.push({ pathname: '/search', query: { search: data } }, '/search');
    }
  }

  useEffect(() => {
    const closeNoti = (e: MouseEvent) => {
      if (
        notif &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotif(false);
      }
    };
    document.body.addEventListener('click', closeNoti);
    return () => document.body.removeEventListener('click', closeNoti);
  }, [notif]);

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
              className="border-r-1 absolute left-0  top-0 flex h-[64px]
          w-[64px] items-center justify-center rounded-tr-3xl border 
              border-b-0  border-[#0097E2]  bg-[#2A3568] sm:hidden"
            ></motion.div>
          )}
        </AnimatePresence>
      </div>
      <div
        className="absolute left-0 top-0  flex h-[64px] w-[64px]
            items-center justify-center rounded-bl-3xl rounded-tr-3xl border 
              border-[#0097E2] bg-[#2A3568]"
      >
        <Link className="" href="/home">
          <Image
            className=""
            src="/logo.svg"
            alt="logo"
            width={41}
            height={41}
          />
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
          className="flex w-1/2  flex-row items-center justify-center sm:w-1/3 lg:w-1/4 "
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
        <div
          className="relative right-12 flex sm:absolute"
          ref={notificationRef}
        >
          <button onClick={() => setNotif(!notif)}>
            <NotificationIcon />
          </button>
        </div>
      </div>
      {
        notif && <NotiDrop />
        //     {/* <a
        //       href="#"
        //       className="block bg-gray-800 py-2 text-center font-bold text-white"
        //     >
        //       See all notifications
        //     </a> */}
        //   // </div>
        // )}
      }
    </div>
  );
}

export default GameNavBar;
