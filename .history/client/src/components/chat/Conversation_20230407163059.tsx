import React from "react";
import Image from 'next/image';
import { SendIcon, SettingIcon } from "../icons/Icons";

function Conversation ({nickname, avatar}: any) {
    return(
      <div className="flex w-full h-full justify-between flex-col ">
        <div className="flex h-[8%] w-full items-center sx:border-b justify-between p-2">
        <div className="flex flex-row items-center justify-between w-full px-3 py-2">
          <div className="flex items-center">
            <div className="flex items-center mt-2">
              <Image className="rounded-full border"
                src={avatar} alt="avatar" width={45} height={45} />
              <h3 className="ml-2">{nickname} Naahio</h3>
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
                  <input type="text" name="nickname" id="nickname"
                    className=" border-white w-[70%]
                    peer block w-full appearance-none rounded-full border-2 bg-transparent
                    py-2.5 px-3  text-xs sm:text-sm 
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0 overflow-hidden"
                    placeholder="Message . . ." required/>
                    <button  type="submit" 
                      className=" right-0 top-0 absolute  peer block appearance-none mt-2
                      rounded-full bg-transparent py-1 sm:py-1.5 px-12 text-xs sm:text-sm w-[50%] sx:w-[100px]
                      focus:outline-none focus:ring-0 bg-blue-500  m-0 /">
                            <SendIcon />
                    </button>
              </div>
        </div>
      </div>
    );
}

export default Conversation;