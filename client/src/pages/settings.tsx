import Layout from '@/components/layout/layout';
import { useState } from 'react';
import { statObj } from '@/components/profile/Interface';
import { useEffect } from 'react';
import {
  FirstNameInput,
  LastNameInput,
  NickNameInput,
  PasswordInput,
  RePasswordInput,
} from '@/components/profile/Inputs';

import {
  isBetween,
  isValidName,
  isTooLong,
  isEmpty,
  isClear,
  isStrong,
} from '@/components/profile/ValidationFuncs';

interface propsData {
  firstname: string;
  lastname: string;
  nickname: string;
}

function settings({ firstname, lastname, nickname }: propsData) {
  const [state, updateState] = useState([
    { valid: true, touched: false },
    { valid: true, touched: false },
    { valid: true, touched: false },
  ]);
  const [statePass, updateStatePass] = useState([
    { valid: false, touched: false },
    { valid: false, touched: false },
  ]);
  const [isEnabled, setEnabled] = useState(false);
  const [isEnabledSecond, setEnabledSecond] = useState(false);

  // here is the problem
  function touched() {
      state.forEach((elem) => {
        if (elem.touched)
        {
          return true;
        }
      })
      return false;
  }

  
  function allTrue(elem: statObj) {
    return elem.valid ? true : false;
  }
  // To add default value of First Name and Last Name

  useEffect(() => {
    console.log(touched());
    if (state.every(allTrue) && touched())
    {
      setEnabled(true);
    } 
    else setEnabled(false);
  }),[state];

  useEffect(() => {
    if (statePass.every(allTrue)) setEnabledSecond(true);
    else setEnabledSecond(false);
  }),[statePass];
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

  function updateFieldSec(
    index: number,
    val: statObj,
    span: HTMLElement | null,
    error: string,
  ) {
    const newState = statePass.map((elem, i) => {
      if (i == index) return val;
      else return elem;
    });
    updateStatePass(newState);
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
    } else if (!isBetween(nick_name, 3, 15)) {
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

  function validPassword(event: React.ChangeEvent<HTMLInputElement>) {
    const password: string = event.target.value;
    const span = document.getElementById('pwdspan');
    var touched = statePass[0].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    if (isEmpty(password)) {
      updateFieldSec(
        0,
        { valid: false, touched: touched },
        span,
        'Password cannot be empty!',
      );
    } else if (!isStrong(password)) {
      updateFieldSec(
        0,
        { valid: false, touched: touched },
        span,
        'Password is too weak!',
      );
    } else {
      updateFieldSec(0, { valid: true, touched: touched }, null, '');
    }
  }

  function validRePassword(event: React.ChangeEvent<HTMLInputElement>) {
    const RePassword: string = event.target.value;
    const password = document.getElementById('password') as HTMLInputElement;

    const span = document.getElementById('repwdspan');
    var touched = statePass[1].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    if (isEmpty(RePassword)) {
      updateFieldSec(
        1,
        { valid: false, touched: touched },
        span,
        'Confirm your password!',
      );
    } else if (password.value !== RePassword) {
      updateFieldSec(
        1,
        { valid: false, touched: touched },
        span,
        'passwords are not identicals!',
      );
    } else {
      updateFieldSec(1, { valid: true, touched: touched }, null, '');
    }
  }

  return (
    <>
      <div
        className="mt-[40px] flex h-[750px] w-11/12 flex-col
           gap-5 rounded-3xl bg-[#2F3B78] md:max-xl:w-5/6 xl:w-[1000px] "
      >
        <h1 className="mt-5 text-center text-[35px]">Settings</h1>
        <form>
          <div
            className="mt-3 flex flex-col items-center
                 justify-items-center gap-3 md:grid md:grid-cols-2"
          >
            <FirstNameInput
              state={state[0]}
              defaultValue={firstname}
              validFirstName={validFirstName}
            />
            <LastNameInput
              state={state[1]}
              defaultValue={lastname}
              validLastName={validLastName}
            />

            <NickNameInput
              state={state[2]}
              defaultValue={nickname}
              validNickName={validNickName}
            />
            <div className="col-span-2">
              <button
                disabled={!isEnabled}
                type="submit"
                className={`hover:text-md w-full rounded-full bg-[#0097E2] py-2 px-12  text-center text-xs  
                  uppercase text-white md:text-base 
            ${
              isEnabled
                ? 'hover:text-l transform transition duration-300 hover:scale-110 hover:bg-[#354690]'
                : 'opacity-25'
            } `}
              >
                Save
              </button>
            </div>
          </div>
        </form>
        <form>
          <div
            className="mt-3 flex flex-col items-center
                 justify-items-center gap-3 md:grid md:grid-cols-2"
          >
            <PasswordInput
              state={statePass[0]}
              validPassword={validPassword}
              holder={'New password'}
            />
            <RePasswordInput
              state={statePass[1]}
              validRePassword={validRePassword}
              holder={'Confirm password'}
            />
            <div className="col-span-2">
              <button
                disabled={!isEnabledSecond}
                type="submit"
                className={`hover:text-md w-full rounded-full bg-[#0097E2] py-2 px-12  text-center text-xs  
                  uppercase text-white md:text-base 
            ${
              isEnabledSecond
                ? 'hover:text-l transform transition duration-300 hover:scale-110 hover:bg-[#354690]'
                : 'opacity-25'
            } `}
              >
                Update
              </button>
            </div>
          </div>
        </form>
        <button
          className={`hover:text-md hover:text-l w-3/5 transform self-center rounded-full  bg-[#3ea1d2] py-2 
                  px-12 text-center text-xs uppercase  text-white transition duration-300 hover:scale-110 hover:bg-[#354690] md:mt-10
                  md:text-base
                  `}
        >
          Activate 2FA
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: any) {
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
    return {
      // modify this to return anything you want before your page load
      props: {
        nickname: data.player.nickname,
        firstname: data.player.firstname,
        lastname: data.player.lastname,
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

settings.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default settings;
