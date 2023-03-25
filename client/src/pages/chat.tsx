import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";
import { useEffect } from "react";
import { io, Socket } from 'socket.io-client';

let socket: Socket;
let players = new Map<number, string>();

//use the chat : 
function Chat({ jwt_token, data }: { jwt_token: string, data: any }) {
  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connect', () => {
      players.set(1,"Naahio");
      console.log(players.get(1));
      socket.emit('message', { username: 'test', message: 'hello' });
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
          <div className="flex w-[90%] flex-row snap-x overflow-hidden overflow-x-auto scroll-hide">
            <img className="h-20 w-20 rounded-full cursor-pointer a='www.google.com'" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Scooter " alt="Avatar" />
            <img className="h-20 w-20 rounded-full cursor-pointer a='www.google.com'" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Sheba " alt="Avatar" />
            <img className="h-20 w-20 rounded-full cursor-pointer a='www.google.com'" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Pepper " alt="Avatar" />
            <img className="h-20 w-20 rounded-full cursor-pointer a='www.google.com'" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Jasper " alt="Avatar" />
            <img className="h-20 w-20 rounded-full cursor-pointer a='www.google.com'" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Tigger " alt="Avatar" />
            <img className="h-20 w-20 rounded-full cursor-pointer a='www.google.com'" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Baby " alt="Avatar" />

          </div>
         </div>
         <div className="flex h-[80%] flex-col pl-5">
          <div>
            Recent Chat
          </div>
          <div className="flex-col overflow-hidden overflow-y-auto">
              <div className="m-3 mb-10 flex w-[90%] flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5 cursor-pointer" >
                <img className="h-20 w-20 rounded-full" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Scooter" alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>
              <div className="m-3 mb-10 flex w-[90%] flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5 cursor-progress" >
                <img className="h-20 w-20 rounded-full" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Sheba" alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>
              <div className="m-3 mb-10 flex w-[90%] flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5 cursor-not-allowed" >
                <img className="h-20 w-20 rounded-full" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Pepper" alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>
              <div className="m-3 mb-10 flex w-[90%] flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5 cursor-progress" >
                <img className="h-20 w-20 rounded-full" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Jasper" alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>
              <div className="m-3 mb-10 flex w-[90%] flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5 cursor-not-allowed" >
                <img className="h-20 w-20 rounded-full" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Baby" alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>
              <div className="m-3 mb-10 flex w-[90%] flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5 cursor-not-allowed" >
                <img className="h-20 w-20 rounded-full" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Jasper" alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>
              <div className="m-3 mb-10 flex w-[90%] flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5 cursor-not-allowed" >
                <img className="h-20 w-20 rounded-full" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Tinkerbell"alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>
              <div className="m-3 mb-10 flex w-[90%] flex-row items-center rounded-2xl bg-[#8BD9FF] bg-opacity-30 p-5 cursor-not-allowed" >
                <img className="h-20 w-20 rounded-full" src="https://api.dicebear.com/5.x/adventurer/svg?seed=Felix" alt="Avatar" />
                <h3>{data.nickname}</h3>
              </div>
            
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
  const jwt_token: string = req.cookies["jwt_token"];
  // console.log(jwt_token);
  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
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
      destination: "/",
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
