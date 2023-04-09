import React from "react";
import Link from 'next/link';
import Image from "next/image";

function OnlineNow ({player, avatar}: any)
{
    return (
        <Link href={`/users/${player}`}>
            <Image className="h-16 w-16 cursor-pointer rounded-full border" src={avatar} alt="Avatar" width={16} height={16}/>
        </Link>
    );
}

export default OnlineNow;