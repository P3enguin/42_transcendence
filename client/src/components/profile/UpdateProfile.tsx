import Image from 'next/image';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import {
  EditIconProfile,
  EditIconWallpaper,
  SvgShapingMethod,
} from '../icons/Icons';
import Router from 'next/router';
import { data, statObj } from '../tools/Interface';
import {
  FirstNameInput,
  LastNameInput,
  NickNameInput,
  PasswordInput,
} from '../Input/Inputs';
import {
  isBetween,
  isValidName,
  isTooLong,
  isEmpty,
  isClear,
  isStrong,
} from './ValidationFuncs';

function UpdateProfile({
  email,
  firstName,
  lastName,
  image,
  coins,
}: {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  coins: number;
}) {
  const [wallpaper, setWallpaper] = useState('/wallpaper.png');
  const [avatar, setAvatar] = useState('/pfp1.png');
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nickname = (document.getElementById('nickname') as HTMLInputElement)
      .value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const firstname = (document.getElementById('firstname') as HTMLInputElement)
      .value;
    const lastname = (document.getElementById('lastname') as HTMLInputElement)
      .value;
    if (nickname && password && firstName && lastName) {
      const data: data = {
        nickname: nickname,
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        coins: coins,
      };
      const singupURL: string =
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/signup';
      try {
        const response = await fetch(singupURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        if (response.status == 201) {
          if (uploads.pfp) {
            const avatar = (document.getElementById('pfp') as HTMLInputElement)
              .files?.[0];
            if (avatar) {
              let formData = new FormData();
              formData.append('file', avatar);

              try {
                const url =
                  process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/players/avatar';
                const resp = await fetch(url, {
                  method: 'POST',
                  body: formData,
                  credentials: 'include',
                });
              } catch (error) {
                console.log('An error has occurred');
              }
            }
          }
          if (uploads.wp) {
            const wallpaper = (
              document.getElementById('wallpaper') as HTMLInputElement
            ).files?.[0];
            if (wallpaper) {
              let formData = new FormData();
              formData.append('file', wallpaper);
              const url =
                process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/players/wallpaper';
              try {
                const resp = await fetch(url, {
                  method: 'POST',
                  body: formData,
                  credentials: 'include',
                });
              } catch (error) {
                console.log('An error has occurred');
              }
            }
          }
          Router.push('/profile');
        } else if (response.status == 401) {
          const err = await response.json();
          if (err.error === 'Nickname already exist') {
            const span = document.getElementById('nickspan');
            updateField(
              2,
              { valid: false, touched: state[2].touched },
              span,
              err.error,
            );
          } else {
            const span = document.getElementById('wp-span');
            // to check later ,
            if (span) span.innerHTML = err;
          }
        }
      } catch (error) {
        console.log('An error has occurred');
      }
    }
  }
  // stats for error handling
  const [state, updateState] = useState([
    { valid: true, touched: false },
    { valid: true, touched: false },
    { valid: false, touched: false },
    { valid: false, touched: false },
    { valid: true, touched: false },
    { valid: true, touched: false },
  ]);
  // state for the button
  const [isEnabled, setEnabled] = useState(false);

  // state for image upload
  const [uploads, handleImage] = useState({ pfp: false, wp: false });

  function updateField(
    index: number,
    val: statObj,
    span: HTMLElement | null,
    error: string,
  ) {
    const newState = state.map((elem, i) => {
      if (i == index) return val;
      else return elem;
    });
    updateState(newState);
    if (span) span.innerHTML = error;
  }

  function validFirstName(event: React.ChangeEvent<HTMLInputElement>) {
    const first_name: string = event.target.value;
    const span = document.getElementById('fnspan');
    var touched = state[0].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    if (isEmpty(first_name)) {
      updateField(
        0,
        { valid: false, touched: touched },
        span,
        'First name cannot be empty!',
      );
    } else if (isTooLong(first_name)) {
      updateField(
        0,
        { valid: false, touched: touched },
        span,
        'Input is too long!',
      );
    } else if (!isValidName(first_name)) {
      updateField(
        0,
        { valid: false, touched: touched },
        span,
        'first name contains forbidden characters!',
      );
    } else {
      updateField(0, { valid: true, touched: touched }, null, '');
    }
  }

  function validLastName(event: React.ChangeEvent<HTMLInputElement>) {
    const last_name: string = event.target.value;
    const span = document.getElementById('lnspan');
    var touched = state[1].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    if (isEmpty(last_name)) {
      updateField(
        1,
        { valid: false, touched: touched },
        span,
        'Last name cannot be empty!',
      );
    } else if (isTooLong(last_name)) {
      updateField(
        1,
        { valid: false, touched: touched },
        span,
        'Input is too long!',
      );
    } else if (!isValidName(last_name)) {
      updateField(
        1,
        { valid: false, touched: touched },
        span,
        'Last name contains forbidden characters!',
      );
    } else {
      updateField(1, { valid: true, touched: touched }, null, '');
    }
  }

  function validNickName(event: React.ChangeEvent<HTMLInputElement>) {
    const nick_name: string = event.target.value;
    const span = document.getElementById('nickspan');
    var touched = state[2].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    if (isEmpty(nick_name)) {
      updateField(
        2,
        { valid: false, touched: touched },
        span,
        'Nickname cannot be empty!',
      );
    } else if (!isBetween(nick_name, 3, 16)) {
      updateField(
        2,
        { valid: false, touched: touched },
        span,
        'Nickname should be (3-16) character long!',
      );
    } else if (!isClear(nick_name)) {
      updateField(
        2,
        { valid: false, touched: touched },
        span,
        'Nickname contains forbidden characters!',
      );
    } else {
      updateField(2, { valid: true, touched: touched }, null, '');
    }
  }

  function validPassword(event: React.ChangeEvent<HTMLInputElement>) {
    const password: string = event.target.value;
    const span = document.getElementById('pwdspan');
    var touched = state[3].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    if (isEmpty(password)) {
      updateField(
        3,
        { valid: false, touched: touched },
        span,
        'Password cannot be empty!',
      );
    } else if (!isStrong(password)) {
      updateField(
        3,
        { valid: false, touched: touched },
        span,
        'Password is too weak!',
      );
    } else {
      updateField(3, { valid: true, touched: touched }, null, '');
    }
  }

  function handlePfpChange(event: React.ChangeEvent) {
    const span = document.getElementById('pfp-span');
    const avatar = (event.target as HTMLInputElement).files?.[0];
    if (avatar) {
      if (avatar.size > 1024 * 1024 * 2) {
        updateField(
          5,
          { valid: false, touched: false },
          span,
          'File must be 2MB Large!',
        );
        return;
      }
      const pfp = document.getElementById('pfp-holder') as HTMLImageElement;
      if (uploads.pfp) window.URL.revokeObjectURL(pfp.src);
      setAvatar(window.URL.createObjectURL(avatar));
      handleImage((item) => ({
        ...item,
        ...{ pfp: true, wp: uploads.wp },
      }));
      updateField(5, { valid: true, touched: false }, null, '');
    }
  }

  function handleWpChange(event: React.ChangeEvent) {
    const span = document.getElementById('wp-span');
    const wallpaper = (event.target as HTMLInputElement).files?.[0];
    if (wallpaper) {
      if (wallpaper.size > 1024 * 1024 * 2) {
        updateField(
          4,
          { valid: false, touched: false },
          span,
          'File must be 2MB Large!',
        );
        return;
      }
      const pfp = document.getElementById(
        'wallpaper-holder',
      ) as HTMLImageElement;
      if (uploads.wp) window.URL.revokeObjectURL(pfp.src);
      setWallpaper(window.URL.createObjectURL(wallpaper));
      handleImage((item) => ({
        ...item,
        ...{ pfp: uploads.pfp, wp: true },
      }));
      updateField(4, { valid: true, touched: false }, null, '');
    }
  }

  function allTrue(elem: statObj) {
    return elem.valid ? true : false;
  }
  // To add default value of First Name and Last Name

  useEffect(() => {
    if (state.every(allTrue)) setEnabled(true);
    else setEnabled(false);
  }, [state]);

  return (
    <div className="mg-top w-5/6 max-w-4xl rounded-md border-2 border-gray-300 p-12 md:w-2/3">
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="flex flex-col items-center justify-center">
          <span
            id="wp-span"
            className="justify-even text-lg ml-4 mt-2 flex text-red-700"
          ></span>
          <div className="pfp-container">
            <Image
              width={700}
              height={80}
              src={wallpaper}
              alt="wallpaper"
              id="wallpaper-holder"
              className="h-[140px] min-h-[80px] w-[700px] min-w-[200px] flex-shrink-0 rounded-3xl object-cover object-center lg:h-[200px]"
            />
            <label
              htmlFor="wallpaper"
              className="absolute right-[10px] top-[10px] cursor-pointer "
            >
              <EditIconWallpaper />
            </label>
          </div>
          <input
            className="hidden cursor-pointer"
            name="wallpaper"
            id="wallpaper"
            type="file"
            accept="image/*"
            onChange={handleWpChange}
          />
          <div className="pfp-container">
            <Image
              width={100}
              height={100}
              src={avatar}
              alt="pfp"
              id="pfp-holder"
              className="pfp -mt-10  h-[100px] w-[100px] object-cover object-center"
            />
            <label
              htmlFor="pfp"
              className="absolute -top-[13px] right-[2px] cursor-pointer"
            >
              <EditIconProfile />
            </label>
          </div>
          <input
            className="hidden cursor-pointer"
            name="pfp"
            id="pfp"
            type="file"
            accept="image/*"
            onChange={handlePfpChange}
          />
          <span
            id="pfp-span"
            className="justify-even mb-4 ml-4 mt-2 flex text-sm text-red-700"
          ></span>
        </div>
        <SvgShapingMethod />
        <div className="mt-3 flex flex-col items-center justify-items-center gap-3 md:grid md:grid-cols-2">
          <FirstNameInput
            state={state[0]}
            defaultValue={firstName}
            validFirstName={validFirstName}
          />
          <LastNameInput
            state={state[1]}
            defaultValue={lastName}
            validLastName={validLastName}
          />
          <NickNameInput state={state[2]} validNickName={validNickName} />
          <PasswordInput state={state[3]} validPassword={validPassword} />
          <motion.div
            key="buttonSign"
            layout={false}
            layoutId="button"
            initial={false}
            transition={{ type: 'Tween' }}
            className="col-span-2"
          >
            <button
              disabled={!isEnabled}
              type="submit"
              className={`hover:text-md text-xs w-full rounded-full bg-[#0097E2] px-12  py-2 text-center  
                  uppercase text-white md:text-base 
            ${
              isEnabled
                ? 'hover:text-l transform transition duration-300 hover:scale-110 hover:bg-[#2C3B7C]'
                : 'opacity-25'
            } `}
            >
              Update
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
