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
function Chat({ jwt_token }: { jwt_token: string }) {
  useEffect(() => {
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
      <div className="m-5 flex min-h-[700px] max-w-[1500px] flex-col rounded-2xl border border-neutral-300 sm:m-20 md:h-[80%] grid grid-cols-10 gap-rows-10">
        <div className="col-span-3  rounded-2xl  border-neutral-300 sm:m-20 md:h-[80%]">
          <h2 className="m-2 text-lg font-bold md:text-white ">Chat Room</h2>
        </div>
        <div className="col-span-7 border"></div>
        <div className="row-span-7 col-span-3 border">
          <div className="flex h-150 ">
            <h2 className="m-2 text-lg font-bold md:text-white ">Online Now</h2>
          </div>
        </div>
        <div className="col-span-7 row-span-6 rounded-2xl border">
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
        console.log({data});
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
