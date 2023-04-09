import React from "react";
import Link from 'next/link';
import Image from "next/image";

function OnlineNow ({player, avatar}: any)
{
    return (
        <div className="flex h-[15%] w-[100%] flex-col pl-5 pr-5">
        <div className=>Online Now</div>
      <div className="scroll-hide flex w-[90%] space-x-1 flex-row overflow-hidden overflow-x-auto scrollbar-hide ">
      <Link href={`/users/${player}`}>
        <Image className="h-14 w-14 md:w-16 md:h-16 cursor-pointer rounded-full border" src={avatar} alt="Avatar" width={12} height={12} />
      </Link> 
      </div>
      <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start ">
    </div>
    </div>
    );
}

export default OnlineNow;