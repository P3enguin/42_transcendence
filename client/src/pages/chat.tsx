import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";
import { useEffect } from "react";
import { io, Socket } from 'socket.io-client';

let socket: Socket;
interface player {
  nickname: string;
  firstname: string;
  lastname: string;
  coins: number;
  avatar: string;
  wallpaper: string;
  joinDate: string;
}

//use the chat : 
function Chat({ jwt_token, data }: { jwt_token: string,  data: any}) {
  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connect', () => {
      socket.emit('message', data.nickname);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <div className="flex h-[700px] w-[1500px] flex-col rounded-2xl border border-neutral-300 sm:m-20 md:h-[80%]">
        <div className="flex justify-between  flex-row w-11/12 h-1/7">
          <div className="flex w-5/12 items-center" >
           <h2 className="text-lg font-bold md:text-2xl w-1/3">
            Chat Room</h2>
          </div>
          <div className="h-0/3 border "></div>
          <div className="flex item-end w-8/12  items-center"></div>
        </div>
        
        <div className="flex  flex-row w-12/12 border"></div>
    
        <div className="flex justify-between  flex-row w-11/12 h-4/6"> 
          <div className="flex flex-start w-5/12 items-center" >
            <div > <h4>Online Now</h4> </div>
            <div className="flex flex-nowrap">

            </div>
          
          </div>
          <div className="h-0/3 border "></div>
          <div className="flex item-end w-8/12  items-center "></div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }: any) {
  const jwt_token = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      try {
        const resp = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/data',
          {
            headers: {
              Cookie: req.headers.cookie,
            },
          },
        );
        const data = await res.json();
        return {
          props: {
            data,
            jwt_token: jwt_token,
          },
        };
      } catch (error: any) {
        console.error(error.message);
        return {
          props: {
            data: [],
            jwt_token: jwt_token,
          },
        };
      }
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}


Chat.getLayout = function getLayout(page:React.ReactNode) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default Chat;
