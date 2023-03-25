import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";
import { useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import styles from "../styles/Chat.module.css";

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
      <div className="m-5 flex min-h-[700px] min-w-[1200px] flex-row rounded-2xl border border-neutral-300 sm:m-20 md:h-[80%]">
        <div className="flex-[1_1_0%] border-r-[2px] h-[100%] flex-col">
         <div className="flex h-[5%] border-b items-center pl-5">Chat Room</div>
    
         <div className="flex h-[15%] w-[100%] flex-col pl-5">
          <div>Online Now</div>
          <div className="flex w-[90%] flex-row snap-x overflow-hidden">
          <img className="h-12 w-12 rounded-full" src={data.avatar} alt="Avatar" />
             
          </div>
         </div>
         <div className="flex h-[80%] flex-col pl-5">
          <div>
            Recent Chat
          </div>
          <div className="m-3 mb-10 flex w-[170px] flex-col items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5" >
                <img className="h-12 w-12 rounded-full" src={data.avatar} alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>

         </div>
        </div>
        
    
        <div className="flex-[2_2_0%] justify-between "> 
          <div className="flex h-[5%] border-b items-center pl-5"></div>

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
        console.log(data);
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
