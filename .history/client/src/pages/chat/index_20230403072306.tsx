/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/layout/layout';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useState } from 'react';
import Link from 'next/link';

let socket: Socket;
//use the chat :
function Chat({ jwt_token, data }: { jwt_token: string; data: any }) {
  const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPFP = async () => {
      setLoading(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST+'/players/avatar?' +
          new URLSearchParams({ pfp: data.player.avatar }),
        {
          credentials: 'include',
        },
      );
      const pfp = await res.blob();
      const url = URL.createObjectURL(pfp);

      changePictures((pictures) => ({
        ...pictures,
        ...{ pfp: url, wp: pictures.wp },
      }));
    };
    if (pictures.pfp != data.player.avatar) fetchPFP();
    setLoading(false);
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connect', () => {
      socket.emit('message', { username: 'test', message: 'hello' });
    });
    return () => {
      socket.disconnect();
    };
    
  }, []);
  
  return (
    <>
     
      <div className="flex w-[80%] h-[600px] md:h-[800px] mt-10 flex-row rounded-2xl border border-neutral-300 max-w-[1200px] ">
      <div className="h-[100%] w-[100%] md:w-[360px] flex-col  md:border-r">
          <div className="flex h-[5%] items-center border-b pl-5 w-[100%]">
            Chat Room
          </div>

          <div className="flex h-[15%] w-[100%] flex-col pl-5 pr-5">
              <div >Online Now</div>
            <div className="scroll-hide flex w-[90%] space-x-1 flex-row overflow-hidden overflow-x-auto scrollbar-hide ">
              {
                data.player.friends.map((friend: any, index: any) =>(
                  <Link key={index} href={`/users/${friend.nickname}`}>
                    <img
                      className="h-16 w-16 cursor-pointer rounded-full border"
                      src={pictures.pfp}
                      // src="blob:http://localhost:3000/6f8615dd-585e-4aae-9b34-8be16ec4f495"
                      alt="Avatar"/>
                  </Link>
                )
                )}
                
            </div>
            <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start ">
          </div>
          </div>
          
          <div className="flex h-[80%] flex-col p-1 sm:p-5 sm:pt-0 ">
          <div className="flex flex-row justify-between border-t pt-1">
            <div>Recent Chat</div>
            <div className="md:hidden">Start New</div>
            </div>
            <div className="flex-col h-full overflow-hidden overflow-y-auto space-y-3 mt-2">

              <div className="flex justify-between p-2 md:p-0 md:justify-around
                    space-x-2 md:space-x-5 h-[70px] w-[100%] md:w-[300px] cursor-pointer border 
                  flex-row item-start rounded-2xl text-sm
                   bg-[#8BD9FF] bg-opacity-30 ">
                    <div className="flex flex-row space-x-2 w-full border">
                      <img
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border self-center" 
                        src={pictures.pfp}
                        alt="Avatar"
                        />
                      <div className="flex flex-col self-center border">
                        <Link href={`/users/${data.player.nickname}`}><h3>{data.player.nickname}</h3></Link>
                      <div className="flex text-xs text-green-300  border">
                        how are you today? wanna hangout ?
                      </div>
                    </div>
                </div>
                <div className="flex flex-col h-full justify-end ">
                  <div className="rounded-full w-[20px] h-[20px] bg-[#01FD91] text-center self-end"> +2</div>
                  <div className="text-xs">10:00AM</div>
                </div>
              </div>

            </div>


          </div>
        </div>
        <div className="hidden md:flex w-full justify-between flex-col ">
          <div className="flex h-[5%] w-full items-center border-b "></div>
          <div className="flex flex-col w-[100%] h-[95%] ">
            <div className="md:items-center lg:m-5 lg:flex w-[100%] h-[30%] text-3xl text-center lg:text-start">
              <div className="flex h-[15%] w-[100%] flex-col  self-end">Select a Chat or <br/>
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
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder="player" required/>
                    <button
                      type="submit"
                      className="lg:right-0 lg:top-0 lg:absolute border-white peer block appearance-none 
                            rounded-full border-2 bg-transparent py-2.5 px-3 text-xs md:text-sm w-[40%] md:w-[100px]
                             text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500 md:m-5 lg:m-0"
                    >
                      start
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/data',
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      },
    );
    const data = await res.json();
    if (res.ok) {
      return {
        // modify this to return anything you want before your page load
        props: {
          data,
          jwt_token: jwt_token,
        },
      };
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

Chat.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default Chat;
