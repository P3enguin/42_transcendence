import React from "react";
import Link from 'next/link';
import Image from "next/image";
import { useState } from 'react';


function OnlineNow ({player, avatar}: any)
{
  // const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  // const [isLoading, setLoading] = useState(true);

  // const fetchPFP = async () => {
  //   setLoading(true);
  //   const res = await fetch(
  //     process.env.NEXT_PUBLIC_BACKEND_HOST+'/players/avatar?' +
  //       new URLSearchParams({ pfp: avatar }),
  //     {
  //       credentials: 'include',
  //     },
  //   );
  //   const pfp = await res.blob();
  //   const url = URL.createObjectURL(pfp);
  // };
  // if (pictures.pfp != avatar) fetchPFP();
  // setLoading(false);
    return (
        <div className="flex h-[15%] w-[100%] flex-col pl-5 pr-5">
        <div >Online Now</div>
      <div className="scroll-hide flex w-[90%] space-x-1 flex-row overflow-hidden overflow-x-auto scrollbar-hide ">
      <Link href={`/users/${player}`}>
        <img className="h-14 w-14 md:w-16 md:h-16 cursor-pointer rounded-full border" src={process.env.NEXT_PUBLIC_BACKEND_HOST + "/avatars/" + avatar} alt="Avatar" width={12} height={12} />
      </Link> 
      </div>
      <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start ">
    </div>
    </div>
    );
}

export default OnlineNow;