import Layout from "@/components/layout/layout";
import { useState } from "react";
import { verifyToken } from "@/components/VerifyToken";
import {
  FriendIcon,
  AchievementIcon,
  MatchHistoryIcon,
  RankingIcon,
} from "@/components/icons/Icons";

import { useEffect } from "react";

interface player {
  nickname: string;
  firstname: string;
  lastname: string;
  coins: number;
  avatar: string;
  wallpaper: string;
  joinAt: string;
}


function PlayerProfile({
  nickname,
  firstname,
  lastname,
  coins,
  avatar,
  wallpaper,
  joinAt,
}: player) {
  const [pictures, changePictures] = useState({ pfp: "", wp: "" });
  const [isLoading, setLoading] = useState(true);
  const list  = ["hh","hh2","hh3"];

  useEffect(() => {
    const fetchPFP = async () => {
      setLoading(true);
      const res = await fetch(
        "http://e2r7p6.1337.ma:8000/players/pfp?" +
          new URLSearchParams({ pfp: avatar }),
        {
          credentials: "include",
        }
      );
      const pfp = await res.blob();
      const url = URL.createObjectURL(pfp);
      changePictures((pictures) => ({
        ...pictures,
        ...{ pfp: url, wp: pictures.wp },
      }));
    };

    const fetchWp = async () => {
      const res = await fetch(
        "http://e2r7p6.1337.ma:8000/players/wp?" +
          new URLSearchParams({ wp: wallpaper }),
        {
          credentials: "include",
        }
      );
      const wp = await res.blob();
      const url = URL.createObjectURL(wp);
      changePictures((pictures) => ({
        ...pictures,
        ...{ pfp: pictures.pfp, wp: url },
      }));
    };
    if (pictures.pfp != avatar) fetchPFP();
    if (pictures.wp != wallpaper) fetchWp();
    setLoading(false);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!isLoading)
  {
    return (
      <div className=" flex flex-col items-center  xl:gap-[100px] gap-10  w-full ">
        <div
          className="flex flex-col justify-center sm:rounded-3xl bg-[#2F3B78]
          xl:mt-[100px] mt-[20px] w-full xl:w-[1000px]  md:max-xl:w-5/6"
        >
          <img
            src={pictures.wp}
            alt="wallpaper"
            id="wallpaper-holder"
            className=" sm:rounded-t-3xl  min-w-[200px] min-h-[80px] 
                w-full xl:h-[320px] sm:h-[220px]  h-[160px]"
          />
          <div className="flex xl:flex-row flex-col items-center mb-7">
            <div className="xl:w-1/3 w-full flex justify-center items-start xl:ml-6 gap-2 ">
              <select
                id="title"
                className=" xl:hidden text-[10px] leading-3  bg-[#2C3B7C] text-white 
                   border-white rounded-lg outline-none focus:border-black  
                    focus:outline-none focus:ring-black  p-1"
              >
                <option
                  value="select a title"
                  defaultValue={"select a title"}
                  disabled
                  id="titles"
                  hidden
                >
                  select a title
                </option>
                {
                  list.map(elem => (
                    <option value={elem}>{elem}</option>
                  ))
                }
              </select>
              {/* player info  */}
              <div className="flex flex-col ">
                {/* image  */}
                <div className="flex xl:-mt-[180px] -mt-[120px]">
                  <img
                    src={pictures.pfp}
                    alt="pfp"
                    id="pfp-holder"
                    className="pfp absolute xl:w-[160px] xl:h-[179px]  w-[120px] h-[130px] xl:translate-x-[27px] 
                            xl:translate-y-[40px] translate-x-[20px] translate-y-[28px]"
                  />
                  <svg
                    className="progress blue noselect z-10 shrink-0 xl:w-[200px] xl:h-[240px] w-[150px] h-[170px]"
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
                <div className=" text-white flex flex-col xl:items-start xl:pl-6 items-center">
                  <strong>{firstname + " " + lastname}</strong>
                  <span className=" text-gray-400">{"@" + nickname}</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-end gap-[50px] ">
                <span className="text-[7px]  text-gray-400">
                  MEMBER SINCE:08 JAN 2023
                </span>
                <select
                  id="title"
                  className="text-[10px] leading-3 xl:flex hidden bg-[#2C3B7C] text-white 
                   border-white  rounded-lg outline-none focus:border-black  
                    focus:outline-none focus:ring-black p-1"
                >
                  <option
                    value="select a title"
                    defaultValue={"select a title"}
                    disabled
                    hidden
                  >
                    select a title
                  </option>
                  {
                  list.map((elem, index) => (
                    
                    <option key={index} value={elem}>{elem}</option>
                  ))
                }
                </select>
              </div>
            </div>
            {/* player state  */}
            <div className="xl:w-2/3 w-full flex justify-around sm:items-end mt-7  items-center gap-10">
              <div className="flex sm:flex-row  flex-col gap-10">
                <div className="flex items-center gap-2  ">
                  <img src="King.svg" alt="rankIcon"></img>

                  <div className="flex  flex-col ">
                    <strong className=" text-gray-100 text-sm">GOLD</strong>
                    <span className="text-gray-400 text-xs">Ranking</span>
                  </div>
                </div>
                <div className="flex items-center  gap-2">
                  <img
                    src="coin.svg"
                    alt="coinIcon"
                    width={36}
                    height={36}
                  ></img>
                  <div className="flex  flex-col ">
                    <strong className=" text-gray-100 text-sm">{coins + " ₳"} </strong>
                    <span className="text-gray-400 text-xs">cache earned</span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-row  flex-col gap-10">
                <div className="flex items-center gap-2">
                  <img
                    src="star.svg"
                    alt="startIcon"
                    width={36}
                    height={36}
                  ></img>
                  <div className="flex  flex-col ">
                    <strong className=" text-gray-100 text-sm">
                      1800/2500 XP
                    </strong>
                    <span className="text-gray-400 text-xs">player XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="champion.svg"
                    alt="champIcon"
                    width={36}
                    height={36}
                  ></img>
                  <div className="flex  flex-col ">
                    <strong className=" text-gray-100 text-sm">91 %</strong>
                    <span className="text-gray-400 text-xs">win ratio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col justify-center sm:rounded-3xl bg-[#2F3B78] 
        w-full xl:w-[1000px]  md:max-xl:w-5/6"
        >
          <div
            className="flex border-gray-100 p-2 border-2 border-t-0 
                  border-l-0 border-r-0 border-opacity-70 text-[#8BD9FF] text-sm"
          >
            <button
              className="w-1/4  border-2 flex justify-center 
                       border-gray-100  border-t-0 border-l-0 
                       h-[60px] items-center border-opacity-70 
                       border-b-0 transition-all"
            >
              <FriendIcon />
              <span className="friend-text absolute invisible transition-all opacity-0">
                Friends
              </span>
            </button>
            <button
              className="w-1/4 border-2 flex justify-center 
                       border-gray-100  border-t-0 
                        border-l-0 h-[60px] items-center border-opacity-70 
                        border-b-0 transition-all "
            >
              <AchievementIcon />
              <span className="friend-text absolute invisible transition-all opacity-0 ">
                Achievement
              </span>
            </button>
            <button
              className="w-1/4 border-2 flex justify-center 
                        border-gray-100  border-t-0 border-l-0 
                        h-[60px] items-center  border-opacity-70 
                        border-b-0 transition-all"
            >
              <MatchHistoryIcon />
              <span className="friend-text absolute invisible transition-all opacity-0 text-xs">
                Match History
              </span>
            </button>
            <button
              className="w-1/4 border-2 flex justify-center 
                      border-gray-100 border-t-0  border-r-0 
                      border-l-0 h-[60px] items-center  border-opacity-70 
                      border-b-0 transition-all "
            >
              <RankingIcon />
              <span className="friend-text absolute invisible transition-all opacity-0">
                Ranking
              </span>
            </button>
          </div>
          <div className=" min-h-[300px] flex overflow-auto "></div>
        </div>
      </div>
    );
  }
}

export async function getServerSideProps({ req }: any) {
  // fetching all data :

  const jwt_token: string = req.cookies["jwt_token"];
  if (jwt_token) {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_HOST + "/players/data", {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    const data = await res.json();

    // const res2 = await fetch(
    //   "http://e2r7p6.1337.ma:8000/players/pfp?" +
    //     new URLSearchParams({ pfp: data.player.avatar }),
    //   {
    //     headers: {
    //       Cookie: req.headers.cookie,
    //     },
    //   }
    // );
    return {
      // modify this to return anything you want before your page load
      props: {
        nickname: data.player.nickname,
        firstname: data.player.firstname,
        lastname: data.player.lastname,
        coins: data.player.coins,
        avatar: data.player.avatar,
        wallpaper: data.player.wallpaper,
        joinAt: data.player.joinAt,
      },
    };
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
