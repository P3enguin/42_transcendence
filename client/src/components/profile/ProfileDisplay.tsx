import { EditIconProfile, EditIconWallpaper } from '../icons/Icons';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AvatarProfileComp from './Avatar';
import {
  AvatarLevelCounter,
  AddFriendIcon,
  CancelIcon,
  IsFriendIcon,
} from '../icons/Icons';
import TitlesComp from './Titles';
import PlayerProgress from './States/Progress';
import Success from '../tools/Reply/Success';
import Error from '../tools/Reply/Error';
interface profileProps {
  wp: string;
  pfp: string;
  defaultTitle?: string;
  fullname: string;
  nickname: string;
  joinDate: string;
  coins: number;
  exp: number;
  MaxExp: number;
  userProfile: boolean;
  isFriend?: boolean;
  requestFriend?: {
    status: string | undefined;
    id: string | undefined;
  };
  setRequest?: Dispatch<
    SetStateAction<{
      status: string | undefined;
      id: string | undefined;
    }>
  >;
}

function ProfileDisplay({
  wp,
  pfp,
  fullname,
  nickname,
  joinDate,
  coins,
  exp,
  MaxExp,
  userProfile,
  requestFriend,
  setRequest,
  isFriend,
}: profileProps) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reply, setreply] = useState('');

  async function SendFriendRequest(event: React.MouseEvent) {
    event.preventDefault();
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/addRequest',
      {
        method: 'POST',
        body: JSON.stringify({ receiver: nickname }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );
    if (response.ok) {
      const result = await response.json();
      const updatedValue = { status: 'pending', id: result.requestId };
      setRequest?.(updatedValue);
      setreply('Friend Request Sent !');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return;
    } else {
      setreply('Failed to send Friend Request');
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }

  async function CancelFriendRequest(event: React.MouseEvent) {
    event.preventDefault();
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/cancelRequest',
      {
        method: 'POST',
        body: JSON.stringify({ requestId: requestFriend?.id }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );
    if (response.ok) {
      const updatedValue = { status: undefined, id: undefined };
      setRequest?.(updatedValue);
      setreply('Request has been cancelled!');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return;
    } else {
      setreply('Failed to cancel  Friend Request');
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }

  async function handleWpChange(event: React.ChangeEvent) {
    const wallpaper = (event.target as HTMLInputElement).files?.[0];
    if (wallpaper) {
      if (wallpaper.size > 1024 * 1024 * 2) {
        setreply('Image size is over 2mb !');
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
        return;
      }

      let formData = new FormData();
      formData.append('file', wallpaper);
      const url = process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/wallpaper';

      const resp = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (resp.ok) {
        const pfp = document.getElementById(
          'wallpaper-holder',
        ) as HTMLImageElement;
        if (wp) window.URL.revokeObjectURL(pfp.src);
        pfp.src = window.URL.createObjectURL(wallpaper);
        setreply('Wallpaper updated!');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setreply('Failed to upload!');
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    }
  }

  async function handlePfpChange(event: React.ChangeEvent) {
    const avatar = (event.target as HTMLInputElement).files?.[0];
    if (avatar) {
      if (avatar.size > 1024 * 1024 * 2) {
        setreply('Image size is over 2mb !');
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
        return;
      }

      let formData = new FormData();
      formData.append('file', avatar);
      const url = process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/avatar';

      const resp = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (resp.ok) {
        const pfp = document.getElementById('pfp-holder') as HTMLImageElement;
        if (wp) window.URL.revokeObjectURL(pfp.src);
        pfp.src = window.URL.createObjectURL(avatar);
        setSuccess(true);
        setreply('Avatar updated !');
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setreply('Failed to upload!');
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    }
  }
  useEffect(() => {
    // 2160 => max Exp of the current user
    const max = 2160;
    // currentExp is the exp converted to Its stroke value in css
    const currentExp = max - (exp * max) / MaxExp;
    const barProgrss = document.querySelector('.fill');
    if (barProgrss)
      barProgrss.setAttribute('style', 'stroke-dashoffset: ' + currentExp);
  });
  return (
    <>
      <AnimatePresence>
        {error && <Error reply={reply} />}
        {success && <Success reply={reply} />}
      </AnimatePresence>
      <div
        className="relative mt-[20px] flex w-11/12 flex-col justify-center
        rounded-3xl bg-[#2F3B78] md:max-xl:w-5/6  xl:w-[1100px]"
      >
        <div className="flex justify-end">
          <img
            src={wp}
            alt="wallpaper"
            id="wallpaper-holder"
            className="h-[160px] min-h-[80px] w-full min-w-[200px] 
             rounded-t-3xl object-cover object-center sm:h-[220px] xl:h-[250px]"
          />
          {userProfile && (
            <label
              htmlFor="wallpaper"
              className="absolute mt-5 mr-5 cursor-pointer"
            >
              <EditIconWallpaper />
            </label>
          )}
        </div>
        <input
          className="hidden cursor-pointer"
          name="wallpaper"
          id="wallpaper"
          type="file"
          accept="image/*"
          onChange={handleWpChange}
        />
        <div className="relative mb-5 flex flex-col items-center xl:flex-row">
          <div className="flex w-full items-start  justify-center xl:w-[400px] ">
            {userProfile ? (
              <TitlesComp
                cssProps="rounded-lg border-white bg-[#2C3B7C] p-1  text-[6px] leading-3
                text-white outline-none focus:border-black focus:outline-none  
                focus:ring-black sm:text-[10px]  xl:hidden"
              />
            ) : (
              <strong
                id="titleUser"
                className=" w-[100px] text-end  text-xs
                 leading-3 text-white xl:hidden"
              >
                the title
              </strong>
            )}
            <div className="block">
              <div className="absolute z-40 translate-x-[102px] xl:translate-x-[120px] xl:translate-y-[-8px] ">
                <AvatarLevelCounter
                  id="GradientLevel"
                  track="track2"
                  fill="fill2"
                  cssProps="progress blue absolute z-10 
                  h-[40px] w-[35px] shrink-0 translate-x-[-4px] translate-y-[-5px]"
                />
                <div
                  className="level absolute flex
                  h-[33px] w-[29px] items-center justify-center rounded-full  bg-[#2C3B7C]"
                >
                  2
                </div>
              </div>
              <AvatarProfileComp
                pfp={pfp}
                EditIcon={userProfile}
                handlePfpChange={handlePfpChange}
                id="GradientCounter"
                track="track"
                fill="fill"
                cssProps="progress blue z-10 h-[170px] w-[150px] 
                shrink-0 xl:h-[200px] xl:w-[170px] object-cover object-center"
              />

              <div className="flex flex-col text-center text-white xl:ml-2 xl:text-center">
                <strong className="w-[155px]">{fullname}</strong>
                <span className=" text-gray-400">{'@' + nickname}</span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-end gap-[50px]">
              {userProfile ? (
                <>
                  <span className="text-[7px] text-gray-400 ">
                    {'MEMBER SINCE: ' + joinDate}
                  </span>
                  <TitlesComp
                    cssProps="hidden rounded-lg border-white bg-[#2C3B7C] p-1 text-[10px] 
                  leading-3 text-white outline-none focus:border-black  
                  focus:outline-none focus:ring-black xl:flex"
                  />
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-[43px] xl:w-[200px]">
                    <span className="text-[7px] text-gray-400 ">
                      {'MEMBER SINCE: ' + joinDate}
                    </span>
                    <div className="flex flex-row justify-between gap-1">
                      <strong
                        id="titleUser"
                        className="  hidden  items-center text-sm
                      text-white outline-none focus:border-black  
                      xl:flex"
                      >
                        the title
                      </strong>
                      {!requestFriend?.status && !isFriend ? (
                        <button
                          onClick={SendFriendRequest}
                          type="button"
                          className=" left-20  flex gap-1 rounded-lg bg-[#102272]
                          px-2  py-1 text-xs 
                          font-medium text-white hover:bg-[#0e1949] focus:outline-none"
                        >
                          Add friend <AddFriendIcon />
                        </button>
                      ) : requestFriend?.status === 'pending' ? (
                        <>
                          <button
                            onClick={CancelFriendRequest}
                            type="button"
                            className=" left-20 flex  items-center rounded-lg bg-red-700
                                      px-2  py-1 text-xs font-medium text-white hover:bg-red-600 focus:outline-none"
                          >
                            Cancel Request <CancelIcon />
                          </button>
                        </>
                      ) : requestFriend?.status === 'accepted' || isFriend ? (
                        <>
                          <div
                            className=" left-20 flex  items-center rounded-lg bg-[#39ce77]
                                    px-2  py-1 text-xs font-medium text-white "
                          >
                            Friend <IsFriendIcon />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* player progress  */}
          <PlayerProgress coins={coins} />
        </div>
      </div>
    </>
  );
}

export default ProfileDisplay;
