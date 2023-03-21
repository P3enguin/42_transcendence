import { statObj } from './Interface';
import { validFunc } from './Interface';
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
              py-2.5 px-3 text-xs md:text-sm
                text-white focus:border-blue-600 focus:outline-none focus:ring-0`}
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
               pl-3 text-xs md:text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0
                peer-focus:-translate-y-8 peer-focus:scale-100 
                peer-focus:font-medium peer-focus:text-blue-600 `}
      >
        First Name
      </label>
      <span
        id="fnspan"
        className="justify-even ml-4 mt-2 flex text-xs md:text-sm text-red-700"
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
                    py-2.5 px-3  text-xs md:text-sm
                      text-white focus:border-blue-600 focus:outline-none focus:ring-0`}
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
                     pl-3 text-xs md:text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0
                      peer-focus:-translate-y-8 peer-focus:scale-100 
                      peer-focus:font-medium peer-focus:text-blue-600 `}
      >
        Last Name
      </label>
      <span
        id="lnspan"
        className="justify-even ml-4 mt-2 flex text-xs md:text-sm text-red-700"
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
  defaultValue?:string,
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
              py-2.5 px-3  text-xs md:text-sm 
                text-white focus:border-blue-600 focus:outline-none focus:ring-0`}
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
             pl-3 text-xs md:text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0
              peer-focus:-translate-y-8 peer-focus:scale-100 
              peer-focus:font-medium peer-focus:text-blue-600 `}
      >
        Nickname
      </label>
      <span
        id="nickspan"
        className="justify-even ml-4 mt-2 flex text-xs md:text-sm text-red-700"
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
  holder?:string;
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
            py-2.5 px-3  text-xs md:text-sm 
              text-white focus:border-blue-600 focus:outline-none focus:ring-0`}
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
             pl-3 text-xs md:text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0
              peer-focus:-translate-y-8 peer-focus:scale-100 
              peer-focus:font-medium peer-focus:text-blue-600 `}
      >
        {holder? holder : "Password"}
      </label>
      <span
        id="pwdspan"
        className="justify-even ml-4 mt-2 flex text-xs md:text-sm text-red-700"
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
    holder?:string;
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
              py-2.5 px-3  text-xs md:text-sm 
                text-white focus:border-blue-600 focus:outline-none focus:ring-0`}
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
               pl-3 text-xs md:text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0
                peer-focus:-translate-y-8 peer-focus:scale-100 
                peer-focus:font-medium peer-focus:text-blue-600 `}
        >
          {holder? holder : "Password"}
        </label>
        <span
          id="repwdspan"
          className="justify-even ml-4 mt-2 flex text-xs md:text-sm text-red-700"
        ></span>
      </div>
    );
}

