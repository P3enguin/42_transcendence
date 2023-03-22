import Layout from '@/components/layout/layout';
import { useState } from 'react';
import { useEffect } from 'react';
import ProfileDisplay from '@/components/profile/ProfileDisplay';
import ProfileStats from '@/components/profile/ProfileStats';


<<<<<<< HEAD
                  <path
                    className="fill"
                    d="M689.793 276.77C702.297 298.428 702.297 325.112 689.793 346.77L550.207 588.54C537.703 610.198 514.594 623.54 489.585 623.54H210.415C185.406 623.54 162.297 610.198 149.793 588.54L10.2071 346.77C-2.2971 325.112 -2.29708 298.428 10.2072 276.77L149.793 35.0001C162.297 13.3419 185.406 0 210.415 0H489.585C514.594 0 537.703 13.342 550.207 35.0001L689.793 276.77Z"
                  ></path>
                </svg>
              </div>
              <div className="text-white flex flex-col items-center">
                <h1>PLAYER FULL NAME</h1>
                <span>@nickname</span>
              </div>
            </div>
            <div>
              <span className="text-[8px]  text-gray-400">
                MEMBER SINCE:08 JAN 2023
              </span>
              <select
                id="title"
                className=" text-xs  xl:flex hidden bg-[#2C3B7C] text-white 
                   border-white  rounded-lg   outline-none focus:border-black  
                    focus:outline-none focus:ring-black  p-1"
              >
                <option
                  value="select a title"
                  defaultValue={"select a title"}
                  disabled
                  hidden
                >
                  select a title
                </option>
                <option value="title1">title1</option>
                <option value="title2">title2</option>
                <option value="title3">title3</option>
              </select>
            </div>
          </div>
          {/* player state  */}
          <div className="xl:w-2/3 w-full flex justify-evenly items-center ">
            <div className="flex  items-center">
              <img
                src="rankGold.svg"
                alt="rankIcon"
                width={60}
                height={36}
              ></img>
              <div className="flex  flex-col ">
                <strong className=" text-gray-100 text-sm">GOLD</strong>
                <span className="text-gray-400 text-xs">Ranking</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="coin.svg" alt="coinIcon" width={36} height={36}></img>
              <div className="flex  flex-col ">
                <strong className=" text-gray-100 text-sm">1646 ₳</strong>
                <span className="text-gray-400 text-xs">cache earned</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="star.svg" alt="startIcon" width={36} height={36}></img>
              <div className="flex  flex-col ">
                <strong className=" text-gray-100 text-sm">1800/2500 XP</strong>
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
      <div
        className="flex flex-col justify-center rounded-3xl bg-[#2F3B78] 
              w-full md:max-3xl:w-4/6  3xl:w-1/2 "
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
        <div className="h-[600px]"></div>
=======
interface player {
  nickname: string;
  firstname: string;
  lastname: string;
  coins: number;
  avatar: string;
  wallpaper: string;
  joinDate: string;
}

function PlayerProfile({
  nickname,
  firstname,
  lastname,
  coins,
  avatar,
  wallpaper,
  joinDate,
}: player) {
  const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  const [isLoading, setLoading] = useState(true);
  const titles = ['hh', 'hh2', 'hh3'];

  // fetching profile picture and wallpaper picture at first render
  useEffect(() => {
    const fetchPFP = async () => {
      setLoading(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST +
          '/players/avatar?' +
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
        process.env.NEXT_PUBLIC_BACKEND_HOST +
          '/players/wallpaper?' +
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
    if (pictures.pfp != avatar) fetchPFP();
    if (pictures.wp != wallpaper) fetchWp();
    setLoading(false);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!isLoading) {
    return (
      <div className=" flex w-full flex-col items-center gap-10 xl:gap-[100px]">
        <ProfileDisplay
          wp={pictures.wp}
          pfp={pictures.pfp}
          titles={titles}
          fullname={firstname + ' ' + lastname}
          nickname={nickname}
          joinDate={joinDate}
          coins={coins}
        />
        <ProfileStats />
>>>>>>> origin/dev
      </div>
    );
  }
}

export async function getServerSideProps({ req }: any) {
  // fetching all data :

  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/data',
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      },
    );
    const data = await res.json();

    const timeFormat: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    console.log(data);
    const date = new Intl.DateTimeFormat('en-US', timeFormat).format(
      new Date(data.player.joinAt));
    return {
      // modify this to return anything you want before your page load
      props: {
        nickname: data.player.nickname,
        firstname: data.player.firstname,
        lastname: data.player.lastname,
        coins: data.player.coins,
        avatar: data.player.avatar,
        wallpaper: data.player.wallpaper,
        joinDate: date,
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

PlayerProfile.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default PlayerProfile;
