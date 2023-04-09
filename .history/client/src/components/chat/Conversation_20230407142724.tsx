import React from "react";
import Image from 'next/image';
import { SendIcon, SettingIcon } from "../icons/Icons";

function Conversation ({nickname, avatar}: any) {
    return(
      <div className="hidden md:flex w-full justify-between flex-col ">
        <div className="flex h-[8%] w-full items-center border-b justify-between p-2">
        <div className="flex flex-row items-center justify-between w-full px-3 py-2">
          <div className="flex items-center">
            <div className="flex items-center">
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
          <div className="flex flex-col w-[100%] h-[95%] border-t m-auto
            items-center justify-end ">
              <div className="sm:flex flex-col relative  w-[90%] mb-2 ">
                  <input type="text" name="nickname" id="nickname"
                    className=" border-white w-[70%]
                    peer block w-full appearance-none rounded-full border-2 bg-transparent
                    py-2.5 px-3  text-xs sm:text-sm 
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0 overflow-hidden"
                    placeholder="Message . . ." required/>
                    <button  type="submit"
                      className="lg:right-0 lg:top-0 lg:absolute  peer block appearance-none mt-2 border
                      rounded-full bg-transparent py-2.5 px-15 text-xs sm:text-sm w-[50%] sm:w-[100px]
                      text-white focus:outline-none focus:ring-0 bg-blue-500 sm:m-5 lg:m-0 /">
                            <SendIcon />
                    </button>
              </div>
        </div>
      </div>
    );
}

export default Conversation;