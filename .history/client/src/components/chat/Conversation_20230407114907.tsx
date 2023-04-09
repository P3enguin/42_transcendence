import React from "react";
import axios from "axios";
import { useRouter } from "next/router";

function Conversation (nickname: any) {
  const router = useRouter();
  async function talk(nickname: any) {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/privateMessages',
          {
            withCredentials: true,
            params: {
              nickname: nickname,
            },
          },
        );
        router.push('/chat/' + res.data);
      }
    return(
        <div className="flex flex-col w-[100%] h-[95%] border-t m-auto ">
            
        </div>
    );
}

export default Conversation;