import React from "react";

const  OnlineNow = () =>{
    if (data.player.friends)
    {
                   data.player.friends.map((friend: any, index: any) =>(
                    <Link key={index} href={`/users/${friend.nickname}`}>
                    <img
                      className="h-16 w-16 cursor-pointer rounded-full border"
                      src={pictures.pfp}
                      // src="blob:http://localhost:3000/6f8615dd-585e-4aae-9b34-8be16ec4f495"
                      alt="Avatar"/>
                 </Link>
                      }
                ))
}