import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";

function Game({ jwt_token }: { jwt_token: string }) {
  return (
    <Layout>
      <></>
    </Layout>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies["jwt_token"];

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

export default Game;
