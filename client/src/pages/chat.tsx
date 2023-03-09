import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";

function Chat({jwt_token}:{jwt_token:string}) {
  return (
    <Layout jwt_token={jwt_token}>
      <></>
    </Layout>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies["jwt_token"];

  if (!jwt_token)
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  const res  = await verifyToken(req.headers.cookie); 
  if (res.ok) {
    return {
      props:
      {
        jwt_token: jwt_token,
      }
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  }
}

export default Chat;
