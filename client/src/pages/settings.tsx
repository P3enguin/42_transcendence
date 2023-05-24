import Layout from '@/components/layout/layout';
import { useState } from 'react';
import { statObj } from '@/components/tools/Interface';
import { useEffect } from 'react';
import Router from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ModalActivate2FA,
  ModalDeactivate2FA,
} from '@/components/modal/Modals';
import {
  FirstNameInput,
  LastNameInput,
  NickNameInput,
  PasswordInput,
  RePasswordInput,
} from '@/components/Input/Inputs';

import {
  isBetween,
  isValidName,
  isTooLong,
  isEmpty,
  isClear,
  isStrong,
} from '@/components/profile/ValidationFuncs';

import Error from '@/components/tools/Reply/Error';
import Success from '@/components/tools/Reply/Success';

interface propsData {
  firstname: string;
  lastname: string;
  nickname: string;
  Is2FAEnabled?: boolean;
}

function Settings({ firstname, lastname, nickname, Is2FAEnabled }: propsData) {
  const [error, setError] = useState(false);
  const [reply, setreply] = useState('');
  const [succes, setSuccess] = useState(false);

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

  const [qrPath, setQrPath] = useState('');
  const [isOpen, setIsOpen] = useState([false, false, false]);
  const [activated, setActivated] = useState(Is2FAEnabled);

  function toggleOpen(index: number) {
    const newState = isOpen.map((item, i) => {
      if (i == index) return !item;
      return item;
    });
    setIsOpen(newState);
  }

  async function handlePasswordUpdate(event: React.FormEvent) {
    event.preventDefault();

    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    if (password) {
      const data = {
        password: password,
      };
      const updateURL: string =
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/password';
      try {
        const response = await fetch(updateURL, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        if (response.status == 201) {
          setreply('Password Changed !');
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        } else if (response.status == 400) {
          const err = await response.json();
          setreply('An Error has Occurred!');
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

  async function handleDataSave(event: React.FormEvent) {
    event.preventDefault();

    const nickname = (document.getElementById('nickname') as HTMLInputElement)
      .value;
    const firstname = (document.getElementById('firstname') as HTMLInputElement)
      .value;
    const lastname = (document.getElementById('lastname') as HTMLInputElement)
      .value;
    if (nickname && firstname && lastname) {
      const data: propsData = {
        nickname: nickname,
        firstname: firstname,
        lastname: lastname,
      };
      const updateURL: string =
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/data';
      try {
        const response = await fetch(updateURL, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        if (response.status == 201) {
          setreply('Data has been Changed !');
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        } else if (response.status == 400) {
          const err = await response.json();
          if (err.error === 'Nickname already exist') {
            const span = document.getElementById('nickspan');
            const newArr = mutateArray(
              2,
              { valid: false, touched: false },
              state,
            );
            updateState(newArr);
            printError(span, err.error);
          } else {
            setreply('An Error has Occurred!');
            setError(true);
            setTimeout(() => {
              setError(false);
            }, 3000);
          }
        }
      } catch (error) {
        console.log('An error has occurred');
      }
    }
  }

  // here is the problem
  function touched(elem: statObj) {
    return elem.touched ? false : true;
  }

  function allTrue(elem: statObj) {
    return elem.valid ? true : false;
  }
  // To add default value of First Name and Last Name

  useEffect(() => {
    if (state.every(allTrue) && !state.every(touched)) {
      setEnabled(true);
    } else setEnabled(false);
  }, [state]);

  useEffect(() => {
    if (statePass.every(allTrue)) setEnabledSecond(true);
    else setEnabledSecond(false);
  }, [statePass]);

  function mutateArray(
    index: number,
    val: statObj,
    array: statObj[],
  ): statObj[] {
    const newArr = array.map((elem, i) => {
      if (i == index) return val;
      else return elem;
    });
    return newArr;
  }

  function printError(span: HTMLElement | null, error: string) {
    if (span) span.innerHTML = error;
  }

  function validFirstName(event: React.ChangeEvent<HTMLInputElement>) {
    let newState = state;
    const first_name: string = event.target.value;
    const span = document.getElementById('fnspan');
    var touched = state[0].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';

    newState = mutateArray(0, { valid: false, touched: touched }, newState);
    if (first_name === firstname)
      newState = mutateArray(0, { valid: false, touched: false }, newState);
    else if (isEmpty(first_name)) {
      printError(span, 'First name cannot be empty!');
    } else if (isTooLong(first_name)) {
      printError(span, 'Input is too long!');
    } else if (!isValidName(first_name)) {
      printError(span, 'first name contains forbidden characters!');
    } else {
      newState = mutateArray(0, { valid: true, touched: touched }, newState);
    }
    updateState(newState);
  }

  function validLastName(event: React.ChangeEvent<HTMLInputElement>) {
    let newState = state;
    const last_name: string = event.target.value;
    const span = document.getElementById('lnspan');
    var touched = state[1].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    newState = mutateArray(1, { valid: false, touched: touched }, newState);
    if (last_name === lastname)
      newState = mutateArray(1, { valid: false, touched: false }, newState);
    else if (isEmpty(last_name)) {
      printError(span, 'Last name cannot be empty!');
    } else if (isTooLong(last_name)) {
      printError(span, 'Input is too long!');
    } else if (!isValidName(last_name)) {
      printError(span, 'Last name contains forbidden characters!');
    } else {
      newState = mutateArray(1, { valid: true, touched: touched }, newState);
    }
    updateState(newState);
  }

  function validNickName(event: React.ChangeEvent<HTMLInputElement>) {
    let newState = state;
    const nick_name: string = event.target.value;
    const span = document.getElementById('nickspan');
    var touched = state[2].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    newState = mutateArray(2, { valid: false, touched: touched }, newState);
    if (nick_name === nickname)
      newState = mutateArray(2, { valid: false, touched: false }, newState);
    else if (isEmpty(nick_name)) {
      printError(span, 'Nickname cannot be empty!');
    } else if (!isBetween(nick_name, 3, 15)) {
      printError(span, 'Nickname should be (3-20) character long!');
    } else if (!isClear(nick_name)) {
      printError(span, 'Nickname contains forbidden characters!');
    } else {
      newState = mutateArray(2, { valid: true, touched: touched }, newState);
    }
    updateState(newState);
  }

  function validPassword(event: React.ChangeEvent<HTMLInputElement>) {
    let newState = statePass;
    const password: string = event.target.value;
    const span = document.getElementById('pwdspan');
    const RePassSpan = document.getElementById('repwdspan');
    var touched = statePass[0].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    RePassSpan!.innerHTML = '';
    if (isEmpty(password)) {
      newState = mutateArray(0, { valid: false, touched: false }, newState);
      newState = mutateArray(1, { valid: false, touched: false }, newState);
    } else if (!isStrong(password)) {
      (newState = mutateArray(0, { valid: false, touched: touched }, newState)),
        printError(span, 'Password is too weak!');
    } else {
      newState = mutateArray(0, { valid: true, touched: true }, newState);
      const Repass = (document.getElementById('repassword') as HTMLInputElement)
        .value;
      if (Repass) {
        if (password !== Repass) {
          const span = document.getElementById('repwdspan');
          newState = mutateArray(1, { valid: false, touched: true }, newState);
          printError(RePassSpan, 'passwords are not identicals!');
        } else {
          newState = mutateArray(1, { valid: true, touched: true }, newState);
        }
      }
    }
    updateStatePass(newState);
  }

  function validRePassword(event: React.ChangeEvent<HTMLInputElement>) {
    let newState = statePass;
    const RePassword: string = event.target.value;
    const password = document.getElementById('password') as HTMLInputElement;

    const span = document.getElementById('repwdspan');
    var touched = statePass[1].touched;
    if (!touched) touched = true;

    span!.innerHTML = '';
    if (isEmpty(RePassword)) {
      newState = mutateArray(1, { valid: false, touched: false }, newState);
    } else if (password.value !== RePassword) {
      newState = mutateArray(1, { valid: false, touched: touched }, newState);
      printError(span, 'passwords are not identicals!');
    } else {
      newState = mutateArray(1, { valid: true, touched: touched }, newState);
    }
    updateStatePass(newState);
  }

  async function activate2FA(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/enable2FA',
        {
          credentials: 'include',
        },
      );
      const data = await res.json();
      if (res.ok) {
        setQrPath(data.qrcode);
        toggleOpen(0);
      } else {
        console.log('Error');
      }
    } catch (error) {
      console.log('An error has occurred');
    }
    // if (res.ok) {
    //   const data = await res.json();
    //   console.log(data);
    // }
    // else {
    //   consoel
    // }
  }
  function deactivate2FA(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    toggleOpen(1);
  }

  return (
    <>
      {isOpen[0] && (
        <ModalActivate2FA
          qrPath={qrPath}
          toggleOpen={toggleOpen}
          activated={activated}
          setActivated={setActivated}
        />
      )}
      {isOpen[1] && (
        <ModalDeactivate2FA
          toggleOpen={toggleOpen}
          activated={activated}
          setActivated={setActivated}
        />
      )}
      <AnimatePresence>
        {error && <Error reply={reply} />}
        {succes && <Success reply={reply} />}
      </AnimatePresence>
      <div
        className="mt-[40px] flex h-[850px] w-11/12 flex-col gap-5
           rounded-3xl bg-[#2F3B78] sm:h-[750px] md:max-xl:w-5/6 xl:w-[1000px] "
      >
        <h1 className="mt-5 text-center text-[35px]">Settings</h1>
        <form onSubmit={handleDataSave}>
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
                className={`hover:text-md text-xs w-full rounded-full bg-[#0097E2] px-12  py-2 text-center  
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
        <form onSubmit={handlePasswordUpdate}>
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
                className={`hover:text-md text-xs w-full rounded-full bg-[#0097E2] px-12  py-2 text-center  
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
        {!activated && (
          <button
            className={`hover:text-md hover:text-l text-xs w-3/5 transform self-center  rounded-full bg-[#3ea1d2] 
                  px-12 py-2 text-center uppercase  text-white transition duration-300 hover:scale-110 hover:bg-[#354690] md:mt-10
                  md:text-base
                  `}
            onClick={activate2FA}
          >
            Activate 2FA
          </button>
        )}
        {activated && (
          <button
            className={`hover:text-md hover:text-l text-xs w-3/5 transform self-center  rounded-full bg-[#3ea1d2] 
                    px-12 py-2 text-center uppercase  text-white transition duration-300 hover:scale-110 hover:bg-[#354690] md:mt-10
                    md:text-base
                    `}
            onClick={deactivate2FA}
          >
            DEACTIVATE 2FA
          </button>
        )}
        <button
          className={`hover:text-md hover:text-l text-xs w-3/5 transform self-center  rounded-full bg-red-500
                  px-12 py-2 text-center uppercase  text-white transition duration-300 hover:scale-110 hover:bg-red-700 md:mt-10
                  md:text-base
                  `}
          onClick={() => Router.push('/blocked')}
        >
          BLOCKED USERS
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/data',
        {
          headers: {
            Cookie: req.headers.cookie,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        return {
          // modify this to return anything you want before your page load
          props: {
            nickname: data.player.nickname,
            firstname: data.player.firstname,
            lastname: data.player.lastname,
            Is2FAEnabled: data.player.Is2FAEnabled,
          },
        };
      }
    } catch (error) {
      console.log('An error has occurred');
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

Settings.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Settings;
