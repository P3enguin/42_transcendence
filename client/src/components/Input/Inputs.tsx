import { statObj, handleKeyUp, validFunc } from '../tools/Interface';
import { useEffect } from 'react';

export function FirstNameInput({
  state,
  defaultValue,
  validFirstName,
}: {
  state: statObj;
  defaultValue: string;
  validFirstName: validFunc;
}) {
  return (
    <div className="group relative z-0 mb-6 w-3/4">
      <input
        type="input"
        name="firstname"
        id="firstname"
        className={` ${
          state.touched && state.valid
            ? ' border-green-500'
            : state.touched && !state.valid
            ? 'border-red-600'
            : 'border-gray-300'
        } peer block w-full appearance-none rounded-full border-2 bg-transparent 
              py-2.5 px-3 text-xs text-white
                focus:border-blue-600 focus:outline-none focus:ring-0 md:text-sm`}
        placeholder=" "
        required
        defaultValue={defaultValue}
        onChange={(event) => validFirstName(event)}
      />
      <label
        htmlFor="firstname"
        className={`${
          state.touched && state.valid
            ? 'text-green-500'
            : state.touched && !state.valid
            ? 'text-red-600'
            : 'text-gray-500'
        } absolute top-3 -z-10
                origin-[0] -translate-y-8 scale-100 transform
               pl-3 text-xs duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-8
                peer-focus:scale-100 peer-focus:font-medium 
                peer-focus:text-blue-600 md:text-sm `}
      >
        First Name
      </label>
      <span
        id="fnspan"
        className="justify-even ml-4 mt-2 flex text-xs text-red-700 md:text-sm"
      ></span>
    </div>
  );
}

export function LastNameInput({
  state,
  defaultValue,
  validLastName,
}: {
  state: statObj;
  defaultValue: string;
  validLastName: validFunc;
}) {
  return (
    <div className="group relative z-0 mb-6 w-3/4">
      <input
        type="input"
        name="lastname"
        id="lastname"
        className={`${
          state.touched && state.valid
            ? ' border-green-500'
            : state.touched && !state.valid
            ? 'border-red-600'
            : 'border-gray-300'
        } peer block w-full appearance-none rounded-full border-2 bg-transparent 
                    py-2.5 px-3  text-xs text-white
                      focus:border-blue-600 focus:outline-none focus:ring-0 md:text-sm`}
        placeholder=" "
        defaultValue={defaultValue}
        required
        onChange={(event) => {
          validLastName(event);
        }}
      />
      <label
        htmlFor="lastname"
        className={`${
          state.touched && state.valid
            ? 'text-green-500'
            : state.touched && !state.valid
            ? 'text-red-600'
            : 'text-gray-500'
        } absolute top-3 -z-10
                      origin-[0] -translate-y-8 scale-100 transform
                     pl-3 text-xs duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-8
                      peer-focus:scale-100 peer-focus:font-medium 
                      peer-focus:text-blue-600 md:text-sm `}
      >
        Last Name
      </label>
      <span
        id="lnspan"
        className="justify-even ml-4 mt-2 flex text-xs text-red-700 md:text-sm"
      ></span>
    </div>
  );
}

export function NickNameInput({
  state,
  validNickName,
  defaultValue,
}: {
  state: statObj;
  defaultValue?: string;
  validNickName: validFunc;
}) {
  return (
    <div className="group relative z-0 mb-6 w-3/4">
      <input
        type="input"
        name="nickname"
        id="nickname"
        className={`${
          state.touched && state.valid
            ? ' border-green-500'
            : state.touched && !state.valid
            ? 'border-red-600'
            : 'border-gray-300'
        } peer block w-full appearance-none rounded-full border-2 bg-transparent 
              py-2.5 px-3  text-xs text-white 
                focus:border-blue-600 focus:outline-none focus:ring-0 md:text-sm`}
        placeholder=" "
        defaultValue={defaultValue}
        required
        onChange={(event) => validNickName(event)}
      />

      <label
        htmlFor="nickname"
        className={`${
          state.touched && state.valid
            ? 'text-green-500'
            : state.touched && !state.valid
            ? 'text-red-600'
            : 'text-gray-500'
        } absolute top-3 -z-10
              origin-[0] -translate-y-8 scale-100 transform
             pl-3 text-xs duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-8
              peer-focus:scale-100 peer-focus:font-medium 
              peer-focus:text-blue-600 md:text-sm `}
      >
        Nickname
      </label>
      <span
        id="nickspan"
        className="justify-even ml-4 mt-2 flex text-xs text-red-700 md:text-sm"
      ></span>
    </div>
  );
}

