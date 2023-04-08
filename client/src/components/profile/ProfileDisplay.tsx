import { EditIconProfile, EditIconWallpaper } from '../icons/Icons';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import AvatarProfileComp from './Avatar';
import { AvatarLevelCounter } from '../icons/Icons';
import TitlesComp from './Titles';
import PlayerProgress from './States/Progress';
interface profileProps {
  wp: string;
  pfp: string;
  titles: Array<string>;
  defaultTitle?: string;
  fullname: string;
  nickname: string;
  joinDate: string;
  coins: number;
  exp: number;
  MaxExp: number;
  userProfile: boolean;
}

function ProfileDisplay({
  wp,
  pfp,
  titles,
  defaultTitle,
  fullname,
  nickname,
  joinDate,
  coins,
  exp,
  MaxExp,
  userProfile,
}: profileProps) {
  const [error, setError] = useState(false);
  const [errorSize, setErrorSize] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleWpChange(event: React.ChangeEvent) {
    const wallpaper = (event.target as HTMLInputElement).files?.[0];
    if (wallpaper) {
      if (wallpaper.size > 1024 * 1024 * 2) {
        setErrorSize(true);
        setTimeout(() => {
          setErrorSize(false);
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
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
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
        // if (divErr) divErr.innerHTML = 'File must be 2MB Large!';
        setErrorSize(true);
        setTimeout(() => {
          setErrorSize(false);
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
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
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
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute -mb-12 w-[300px] rounded
            border border-red-400 bg-red-600 px-4 py-3 text-center`}
          >
            <strong id="err-profile" className="font-bold">
              An Error has occurred!
            </strong>
          </motion.div>
        )}
        {errorSize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute -mb-12 w-[300px] rounded
            border border-red-400 bg-red-600 px-4 py-3 text-center`}
          >
            <strong id="err-profile" className="font-bold">
              Image size must be 2mb!
            </strong>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute -mb-12 w-[300px] rounded border border-teal-500 bg-lime-500
            px-4  py-3 text-center text-teal-900 shadow-md `}
          >
            <strong id="succ-profile" className="font-bold">
              Updated Successfully!
            </strong>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="mt-[20px] flex w-11/12 flex-col justify-center
        rounded-3xl bg-[#2F3B78] md:max-xl:w-5/6 xl:mt-[100px] xl:w-[1000px]"
      >
        <div className="flex justify-end">
          <img
            src={wp}
            alt="wallpaper"
            id="wallpaper-holder"
            className="h-[160px] min-h-[80px] w-full 
            min-w-[200px] rounded-t-3xl sm:h-[220px] xl:h-[250px]"
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
        <div className="mb-5 flex flex-col items-center xl:flex-row">
          <div className="flex w-full items-start justify-center  xl:w-1/3 ">
            {userProfile ? (
              <TitlesComp
                titles={titles}
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
            <div className=" block ">
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
                shrink-0 xl:h-[200px] xl:w-[170px]"
              />

              <div className="flex flex-col text-center text-white xl:pl-6 xl:text-start">
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
                    titles={titles}
                    cssProps="hidden rounded-lg border-white bg-[#2C3B7C] p-1 text-[10px] 
                  leading-3 text-white outline-none focus:border-black  
                  focus:outline-none focus:ring-black xl:flex"
                  />
                </>
              ) : (
                <div className="flex flex-col gap-[43px] ">
                  <span className="text-[7px] text-gray-400 ">
                    {'MEMBER SINCE: ' + joinDate}
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
