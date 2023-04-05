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
  function autoTab(field1: string, len: number, field2: string) {
    if (
      (document.getElementById(field1) as HTMLInputElement).value.length == len
    ) {
      (document.getElementById(field2) as HTMLInputElement).focus();
    }
  }
  function handleKeyUp(field1: string, len: number, field2: string) {
    return function handleAutoTab() {
      autoTab(field1, len, field2);
    };
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-row items-center justify-between gap-2 text-black">
      <div className="h-16 w-16 ">
        <input
          className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
          type="text"
          pattern="[0-9]"
          maxLength={1}
          name="numb1"
          id="numb1"
          onKeyUp={handleKeyUp('numb1', 1, 'numb2')}
        />
      </div>
      <div className="h-16 w-16 ">
        <input
          className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
          type="text"
          pattern="[0-9]"
          maxLength={1}
          name="numb2"
          id="numb2"
          onKeyUp={handleKeyUp('numb2', 1, 'numb3')}
        />
      </div>
      <div className="h-16 w-16 ">
        <input
          className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
          type="text"
          pattern="[0-9]"
          maxLength={1}
          name="numb3"
          id="numb3"
          onKeyUp={handleKeyUp('numb3', 1, 'numb4')}
        />
      </div>
      <div className="h-16 w-16 ">
        <input
          className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
          type="text"
          pattern="[0-9]"
          maxLength={1}
          name="numb4"
          id="numb4"
          onKeyUp={handleKeyUp('numb4', 1, 'numb5')}
        />
      </div>
      <div className="h-16 w-16 ">
        <input
          className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
          type="text"
          pattern="[0-9]"
          maxLength={1}
          name="numb5"
          id="numb5"
          onKeyUp={handleKeyUp('numb5', 1, 'numb6')}
        />
      </div>
      <div className="h-16 w-16 ">
        <input
          className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-center text-lg outline-none ring-blue-700 focus:bg-gray-50 focus:ring-1"
          type="text"
          pattern="[0-9]"
          maxLength={1}
          name="numb6"
          id="numb6"
        />
      </div>
    </div>
  );
}
