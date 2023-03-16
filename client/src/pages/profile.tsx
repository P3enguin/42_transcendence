import Image from "next/image";
import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";
import { SvgShapingMethod } from "@/components/icons/Icons";

function PlayerProfile({ jwt_token }: { jwt_token: string }) {
  return (
    <div className=" flex flex-col  items-center  w-11/12 ">
      <div
        className="   flex flex-col justify-center rounded-lg border-2 bg-[#2F3B78]"
      >
        <img
          src="/wallpaper.png"
          alt="wallpaper"
          id="wallpaper-holder"
          className="rounded-3xl flex-shrink-0 min-w-[200px] min-h-[80px] w-full lg:h-[300px] "
        />
        <div className="">
          <div className="flex  ">
            <img
              src="/pfp1.png"
              alt="pfp"
              id="pfp-holder"
              className="pfp absolute sm:w-[160px] sm:h-[179px]  w-[120px] h-[134px] sm:translate-x-[27px] 
                        sm:translate-y-[40px] translate-x-[20px] translate-y-[30px]"
            />
            <svg
              className="progress blue noselect z-10 shrink-0 sm:w-[200px] sm:h-[240px] w-[150px] h-[170px]"
              data-progress="55"
              x="0px"
              y="0px"
              viewBox="0 0 776 628"
            >
              <path
                className="track"
                d="M689.793 276.77C702.297 298.428 702.297 325.112 689.793 346.77L550.207 588.54C537.703 610.198 514.594 623.54 489.585 623.54H210.415C185.406 623.54 162.297 610.198 149.793 588.54L10.2071 346.77C-2.2971 325.112 -2.29708 298.428 10.2072 276.77L149.793 35.0001C162.297 13.3419 185.406 0 210.415 0H489.585C514.594 0 537.703 13.342 550.207 35.0001L689.793 276.77Z"
              ></path>

              <path
                className="fill"
                d="M689.793 276.77C702.297 298.428 702.297 325.112 689.793 346.77L550.207 588.54C537.703 610.198 514.594 623.54 489.585 623.54H210.415C185.406 623.54 162.297 610.198 149.793 588.54L10.2071 346.77C-2.2971 325.112 -2.29708 298.428 10.2072 276.77L149.793 35.0001C162.297 13.3419 185.406 0 210.415 0H489.585C514.594 0 537.703 13.342 550.207 35.0001L689.793 276.77Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div>div2</div>
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

PlayerProfile.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default PlayerProfile;
