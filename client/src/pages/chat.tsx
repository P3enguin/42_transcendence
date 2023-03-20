import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";
import { useEffect } from "react";
import { io, Socket } from 'socket.io-client';

let socket: Socket;

//use the chat : 
function Chat({ jwt_token }: { jwt_token: string }) {
  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connect', () => {
      console.log('connected');
      socket.emit('message', { username: 'test', message: 'hello' });
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <div className=" flex flex-col  items-center justify-center gap-[100px] ">
      </div>
    </>
  );
}
export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies["jwt_token"];
  console.log(jwt_token);
  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      return {
        // modify this to return anything you want before your page load
        props: {
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
