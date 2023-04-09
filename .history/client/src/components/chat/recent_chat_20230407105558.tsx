import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';

function RecentChat({avatar, player }: any)
{
    async function joinMatchmaking(gametype: string) {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_HOST + '/game/join',
          {
            withCredentials: true,
            params: {
              gametype: gametype,
            },
          },
        );
        router.push('/game/' + res.data);
      }
    return (
        <div className="flex justify-between p-2 md:p-0 md:justify-around
            space-x-2 md:space-x-5 h-[70px] w-[100%] md:w-[300px] cursor-pointer 
            flex-row item-start rounded-2xl text-sm
            bg-[#8BD9FF] bg-opacity-20 shadow-xl">
                <div className="w-[72%] flex flex-row space-x-2 "
                onClick={}
                >
                <Image
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full  self-center" 
                   src={avatar} alt="Avatar" width={10} height={10}/>
                <div className="flex flex-col self-center  whitespace-nowrap overflow-x-hidden">
                <Link  href={`/users/${player}`}><h3>{player}</h3></Link>
                <div className="flex text-xs text-green-300 ">
                    it specifies overflow behavior for the end of the line (the right end for left-to-right text, the left end for right-to-left text). If two values are given, the first specifies overflow behavior for the
                </div>
                </div>
            </div>
            <div className="flex flex-col h-full justify-end">
            <div className="rounded-full w-[20px] h-[20px] bg-[#01FD91] text-center self-end"> +2</div>
            <div className="text-xs sm:pr-2">10:00AM</div>
            </div>
        </div>
    );
}

export default RecentChat;