import React from "react";

function StartNew() {
    return (
        <div className="flex flex-col w-[100%] h-[95%] ">
            <div className="md:items-center lg:flex w-[100%]
                  h-[30%] text-3xl text-center lg:text-start">
              <div className=" lg:m-5 flex h-[15%] w-[100%] flex-col  self-end">Select a Chat or <br/>
                  Start a New:</div>
            </div>
            <div className="flex flex h-full w-full flex-col lg:flex-row">
              <div className="md:flex md:md:items-center lg:flex m-auto mb-0 flex-col self-center h-[85%] w-[50%] ">
                <div className="md:h-[2%] lg:flex flex-col h-[10%] w-[90%]">
                  <h2 className="flex text-xl">Channel : </h2>
                  <input
                    type="text"
                    name="channel"
                    id="channel"
                    className="border-white w-[90%] peer block w-full appearance-none
                      rounded-full border-2 bg-transparent py-2.5 px-3 text-xs md:text-sm
                        text-white focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder="channel name"
                    required
                  />
                </div>
                <button
                  name="create"
                  disabled
                  className="border-white peer block appearance-none mt-20
                    rounded-full border-2 bg-transparent py-2.5 px-3 text-xs md:text-s w-[100px]
                    w-[50%] text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500 lg:mt-60 lg:ml-20"
                >
                  Create
                </button>
              </div>


              <div className="flex m-auto mb-0 flex-row self-center h-[85%] w-[50%]">
                <div className="flex flex-col h-[10%] w-[90%]">
                  <h2 className="flex text-xl whitespace-nowrap ">Direct Message :</h2>
                  <div className="md:flex md:flex-col relative flex items-center justify-center">
                  <input type="text" name="nickname" id="nickname"
                    className=" border-white w-[90%]
                    peer block w-full appearance-none rounded-full border-2 bg-transparent
                    py-2.5 px-3  text-xs md:text-sm 
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0 overflow-hidden"
                    placeholder="player" required/>
                    <button
                      type="submit"
                      className="lg:right-0 lg:top-0 lg:absolute border-white peer block appearance-none 
                            rounded-full border-2 bg-transparent py-2.5 px-3 text-xs md:text-sm w-[30%] md:w-[100px]
                             text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500 md:m-5 lg:m-0"
                    >
                      start
                    </button>
                  </div>
                </div>
              </div>
              </div>
              </div>
    );
}

export default S