import React from "react";
import Link from 'next/link';

const  OnlineNow = ({player, avatar}: any) => {
    if (player.friends)
    {
        player.friends.map((friend: any, index: any) =>(
        <Link key={index} href={`/users/${friend.nickname}`}>
        <img className="h-16 w-16 cursor-pointer rounded-full border" src={avatar} alt="Avatar"/>
        </Link>
        )
    },
}