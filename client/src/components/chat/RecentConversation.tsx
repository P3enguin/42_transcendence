import Image from 'next/image';
import React, { useEffect, useState } from 'react';

function RecentConversation(room: any) {
  let date;
  let msg;
  const picture =
    process.env.NEXT_PUBLIC_BACKEND_HOST + '/channels/' + room.room.avatar;
  if (room.room.messages[0]) {
    msg = room.room.messages[0].message;
    date = new Date(room.room.messages[0].sendAt);
  } else {
    msg = '';
    date = '';
  }

  return (
    <div className="flex flex-row p-1">
      <Image
        className="self-center rounded-full sm:h-12  sm:w-12"
        src={picture}
        alt="Avatar"
        width={50}
        height={50}
      />
      <div className="flex max-w-[250px] flex-col self-center p-1">
        <h3>{room.room.name}</h3>
        <p className="text-xs flex overflow-x-hidden whitespace-nowrap text-green-300 ">
          {msg}{' '}
        </p>
      </div>
      {date && (
        <p className=" text-xs absolute right-3 self-end">
          {`${(date as Date).getHours()}:${(date as Date).getMinutes()}`}
        </p>
      )}
    </div>
  );
}

export default RecentConversation;
