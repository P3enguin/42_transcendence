import Image from "next/image";
import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";

function PlayerProfile({ jwt_token }: { jwt_token: string }) {
  return (
      <div className="w-5/6 flex flex-col items-center">
        <div className="w-full flex flex-col justify-center items-center h-1/4 rounded-lg border-2 bg-[#2F3B78]">
            <img
              src="/wallpaper.png"
              alt="wallpaper"
              id="wallpaper-holder"
              className="rounded-3xl flex-shrink-0 min-w-[200px] min-h-[80px] w-[900px] h-[200px]"
            />
            <div className="border-4 pfp">
              <img
                src="/pfp1.png"
                alt="pfp"
                id="pfp-holder"
                className="  w-[150px] h-[165px]"
              />
            </div>
        </div>
        <div>
          div2
        </div>
    
      </div>
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

PlayerProfile.getLayout = function getLayout(page:React.ReactNode) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
export default PlayerProfile;
