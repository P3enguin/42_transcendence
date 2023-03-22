import { EditIconProfile, EditIconWallpaper } from '../icons/Icons';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
interface profileProps {
  wp: string;
  pfp: string;
  titles: Array<string>;
  fullname: string;
  nickname: string;
  joinDate: string;
  coins: number;
}

function ProfileDisplay({
  wp,
  pfp,
  titles,
  fullname,
  nickname,
  joinDate,
  coins,
}: profileProps) {
  const [error, setError] = useState(false);
  const [errorSize, setErrorSize] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleWpChange(event: any) {
    // const divErr = document.getElementById('err-profile');
    if (event.target.files[0]) {
      if (event.target.files[0].size > 1024 * 1024 * 2) {
        // if (divErr) divErr.innerHTML = 'File must be 2MB Large!';
        setErrorSize(true);
        setTimeout(() => {
          setErrorSize(false);
        },3000);
        return;
      }

      const pfpImg = event.target.files[0];
      let formData = new FormData();
      formData.append('file', pfpImg);
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
          pfp.src = window.URL.createObjectURL(event.target.files[0]);
          // const div = document.getElementById('succ-profile');
          // if (div) div.innerHTML = 'Wallpaper Updated successfully!';
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          },3000);
      } else {
        // if (divErr) divErr.innerHTML = 'An Error Has Occured!';
        setError(true);
        setTimeout(() => {
          setError(false);
        },3000);
      }
    }
  }

  async function handlePfpChange(event: any) {
    if (event.target.files[0]) {
      if (event.target.files[0].size > 1024 * 1024 * 2) {
        // if (divErr) divErr.innerHTML = 'File must be 2MB Large!';
        setErrorSize(true);
        setTimeout(() => {
          setErrorSize(false);
        },3000);
        return;
      }

      const pfpImg = event.target.files[0];
      let formData = new FormData();
      formData.append('file', pfpImg);
      const url = process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/avatar';

      const resp = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (resp.ok) {
        const pfp = document.getElementById(
          'pfp-holder',
          ) as HTMLImageElement;
          if (wp) window.URL.revokeObjectURL(pfp.src);
          pfp.src = window.URL.createObjectURL(event.target.files[0]);
          // const div = document.getElementById('succ-profile');
          // if (div) div.innerHTML = 'Wallpaper Updated successfully!';
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          },3000);
      } else {
        // if (divErr) divErr.innerHTML = 'An Error Has Occured!';
        setError(true);
        setTimeout(() => {
          setError(false);
        },3000);
      }
    }
  }
  return (
    <>
      <AnimatePresence>
        {
          error && 
        <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
            className={`relative -mb-12 w-[300px] rounded border
              border-red-400 bg-red-600 px-4 py-3 text-center }`}
          >
            <strong id="err-profile" className="font-bold">
            An Error has occurred!
            </strong>
          </motion.div>
        }
      {
        errorSize && 
        <motion.div
              initial={{opacity:0}}
              animate={{opacity:1}}
              exit={{opacity:0}}
          className={`relative -mb-12 w-[300px] rounded border
            border-red-400 bg-red-600 px-4 py-3 text-center }`}
        >
          <strong id="err-profile" className="font-bold">
          Image size must be 2mb!
          </strong>
        </motion.div>
      }
        {
          success &&
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}

            className={`  -mb-12 w-[300px] rounded border border-teal-500 bg-lime-500
            px-4  py-3 text-center text-teal-900 shadow-md `}
          >
            <strong id="succ-profile" className="font-bold">
            Updated Successfully!
            </strong>
          </motion.div>
        }
      </AnimatePresence>
      <div
        className="mt-[20px] flex w-11/12 flex-col justify-center
        rounded-3xl bg-[#2F3B78] md:max-xl:w-5/6 xl:mt-[100px] xl:w-[1000px]"
      >
        <div className="flex justify-end">
          <label
            htmlFor="wallpaper"
            className="absolute mt-5 mr-5 cursor-pointer"
          >
            <EditIconWallpaper />
          </label>
          <img
            src={wp}
            alt="wallpaper"
            id="wallpaper-holder"
            className=" h-[160px]  min-h-[80px] w-full 
                min-w-[200px] rounded-t-3xl sm:h-[220px]  xl:h-[250px]"
          />
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
            <select
              id="title"
              className="rounded-lg border-white bg-[#2C3B7C]  p-1 text-[10px] 
                 leading-3 text-white outline-none focus:border-black  
                  focus:outline-none focus:ring-black  xl:hidden"
            >
              <option
                value="select a title"
                defaultValue={'select a title'}
                disabled
                id="titles"
                hidden
              >
                select a title
              </option>
              {titles.map((elem, index) => (
                <option key={index} value={elem}>
                  {elem}
                </option>
              ))}
            </select>
            {/* player info  */}
            <div className="block">
              {/* image  */}
              <div className="-mt-[120px] flex xl:-mt-[150px]">
                <img
                  src={pfp}
                  alt="pfp"
                  id="pfp-holder"
                  className="pfp absolute z-0 h-[130px] 
                            w-[120px] translate-x-[20px] 
                            translate-y-[28px] xl:h-[150px] xl:w-[130px] 
                            xl:translate-x-[25px] xl:translate-y-[31px]"
                />
                <label
                  htmlFor="pfp"
                  className="absolute  z-20  mt-14  ml-28  cursor-pointer xl:mt-[70px] xl:ml-[130px]"
                >
                  <EditIconProfile />
                </label>
                <input
                  className="hidden cursor-pointer"
                  name="pfp"
                  id="pfp"
                  type="file"
                  accept="image/*"
                  onChange={handlePfpChange}
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
                <strong className="w-[155px]">{fullname}</strong>
                <span className=" text-gray-400">{'@' + nickname}</span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-end gap-[50px] ">
              <span className="text-[7px]  text-gray-400">
                {'MEMBER SINCE: ' + joinDate}
              </span>
              <select
                id="title"
                className="hidden rounded-lg border-white bg-[#2C3B7C] p-1 text-[10px] 
                 leading-3  text-white outline-none focus:border-black  
                  focus:outline-none focus:ring-black xl:flex"
              >
                <option
                  value="select a title"
                  defaultValue={'select a title'}
                  disabled
                  hidden
                >
                  select a title
                </option>
                {titles.map((elem, index) => (
                  <option key={index} value={elem}>
                    {elem}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* player state  */}
          <div
            className="mt-2 flex w-full items-center justify-around 
                gap-10  text-[12px] sm:items-end
                 md:text-sm  xl:w-2/3"
          >
            <div className="flex flex-col  gap-4 sm:flex-row sm:gap-10">
              <div className="flex items-center gap-2 ">
                <img
                  src="King.svg"
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
                  src="coin.svg"
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
                  src="star.svg"
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
                  src="champion.svg"
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
    </>
  );
}

export default ProfileDisplay;
