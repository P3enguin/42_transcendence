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
    }else{
        msg = '';
        date = '';
    }

    return (
        <div className='flex flex-row p-1'>
            <Image
            className="sm:h-12 sm:w-12 rounded-full  self-center" 
            src={picture} alt="Avatar" width={50} height={50}/>
            <div className="flex flex-col self-center p-1 max-w-[250px]">
                <h3>{room.room.name}</h3>
                <p className="flex text-xs text-green-300 whitespace-nowrap overflow-x-hidden ">
                {msg} </p>
            </div>
            {date && (<p className=" text-xs self-end absolute right-3">{`${date.getUTCHours()}:${date.getUTCMinutes()}`}</p>)}

        </div>
    );
}

export default RecentConversation;