import Layout from '@/components/layout/layout';
import { useState } from 'react';
import {
  FriendIcon,
  AchievementIcon,
  MatchHistoryIcon,
  RankingIcon,
} from '@/components/icons/Icons';

import { useEffect } from 'react';

interface player {
  nickname: string;
  firstname: string;
  lastname: string;
  coins: number;
  avatar: string;
  wallpaper: string;
  joinAt: Date;
  exist? : boolean
}

function UserProfile({
  nickname,
  firstname,
  lastname,
  coins,
  avatar,
  wallpaper,
  joinAt,
  exist,
}: player) {
  const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  const [isLoading, setLoading] = useState(true);
  const list = ['hh', 'hh2', 'hh3'];

  useEffect(() => {
    const fetchPFP = async () => {
      setLoading(true);
      const res = await fetch(
        'http://e2r7p6.1337.ma:8000/players/avatar?' +
          new URLSearchParams({ pfp: avatar }),
        {
          credentials: 'include',
        },
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
        'http://e2r7p6.1337.ma:8000/players/wallpaper?' +
          new URLSearchParams({ wp: wallpaper }),
        {
          credentials: 'include',
        },
      );
      const wp = await res.blob();
      const url = URL.createObjectURL(wp);
      changePictures((pictures) => ({
        ...pictures,
        ...{ pfp: pictures.pfp, wp: url },
      }));
    };
    if (exist && pictures.pfp != avatar) fetchPFP();
    if (exist && pictures.wp != wallpaper) fetchWp();
    setLoading(false);
  }, []);

  if (!exist)
    return <p className='text-xl  text-red-600 mt-[400px]'>Player does not exist!</p>
  if (isLoading) return <p>Loading...</p>;
  if (!isLoading && exist) {
    return (
      <div className="flex w-full flex-col items-center gap-10 xl:gap-[100px]">
        <div
          className="mt-[20px] flex w-11/12 flex-col justify-center
          rounded-3xl bg-[#2F3B78] md:max-xl:w-5/6 xl:mt-[100px] xl:w-[1000px]"
        >
          <img
            src={pictures.wp}
            alt="wallpaper"
            id="wallpaper-holder"
            className=" h-[160px]  min-h-[80px] w-full 
                min-w-[200px] rounded-t-3xl sm:h-[220px]  xl:h-[250px]"
          />
          <div className="mb-5 flex flex-col items-center xl:flex-row">
            <div className="flex w-full items-start justify-center  xl:w-1/3 ">
              <strong
                id="titleUser"
                className="   p-1 text-xs 
                   leading-3 text-white xl:hidden"
              >
                the title
              </strong>
              {/* player info  */}
              <div className="block">
                {/* image  */}
                <div className="-mt-[120px] flex xl:-mt-[150px]">
                  <img
                    src={pictures.pfp}
                    alt="pfp"
                    id="pfp-holder"
                    className="pfp absolute h-[130px] w-[120px] 
                             translate-x-[20px] translate-y-[28px] 
                            xl:h-[150px] xl:w-[130px] xl:translate-x-[25px] 
                            xl:translate-y-[31px]"
                  />
                  <svg
                    className="progress blue  z-10 h-[170px] w-[150px] 
                      shrink-0 xl:h-[200px] xl:w-[170px]"
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
                <div className=" flex flex-col text-center text-white  xl:pl-6  xl:text-start">
                  <strong className="w-[155px]">
                    {firstname + ' ' + lastname}
                  </strong>
                  <span className=" text-gray-400">{'@' + nickname}</span>
                </div>
              </div>
              <div className="flex flex-col gap-[43px] ">
                <span className="text-[7px]  text-gray-400">
                  {'MEMBER SINCE: ' + joinAt}
                </span>
                <strong
                id="titleUser"
                className="  hidden  text-sm
                   text-white outline-none focus:border-black  
                 xl:flex"
              >
                the title
              </strong>
      
              </div>
            </div>
            {/* player state  */}
            <div
              className="mt-2 flex w-full items-center justify-around 
                  gap-10  text-xs sm:items-end
                   md:text-sm  xl:w-2/3"
            >
              <div className="flex flex-col  gap-4 sm:flex-row sm:gap-10">
                <div className="flex items-center gap-2 ">
                  <img
                    src="/King.svg"
                    alt="rankIcon"
                    className="w-[45px] md:w-[64px]"
                  ></img>
                  <div className="flex  flex-col ">
                    <strong className="  text-gray-100">GOLD</strong>
                    <span className=" text-gray-400">Ranking</span>
                  </div>
                </div>
                <div className="flex items-center  gap-2">
                  <img
                    src="/coin.svg"
                    alt="coinIcon"
                    // width={36}
                    // height={36}
                    className="w-[27px] md:w-[36px]"
                  ></img>
                  <div className="flex  flex-col ">
                    <strong className="  text-gray-100">{coins + ' ₳'} </strong>
                    <span className=" text-gray-400">cache earned</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col  gap-4 sm:flex-row sm:gap-10">
                <div className="flex items-center gap-2">
                  <img
                    src="/star.svg"
                    alt="startIcon"
                    // width={36}
                    // height={36}
                    className="w-[27px] md:w-[36px]"
                  ></img>
                  <div className="flex  flex-col ">
                    <strong className="  text-gray-100">1800/2500 XP</strong>
                    <span className=" text-gray-400">player XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/champion.svg"
                    alt="champIcon"
                    // width={36}
                    // height={36}
                    className="w-[27px] md:w-[36px]"
                  ></img>
                  <div className="flex  flex-col ">
                    <strong className="  text-gray-100">91 %</strong>
                    <span className=" text-gray-400">win ratio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex  w-11/12 flex-col justify-center rounded-3xl 
          bg-[#2F3B78] md:max-xl:w-5/6  xl:w-[1000px]"
        >
          <div
            className="flex border-2 border-t-0 border-l-0 border-r-0 
                  border-gray-100 border-opacity-70 p-2 text-sm text-[#8BD9FF]"
          >
            <button
              className="flex  h-[60px] w-1/4 items-center 
                       justify-center  border-2 border-t-0 
                       border-l-0 border-b-0 border-gray-100 
                       border-opacity-70 transition-all"
            >
              <FriendIcon />
              <span className="friend-text invisible absolute opacity-0 transition-all">
                Friends
              </span>
            </button>
            <button
              className="flex h-[60px] w-1/4 items-center 
                       justify-center  border-2 
                        border-t-0 border-l-0 border-b-0 border-gray-100 
                        border-opacity-70 transition-all "
            >
              <AchievementIcon />
              <span className="friend-text invisible absolute opacity-0 transition-all ">
                Achievement
              </span>
            </button>
            <button
              className="flex h-[60px] w-1/4 items-center 
                        justify-center  border-2 border-t-0 
                        border-l-0 border-b-0  border-gray-100 
                        border-opacity-70 transition-all"
            >
              <MatchHistoryIcon />
              <span className="friend-text invisible absolute text-xs opacity-0 transition-all">
                Match History
              </span>
            </button>
            <button
              className="flex h-[60px] w-1/4 items-center 
                      justify-center border-2  border-t-0 
                      border-r-0 border-l-0 border-b-0  border-gray-100 
                      border-opacity-70 transition-all "
            >
              <RankingIcon />
              <span className="friend-text invisible absolute opacity-0 transition-all">
                Ranking
              </span>
            </button>
          </div>
          <div className=" flex h-[200px] overflow-auto md:h-[400px] "></div>
        </div>
      </div>
    );
  }
}

export async function getServerSideProps({ params, req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST +
        '/players/data?' +
        new URLSearchParams({ nickname: params.user }),
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      },
    );
    const data = await res.json();
    if (!data.player)
      return {
        props: {
          exist: false,
        },
      };
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    console.log(data);
    const date = new Intl.DateTimeFormat('en-US', options).format(
      new Date(data.player.joinAt),
    );
    return {
      // modify this to return anything you want before your page load
      props: {
        nickname: data.player.nickname,
        firstname: data.player.firstname,
        lastname: data.player.lastname,
        coins: data.player.coins,
        avatar: data.player.avatar,
        wallpaper: data.player.wallpaper,
        joinAt: date,
        exist:true,
      },
    };
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

UserProfile.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default UserProfile;
