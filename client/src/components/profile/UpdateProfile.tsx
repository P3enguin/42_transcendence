import Image from "next/image";
import { motion } from "framer-motion";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import Router from "next/router";

interface data {
  nickname: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  coins: number;
  // picture: event.target.picture.value,
}

function isBetween(str: string, min: number, max: number): boolean {
  if (str.length >= min && str.length <= max) return true;
  return false;
}

function isValidName(str:string) : boolean { 
  const pattern = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/g;

  return pattern.test(str);

}
function isTooLong(str: string): boolean {
  if (str.length > 30) return true;
  return false;
}

function isEmpty(str: string): boolean {
  if (!str || str.trim() === "") return true;
  return false;
}

function isClear(str: string): boolean {
  const pattern = /^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/;

  return pattern.test(str);
}

function isStrong(str:string) : boolean {
  const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,100}$/g;

  return pattern.test(str);
}


async function handleSubmit(event: any, email: string, coins: number) {
  event.preventDefault();

  const data: data = {
    nickname: event.target.nickname.value,
    email: email,
    password: event.target.password.value,
    firstname: event.target.firstname.value,
    lastname: event.target.lastname.value,
    coins: coins,
    // picture: event.target.picture.value,
  };
  const url: string = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (response.status == 201) {
    Router.push("/profile");
  }
}

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
  // stats for error handling
  const [state, updateState] = useState({
    firstname: false,
    lastname: true,
    nickname: false,
    password: false,
  });

  function updateField(field: object, span: HTMLElement | null, error: string) {
    updateState((state) => ({
      ...state,
      ...field,
    }));
    if (span) span.innerHTML = error;
  }

  function valideFirstName(event: any) {
    const first_name: string = event.target.value;
    const span = document.getElementById("fnspan");

    span!.innerHTML = "";
    if (isEmpty(first_name)) {
      updateField({ firstname: false }, span, "First name cannot be empty!");
    } else if (isTooLong(first_name)) {
      updateField({ firstname: false }, span, "Input is too long!");
    } else if (!isValidName(first_name)) {
      updateField({ firstname: false }, span, "first name contains forbidden characters!");
    }
    else {
      updateField({ firstname: true }, null, "");
    }
  }

  function valideLastName(event: any) {
    const last_name: string = event.target.value;
    const span = document.getElementById("lnspan");

    span!.innerHTML = "";
    if (isEmpty(last_name)) {
      updateField({ lastname: false }, span, "Last name cannot be empty!");
    } else if (isTooLong(last_name)) {
      updateField({ lastname: false }, span, "Input is too long!");
    } else if (!isValidName(last_name)) {
      updateField({ lastname: false }, span, "Last name contains forbidden characters!");
    }else {
      updateField({ lastname: true }, null, "");
    }
  }

  function valideNickName(event: any) {
    const nick_name: string = event.target.value;
    const span = document.getElementById("nickspan");

    span!.innerHTML = "";
    if (isEmpty(nick_name)) {
      updateField({ nickname: false }, span, "Nickname cannot be empty!");
    } else if (!isBetween(nick_name, 3, 20)) {
      updateField(
        { nickname: false },
        span,
        "Nickname should be (3-20) character long!"
      );
    } else if (!isClear(nick_name)) {
      updateField(
        { nickname: false },
        span,
        "Nickname contains forbidden characters!"
      );
    } else {
      updateField({ nickname: true }, null, "");
    }
  }

  function validePassword(event: any) {
    const password: string = event.target.value;
    const span = document.getElementById("pwdspan");

    span!.innerHTML = "";
    if (isEmpty(password)) {
      updateField({ password: false }, span, "Password cannot be empty!");
    }  else if (!isStrong(password)) {
      updateField(
        { password: false },
        span,
        "Password is too weak!"
      );
    } else {
      updateField({ password: true }, null, "");
    }
  }

  function handleChange(event: any) {
    const pfp = document.getElementById("pfp-holder") as HTMLImageElement;
    pfp.src = window.URL.createObjectURL(event.target.files![0]);
  }

  // To add default value of First Name and Last Name
  useEffect(() => {
    const firstNameInput = document.getElementById(
      "firstname"
    ) as HTMLInputElement;
    const lastNameInput = document.getElementById(
      "lastname"
    ) as HTMLInputElement;

    firstNameInput!.value = firstName;
    lastNameInput!.value = lastName;
  }, []);

  return (
    <div className="border-2 border-gray-300 p-12 max-w-4xl rounded-md w-5/6 md:w-2/3 mg-top">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/wallpaper.png"
          alt="wallpaper"
          className="rounded-3xl flex-shrink-0 min-w-[200px] min-h-[80px]"
          width={500}
          height={500}
        />
        <div className="pfp-container">
          <img
            src="/pfp1.png"
            alt="pfp"
            id="pfp-holder"
            className="pfp -mt-10  w-[100px] h-[100px] "
          />
          <label htmlFor="pfp" className="cursor-pointer ">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rounded absolute  bg-opacity-50 h-1/4  bg-[#8BD9FF] -top-[13px]  hover:bg-[#357550]
                                   fill-[#9CD8FB] hover:fill-[#70F89B] right-[2px] w-[17px]"
            >
              <path d="M22.5818 12.5963L12.7527 22.4743C12.2415 22.9719 11.5697 23.2499 10.8686 23.2499H7.43644C7.24657 23.2499 7.07131 23.1768 6.93987 23.0451C6.80842 22.9134 6.75 22.7377 6.75 22.5475L6.83763 19.0792C6.85224 18.3914 7.12973 17.7475 7.6117 17.2646L14.5783 10.2841C14.6951 10.167 14.8996 10.167 15.0164 10.2841L17.4598 12.7177C17.6205 12.8773 17.8542 12.9812 18.1025 12.9812C18.6429 12.9812 19.0664 12.5421 19.0664 12.0153C19.0664 11.7519 18.9642 11.5177 18.8035 11.3421C18.7597 11.2836 16.4331 8.96701 16.4331 8.96701C16.2871 8.82067 16.2871 8.57189 16.4331 8.42555L17.4117 7.43043C18.3172 6.52311 19.7777 6.52311 20.6832 7.43043L22.5818 9.33287C23.4727 10.2255 23.4727 11.689 22.5818 12.5963Z" />
            </svg>
          </label>
        </div>
        <input
          className="hidden cursor-pointer"
          id="pfp"
          type="file"
          onChange={handleChange}
        />
      </div>
      <svg
        style={{ visibility: "hidden", position: "absolute" }}
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id="round">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <form
        className="justify-items-center mt-3 gap-3 flex flex-col items-center md:grid md:grid-cols-2"
        onSubmit={(event) => handleSubmit(event, email, coins)}
      >
        <div className="relative z-0 w-3/4 mb-6 group">
          <input
            type="input"
            name="firstname"
            id="firstname"
            className=" block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onBlur={(event) => valideFirstName(event)}
          />
          <label
            htmlFor="firstname"
            className="peer-focus:font-medium absolute text-sm
                     text-gray-500 pl-3 duration-300 transform -translate-y-8
                     scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                      peer-focus:scale-100 peer-focus:-translate-y-8 "
          >
            First Name
          </label>
          <span
            id="fnspan"
            className="text-red-700 text-sm ml-4 mt-2 flex justify-even"
          ></span>
        </div>
        <div className="relative z-0 w-3/4 mb-6 group">
          <input
            type="input"
            name="lastname"
            id="lastname"
            className="block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onBlur={(event) => {
              valideLastName(event);
            }}
          />
          <label
            htmlFor="lastname"
            className="peer-focus:font-medium absolute text-sm
                     text-gray-500 px-3 duration-300 transform 
                     -translate-y-8 scale-100 top-3 -z-10 origin-[0] peer-focus:left-0
                      peer-focus:text-blue-600 
                       peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                       peer-focus:scale-100 peer-focus:-translate-y-8"
          >
            Last Name
          </label>
          <span
            id="lnspan"
            className="text-red-700 text-sm ml-4 mt-2 flex justify-even"
          ></span>
        </div>
        <div className="relative z-0 w-3/4 mb-6 group">
          <input
            type="input"
            name="nickname"
            id="nickname"
            className="block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onBlur={(event) => valideNickName(event)}
          />

          <label
            htmlFor="nickname"
            className="peer-focus:font-medium absolute text-sm
                     text-gray-500 pl-3 duration-300 transform -translate-y-8
                     scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                      peer-focus:scale-100 peer-focus:-translate-y-8 "
          >
            Nickname
          </label>
          <span
            id="nickspan"
            className="text-red-700 text-sm ml-4 mt-2 flex justify-even"
          ></span>
        </div>
        <div className="relative z-0 w-3/4 mb-6 group">
          <input
            type="password"
            name="password"
            id="password"
            className="block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onBlur={(event => validePassword(event))}
          />
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-sm
                     text-gray-500 px-3 duration-300 transform 
                     -translate-y-8 scale-100 top-3 -z-10 origin-[0] peer-focus:left-0
                      peer-focus:text-blue-600 
                       peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                       peer-focus:scale-100 peer-focus:-translate-y-8"
          >
            Password
          </label>
          <span id="pwdspan" className="text-red-700 text-sm ml-4 mt-2 flex justify-even"></span>
        </div>
        <motion.div
          key="buttonSign"
          layout={false}
          layoutId="button"
          initial={false}
          transition={{ type: "Tween" }}
          className="col-span-2"
        >
          <button
            type="submit"
            className="uppercase w-full  shadow bg-[#0097E2] hover:bg-[#2C3B7C] 
                                transform transition duration-300 
                                hover:text-l hover:scale-110  text-white text-xs  text-center md:text-base hover:text-md
                                 py-2 px-12  rounded-full"
          >
            Update
          </button>
        </motion.div>
      </form>
    </div>
  );
}

export default UpdateProfile;
