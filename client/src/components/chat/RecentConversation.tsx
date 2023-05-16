import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function RecentConversation(room: any) {
    console.log('Recent Conversation');
    return (
        <div>
            <div className="w-[72%] flex flex-row space-x-2">
                <Image
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full  self-center" 
                    src={room.picture} alt="Avatar" width={10} height={10}/>
                    <div className="flex flex-col self-center border whitespace-nowrap overflow-x-hidden">
                    <Link  href={`/users/${room.player}`}><h3>{room.player}</h3></Link>
                    <div className="flex text-xs text-green-300 ">
                    it specifies overflow behavior for the end of the line .(the right end for left-to-right text, the left end for right-to-left text). If two values are given, the first specifies overflow behavior for the
                    </div>
                    </div>
                    </div>
                    <div className="flex flex-col h-full justify-end border">
                      <div className="rounded-full w-[20px] h-[20px] bg-[#01FD91] text-center self-end"> +2</div>
                      <div className="text-xs sm:pr-2">10:00AM</div>
                    </div> 
        </div>
    );
}

export default RecentConversation;