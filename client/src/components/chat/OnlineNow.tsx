import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';

function OnlineNow ({player, token, ws}: any)
{
  useEffect( ()=>{ 
    if (ws){
      ws.emit('getOnlineFriends',(response: any)=>{

      });
      ws.on('NewLogIn', (res: any)=> {

      });
      ws.on('NewLogOut', (res: any) =>{

      });
    }
    return(()=>{
      // ws.off('NewLogIn')
      // ws.off('NewLogOut')
    })
  }, [])

  const [friends, setFriends] = useState([]);
  const router = useRouter();

  async function getRoom(event : React.FormEvent, player1: any, player2: any) {
    event.preventDefault();

    const room = player1 + player2;

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat/getRoom?player1=${player1}&creator=${player2}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then(res => {
      console.log(res.data);
      router.push(`/chat/${res.data}`);
    }).catch(err => console.log(err));
    
  }

  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/friends',
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFriends();
  }, []);

  return (
    <div className="flex h-[15%] w-[100%] flex-col pl-5 pr-5 border-b">
      <div>Friends : </div>
      <div className="scroll-hide flex w-[90%] space-x-1 flex-row overflow-hidden overflow-x-auto scrollbar-hide">
        {friends.map((friend: any, key: number) => {
          const picture = process.env.NEXT_PUBLIC_BACKEND_HOST + "/avatars/" + friend.avatar;

          return (
            <div key={key} onClick={(event) => getRoom(event, friend.nickname, player)}>
                <Image
                  className="h-14 w-14 md:w-16 md:h-16 cursor-pointer rounded-full border"
                  src={picture}
                  alt="Avatar"
                  width={12}
                  height={12}
                />
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start"></div>
    </div>
  );
}

export default OnlineNow;