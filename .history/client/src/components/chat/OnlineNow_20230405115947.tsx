import React from "react";
import Link from 'next/link';
import Image from "next/image";

function OnlineNow ({player, avatar}: any)
{
    // if (player)
    // {
        // player.friends.map((friend: any, index: any) =>{
            <Link key={0} href={`/users/${player}`}>
                <Image className="h-16 w-16 cursor-pointer rounded-full border" src={avatar} alt="Avatar"/>
            </Link>
        // }
    // }
}

export default OnlineNow;