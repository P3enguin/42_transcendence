import { Label } from 'flowbite-react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Router from 'next/router';

interface data {
  nickname: string;
  password: string;
}

function Login() {
  const [text, changeText] = useState([
    { text: 'Sign In', status: true },
    { text: 'gg', status: false },
  ]);

  async function handleSubmit(event: any) {
    event.preventDefault();
    const data: data = {
      nickname: event.target.nickname.value,
      password: event.target.password.value,
    };
    const url: string = process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/signin';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      if (data.Is2FAenabled)
        Router.push('/verify')
      else
        Router.push('/profile');
    } else {
      const err = await response.json();
      const span = document.getElementById('error-span');
      if (span) span.innerHTML = err.error.message;
    }
  }

  return (
    <div className="w-full max-w-lg justify-center text-base  md:w-2/3 md:text-2xl">
      <motion.div
        key="login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className=""
      >
        <div className="flex w-full flex-col items-center gap-5 text-white">
          <p>CONTINUE WITH</p>
          <div className="flex flex-row gap-5">
            <a
              href={
                process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/google-callback'
              }
            >
              <motion.button
                whileHover={{ scale: 1.5 }}
                className={`flex flex-row rounded-full border border-white bg-white p-1 `}
              >
                <Image
                  src="/googlelogo.png"
                  alt="google-Logo"
                  width={22}
                  height={22}
                  className=""
                ></Image>
              </motion.button>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/42-callback'}
            >
              <motion.button
                whileHover={{ scale: 1.5 }}
                className={`flex flex-row rounded-full border border-white bg-white p-1`}
              >
                <Image
                  src="/42_Logo 1.png"
                  alt="42Logo"
                  width={22}
                  height={22}
                ></Image>
              </motion.button>
            </a>
          </div>
          <div className="w-2/4 self-center py-5">
            <div className="border border-white"> </div>
          </div>
          <p>OR</p>
        </div>
        <form
          className="mt-3 flex w-full flex-col items-center gap-3"
          onSubmit={(event) => handleSubmit(event)}
        >
          <span
            id="error-span"
            className="mb-3 flex justify-center text-lg text-red-700"
          ></span>
          <div className="relative z-0 mb-6 w-3/4 ">
            <input
              type="input"
              name="nickname"
              id="nickname"
              className="peer block w-full appearance-none rounded-full border-2 border-gray-300 
                    bg-transparent py-2.5 px-3 text-sm 
                      text-white focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="nickname"
              className="absolute top-3 -z-10
                     origin-[0] -translate-y-8 scale-100 transform pl-3
                     text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0
                      peer-focus:-translate-y-8 peer-focus:scale-100 
                      peer-focus:font-medium peer-focus:text-blue-600 "
            >
              Nickname
            </label>
          </div>
          <div className="relative z-0 mb-6 w-3/4 ">
            <input
              type="password"
              name="password"
              id="password"
              className="peer block w-full appearance-none rounded-full border-2 border-gray-300 
                    bg-transparent py-2.5 px-3 text-sm 
                      text-white focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className="absolute top-3 -z-10
                     origin-[0] -translate-y-8 scale-100 transform 
                     px-3 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                      peer-focus:left-0 
                       peer-focus:-translate-y-8 peer-focus:scale-100 
                       peer-focus:font-medium peer-focus:text-blue-600"
            >
              Password
            </label>
          </div>

          <motion.div
            key="buttonSign"
            layout={false}
            layoutId="button"
            initial={false}
            transition={{ type: 'Tween' }}
            className="w-3/4 self-center"
          >
            <button
              type="submit"
              className="hover:text-l hover:text-md  w-full transform rounded-full 
                                bg-[#0097E2] py-2 px-12 
                                text-center text-xs  uppercase text-white  shadow transition duration-300
                                 hover:scale-110 hover:bg-[#2C3B7C]  md:text-base"
            >
              SIGN IN
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
