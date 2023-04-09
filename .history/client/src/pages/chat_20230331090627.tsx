/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
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
     
      <div className="m-5 flex min-h-[700px] min-w-[100px] flex-row rounded-2xl border border-neutral-300 sm:m-20 md:h-[80%]">
        <div className="h-[100%] flex-[1_1_0%] flex-col border-r-[2px]">
          <div className="flex h-[5%] items-center border-b pl-5">
            Chat Room
          </div>

          <div className="flex h-[15%] w-[100%] flex-col pl-5">
            <div>Online Now</div>
            <div className="scroll-hide flex w-[90%] snap-x flex-row overflow-hidden overflow-x-auto scrollbar-hide">
              {
                data.player.friends.map((friend: any, index: any) =>(
                  <Link key={index} href={`/users/${friend.nickname}`}>
                    <img
                      className="h-12 w-12 cursor-pointer rounded-full border"
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
          
          <div className="flex h-[80%] flex-col pl-5">
            <div>Recent Chat</div>
            <div className="flex-col overflow-hidden overflow-y-auto scrollbar-hide border ">

              <div className="flex h-[70px] w-[300px] cursor-pointer border flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5">
                <img
                  className="h-12 w-12 rounded-full"
                  src={pictures.pfp}
                  alt="Avatar"
                />
                <Link href={`/users/${data.player.nickname}`}><h3>{data.player.nickname}</h3></Link>
              </div>

            </div>
          </div>
        </div>

        <div className="flex-[2_2_0%] justify-between  ">
          <div className="flex h-[5%] items-center border-b pl-5 "></div>
          <div className="flex flex-col w-[100%] h-[95%]">
            <div className="flex w-[100%] h-[40%] text-3xl ">
              <div className="flex h-[15%] w-[100%] flex-col pl-5 self-end ">Select a Chat or <br/>
                  Start a New:</div>
            </div>
            <div className="flex flex-row w-[100%] h-[60%] pl-5 ">
              <div className="flex m-auto mb-0 flex-col self-center h-[85%] w-[50%] ">
                <div className="flex flex-col h-[10%] w-[90%]">
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
                  className="mt-60 ml-20 border-white peer block appearance-none
                    rounded-full border-2 bg-transparent py-2.5 px-3 text-xs md:text-s w-[100px]
                    w-[150px] text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500"
                >
                  Create
                </button>
              </div>


              <div className="flex m-auto mb-0 flex-row self-center h-[85%] w-[50%]">
                <div className="flex flex-col h-[10%] w-[90%]">
                  <h2 className="flex text-xl">Direct Message :</h2>
                  <div className="relative flex items-center justify-center">
                  <input type="text" name="nickname" id="nickname"
                    className=" border-white w-[90%]
                    peer block w-full appearance-none rounded-full border-2 bg-transparent
                    py-2.5 px-3  text-xs md:text-sm 
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder="player" required/>
                    <button
                      type="submit"
                      className="absolute right-0 top-0 border-white peer block appearance-none 
                            rounded-full border-2 bg-transparent py-2.5 px-3 text-xs md:text-sm w-[100px]
                             text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500"
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
