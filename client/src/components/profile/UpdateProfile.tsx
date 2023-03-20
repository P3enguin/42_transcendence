import Image from 'next/image';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  EditIconProfile,
  EditIconWallpaper,
  SvgShapingMethod,
} from '../icons/Icons';
import Router from 'next/router';
import { data, statObj } from './Interface';
import {
  FirstNameInput,
  LastNameInput,
  NickNameInput,
  PasswordInput,
} from './Inputs';
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
  async function handleSubmit(event: any) {
    event.preventDefault();

    const data: data = {
      nickname: event.target.nickname.value,
      email: email,
      password: event.target.password.value,
      firstname: event.target.firstname.value,
      lastname: event.target.lastname.value,
      coins: coins,
    };
    const singupURL: string =
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/signup';

    const response = await fetch(singupURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (response.status == 201) {
      if (uploads.pfp) {
        const pfpImg = event.target.pfp.files[0];
        let formData = new FormData();
        formData.append('file', pfpImg);

        const url = process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/avatar';

        const resp = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
      }
      if (uploads.wp) {
        const pfpImg = event.target.wallpaper.files[0];
        let formData = new FormData();
        formData.append('file', pfpImg);
        const url = process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/wallpaper';

        const resp = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
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

  function validFirstName(event: React.FocusEvent<HTMLInputElement, Element>) {
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

  function validLastName(event: React.FocusEvent<HTMLInputElement, Element>) {
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

  function validNickName(event: React.FocusEvent<HTMLInputElement, Element>) {
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
    } else if (!isBetween(nick_name, 3, 20)) {
      updateField(
        2,
        { valid: false, touched: touched },
        span,
        'Nickname should be (3-20) character long!',
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

  function validPassword(event: React.FocusEvent<HTMLInputElement, Element>) {
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

  function handlePfpChange(event: any) {
    const span = document.getElementById('pfp-span');
    if (event.target.files[0]) {
      if (event.target.files[0].size > 1024 * 1024 * 2) {
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
      pfp.src = window.URL.createObjectURL(event.target.files[0]);
      handleImage((item) => ({
        ...item,
        ...{ pfp: true, wp: uploads.wp },
      }));
      updateField(5, { valid: true, touched: false }, null, '');
    }
  }

  function handleWpChange(event: any) {
    const span = document.getElementById('wp-span');
    if (event.target.files[0]) {
      if (event.target.files[0].size > 1024 * 1024 * 2) {
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
      pfp.src = window.URL.createObjectURL(event.target.files[0]);
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
  });

  return (
    <div className="mg-top w-5/6 max-w-4xl rounded-md border-2 border-gray-300 p-12 md:w-2/3">
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="flex flex-col items-center justify-center">
          <span
            id="wp-span"
            className="justify-even ml-4 mt-2 flex text-lg text-red-700"
          ></span>
          <div className="pfp-container">
            <img
              src="/wallpaper.png"
              alt="wallpaper"
              id="wallpaper-holder"
              className="h-[170px] min-h-[80px] w-[700px] min-w-[200px] flex-shrink-0 rounded-3xl"
            />
            <label htmlFor="wallpaper" className="cursor-pointer ">
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
            <img
              src="/pfp1.png"
              alt="pfp"
              id="pfp-holder"
              className="pfp -mt-10  h-[100px] w-[100px] "
            />
            <label htmlFor="pfp" className="cursor-pointer ">
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
            className="justify-even ml-4 mt-2 mb-4 flex text-sm text-red-700"
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
              className={`hover:text-md w-full rounded-full bg-[#0097E2] py-2 px-12  text-center text-xs  
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
