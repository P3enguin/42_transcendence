import React from "react";
import Link from 'next/link';

function OnlineNow ({player}: any)
{
  return (
    <div className="flex h-[15%] w-[100%] flex-col pl-5 pr-5">
      <div>Online Now</div>
      <div className="scroll-hide flex w-[90%] space-x-1 flex-row overflow-hidden overflow-x-auto scrollbar-hide">
        {player.map((friend: any, key: number) => {
          const picture = process.env.NEXT_PUBLIC_BACKEND_HOST + "/avatars/" + friend.avatar;

          return (
            <div key={key}>
              <Link href={`/users/${friend.nickname}`}>
                <img
                  className="h-14 w-14 md:w-16 md:h-16 cursor-pointer rounded-full border"
                  src={picture}
                  alt="Avatar"
                  width={12}
                  height={12}
                />
              </Link> 
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start"></div>
    </div>
  );
}

export default OnlineNow;