import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { SendIcon, SettingIcon } from "../icons/Icons";
import axios from "axios";

let socket: any;
function Conversation ({nickname, avatar, jwt_token, id}: any) {

  const [message, setMessage] = useState([]);

  const clientsMap = new Map();

  async function getRoomData()
  {
    const Channel = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat/getRoomInfo?roomId=${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwt_token}` },
        }
      ).then(channel => {
        console.log(channel.data);
      }).catch(err => console.log(err));

  }
  const sendMessage = () => {
    if (socket)
    {
      console.log('Sending message')
      socket.emit("sendMessage",{message:"hello there", id});
    }
  }


 
  useEffect(() => {

    

    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connected', () => {
      console.log(nickname," : connected to the socket with : ",socket.id)
      clientsMap.set(socket.id, nickname);
      socket.emit('joinChat',{id});
        
        socket.on('disconnect', () =>{
        console.log(nickname," : disconnected");
        clientsMap.delete(socket.id);
      });
      
      socket.on('message', (message: any) => {
        console.log(`Received message from ${message}`);
        handelReceivedMessage(message);
      });
  });
    
    const handelReceivedMessage = (message: string) => {
      
    };
    return (()=> {
      socket.disconnect();
    })
  }, []);

  const picture = process.env.NEXT_PUBLIC_BACKEND_HOST + "/avatars/" + avatar;
    return(
      <div className="flex w-full h-full justify-between flex-col ">
        <div className="flex h-[8%] w-full items-center sm:border-b justify-between p-2">
        <div className="flex flex-row items-center justify-between w-full px-3 py-2 mt-3 sm:mt-0">
          <div className="flex items-center">
            <div className="flex items-center ">
              <img className="rounded-full border"
                src={picture} alt="avatar" width={45} height={45} />
              <h3 className="ml-2">{nickname} </h3>
            </div>
          </div>
          <div>
            <button className="p-1">
              <SettingIcon />
            </button>
          </div>
        </div>
        </div>
          <div className="flex flex-col w-[100%] h-[95%]
            items-center justify-end ">
              <div className="sm:flex flex-col relative  w-[90%] mb-2 items-center ">
                  <input type="text" name="nickname" id="nickname "
                    className=" border-white w-[70%]
                    peer block w-full appearance-none rounded-full border-2 bg-transparent
                    py-2.5 px-3  text-xs sm:text-sm 
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0 overflow-hidden "
                    placeholder="Message . . . " required/>
                    <button  type="submit" 
                      className="absolute m-auto rounded-full top-[50%] translate-y-[-50%] right-[10px]"
                      onClick={
                        sendMessage
                      }>
                            <SendIcon />
                    </button>
              </div>
        </div>
      </div>
    );
}

export default Conversation;