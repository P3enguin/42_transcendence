import { EditIconProfile, EditIconWallpaper } from '../icons/Icons';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AvatarProfileComp from './Avatar';
import AddFriend from './Button/Buttons';
import Image from 'next/image';
import Router from 'next/router';
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
  rankId: number;
  winRatio: string;
  level: number;
  blockedByFriend?: boolean;
  blockedByPlayer?: boolean;
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
  rankId,
  winRatio,
  level,
  blockedByFriend,
  blockedByPlayer,
}: profileProps) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reply, setreply] = useState('');

  console.log(requestFriend);

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
      try {
        const resp = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (resp.ok) {
          setreply('Wallpaper updated!');
          setSuccess(true);
          Router.reload();
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
      } catch (error) {
        console.log('An error has occurred');
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
      try {
        const resp = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (resp.ok) {
          setreply('Avatar updated !');
          setSuccess(true);
          Router.reload();
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
      } catch (error) {
        console.log('An error has occurred');
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
          <Image
            width={700}
            height={160}
            src={wp}
            sizes="100vw"
            alt="wallpaper"
            id="wallpaper-holder"
            className="h-[160px] min-h-[80px] w-full min-w-[200px]
             rounded-t-3xl object-cover object-center sm:h-[220px] xl:h-[250px]"
          />
          {userProfile && (
            <label
              htmlFor="wallpaper"
              className="absolute mr-5 mt-5 cursor-pointer"
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
                className=" text-xs w-[100px]  text-end
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
                  {level}
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
                      <AddFriend
                        nickname={nickname}
                        isFriend={isFriend}
                        blockedByPlayer={blockedByPlayer}
                        blockedByFriend={blockedByFriend}
                        requestFriend={requestFriend}
                        setRequest={setRequest}
                        setreply={setreply}
                        setSuccess={setSuccess}
                        setError={setError}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* player progress  */}
          <PlayerProgress
            coins={coins}
            rankId={rankId}
            winRatio={winRatio}
            exp={exp}
            maxExp={MaxExp}
          />
        </div>
      </div>
    </>
  );
}

export default ProfileDisplay;