export function PasswordInput({
  state,
  validPassword,
  holder,
}: {
  state: statObj;
  validPassword: validFunc;
  holder?: string;
}) {
  return (
    <div className="group relative z-0 mb-6 w-3/4">
      <input
        type="password"
        name="password"
        id="password"
        className={`${
          state.touched && state.valid
            ? ' border-green-500'
            : state.touched && !state.valid
            ? 'border-red-600'
            : 'border-gray-300'
        } peer block w-full appearance-none rounded-full border-2 bg-transparent 
            py-2.5 px-3  text-xs text-white 
              focus:border-blue-600 focus:outline-none focus:ring-0 md:text-sm`}
        placeholder=" "
        required
        onChange={(event) => validPassword(event)}
      />
      <label
        htmlFor="password"
        className={`${
          state.touched && state.valid
            ? 'text-green-500'
            : state.touched && !state.valid
            ? 'text-red-600'
            : 'text-gray-500'
        } absolute top-3 -z-10
              origin-[0] -translate-y-8 scale-100 transform
             pl-3 text-xs duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-8
              peer-focus:scale-100 peer-focus:font-medium 
              peer-focus:text-blue-600 md:text-sm `}
      >
        {holder ? holder : 'Password'}
      </label>
      <span
        id="pwdspan"
        className="justify-even ml-4 mt-2 flex text-xs text-red-700 md:text-sm"
      ></span>
    </div>
  );
}

export function RePasswordInput({
  state,
  validRePassword,
  holder,
}: {
  state: statObj;
  validRePassword: validFunc;
  holder?: string;
}) {
  return (
    <div className="group relative z-0 mb-6 w-3/4">
      <input
        type="password"
        name="repassword"
        id="repassword"
        className={`${
          state.touched && state.valid
            ? ' border-green-500'
            : state.touched && !state.valid
            ? 'border-red-600'
            : 'border-gray-300'
        } peer block w-full appearance-none rounded-full border-2 bg-transparent 
              py-2.5 px-3  text-xs text-white 
                focus:border-blue-600 focus:outline-none focus:ring-0 md:text-sm`}
        placeholder=" "
        required
        onChange={(event) => validRePassword(event)}
      />
      <label
        htmlFor="repassword"
        className={`${
          state.touched && state.valid
            ? 'text-green-500'
            : state.touched && !state.valid
            ? 'text-red-600'
            : 'text-gray-500'
        } absolute top-3 -z-10
                origin-[0] -translate-y-8 scale-100 transform
               pl-3 text-xs duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-8
                peer-focus:scale-100 peer-focus:font-medium 
                peer-focus:text-blue-600 md:text-sm `}
      >
        {holder ? holder : 'Password'}
      </label>
      <span
        id="repwdspan"
        className="justify-even ml-4 mt-2 flex text-xs text-red-700 md:text-sm"
      ></span>
    </div>
  );
}

export function OTPInput() {
  const array = [1, 2, 3, 4, 5, 6];
  // function handleChange(event: React.ChangeEvent<HTMLInputElement>, field: number) {
  //   const value = event.target.value;
  //   const elem = document.getElementById(field.toString()) as HTMLInputElement;
  //   if (elem.value  && elem.value !== "")
  //   {
  //     console.log("hh1");
  //     const next = document.getElementById((field + 1).toString()) as HTMLInputElement;
  //     if (next)
  //       next.focus();
  //   }
  // }

  // function handleKeyUp(event :React.KeyboardEvent , field:number)
  // {
  //   const elem = document.getElementById(field.toString()) as HTMLInputElement;
  //   const prev = document.getElementById((field - 1).toString()) as HTMLInputElement;
  //   const next = document.getElementById((field + 1).toString()) as HTMLInputElement;

  //   if (elem)
  //   {
  //     console.log(event.metaKey);
  //     if (event.key === "Backspace" || event.key === "ArrowLeft")
  //       prev?.focus();
  //     else if (event.key === "ArrowRight")
  //       next?.focus();
  //     else {
        
  //     }
  //   }
  // }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>, field: number) {
    const value = event.target.value;
    const elem = document.getElementById(field.toString()) as HTMLInputElement;
    if (elem.value && elem.value !== "") {
      const next = document.getElementById((field + 1).toString()) as HTMLInputElement;
      if (next) next.focus();
    }
  }
  
  function handleKeyUp(event: React.KeyboardEvent, field: number) {
    const elem = document.getElementById(field.toString()) as HTMLInputElement;
    const prev = document.getElementById((field - 1).toString()) as HTMLInputElement;
    const next = document.getElementById((field + 1).toString()) as HTMLInputElement;
  
    if (elem) {
      if (event.key === "Backspace" || event.key === "ArrowLeft") {
        if (elem.value === "") prev?.focus();
      } else if (event.key === "ArrowRight") {
        if (elem.value === "" || elem.selectionStart === elem.value.length) next?.focus();
      } else if (event.key.match(/[0-9]/)) {
        if (elem.value !== "") next?.focus();
      } else {
        event.preventDefault();
      }
    }
  }
  return (
    <div className="mx-auto flex w-[340px] sm:w-full  flex-row items-center justify-between gap-2 text-black">
      {array.map((value) => {
        return (
          <div key={value} className="h-[50px] sm:h-16 w-16 ">
            <input
              className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center sm:text-lg text-sm outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
              type="text"
              maxLength={1}
              pattern="[0-9]"
              name={value.toString()}
              id={value.toString()}
              onChange={(e) => handleChange(e, value)}
              onKeyUp={(e) => handleKeyUp(e, value)}
            />
          </div>
        );
      })}
    </div>
  );
}
