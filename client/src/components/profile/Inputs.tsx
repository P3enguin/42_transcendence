import { statObj } from "./Interface";
import { validFunc } from "./Interface";
import { useEffect } from "react";

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
    <div className="relative z-0 w-3/4 mb-6 group">
      <input
        type="input"
        name="firstname"
        id="firstname"
        className={` ${
          state.touched && state.valid
            ? " border-green-500"
            : state.touched && !state.valid
            ? "border-red-600"
            : "border-gray-300"
        } block py-2.5 px-3 w-full text-sm text-white bg-transparent 
              border-2 rounded-full appearance-none 
                focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder=" "
        required
        defaultValue={defaultValue}
        onBlur={(event) => validFirstName(event)}
      />
      <label
        htmlFor="firstname"
        className={`${
          state.touched && state.valid
            ? "text-green-500"
            : state.touched && !state.valid
            ? "text-red-600"
            : "text-gray-500"
        } peer-focus:font-medium absolute text-sm
                pl-3 duration-300 transform -translate-y-8
               scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                peer-focus:scale-100 peer-focus:-translate-y-8 `}
      >
        First Name
      </label>
      <span
        id="fnspan"
        className="text-red-700 text-sm ml-4 mt-2 flex justify-even"
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
    <div className="relative z-0 w-3/4 mb-6 group">
      <input
        type="input"
        name="lastname"
        id="lastname"
        className={`${
          state.touched && state.valid
            ? " border-green-500"
            : state.touched && !state.valid
            ? "border-red-600"
            : "border-gray-300"
        } block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full  appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder=" "
        defaultValue={defaultValue}
        required
        onBlur={(event) => {
          validLastName(event);
        }}
      />
      <label
        htmlFor="lastname"
        className={`${
          state.touched && state.valid
            ? "text-green-500"
            : state.touched && !state.valid
            ? "text-red-600"
            : "text-gray-500"
        } peer-focus:font-medium absolute text-sm
                      pl-3 duration-300 transform -translate-y-8
                     scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                      peer-focus:scale-100 peer-focus:-translate-y-8 `}
      >
        Last Name
      </label>
      <span
        id="lnspan"
        className="text-red-700 text-sm ml-4 mt-2 flex justify-even"
      ></span>
    </div>
  );
}

export function NickNameInput({
  state,
  validNickName,
}: {
  state: statObj;
  validNickName: validFunc;
}) {
  return (
    <div className="relative z-0 w-3/4 mb-6 group">
      <input
        type="input"
        name="nickname"
        id="nickname"
        className={`${
          state.touched && state.valid
            ? " border-green-500"
            : state.touched && !state.valid
            ? "border-red-600"
            : "border-gray-300"
        } block py-2.5 px-3 w-full text-sm text-white bg-transparent 
              border-2 rounded-full  appearance-none 
                focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder=" "
        required
        onBlur={(event) => validNickName(event)}
      />

      <label
        htmlFor="nickname"
        className={`${
          state.touched && state.valid
            ? "text-green-500"
            : state.touched && !state.valid
            ? "text-red-600"
            : "text-gray-500"
        } peer-focus:font-medium absolute text-sm
              pl-3 duration-300 transform -translate-y-8
             scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
              peer-focus:scale-100 peer-focus:-translate-y-8 `}
      >
        Nickname
      </label>
      <span
        id="nickspan"
        className="text-red-700 text-sm ml-4 mt-2 flex justify-even"
      ></span>
    </div>
  );
}

export function PasswordInput({
  state,
  validPassword,
}: {
  state: statObj;
  validPassword: validFunc;
}) {
  return (
    <div className="relative z-0 w-3/4 mb-6 group">
      <input
        type="password"
        name="password"
        id="password"
        className={`${
          state.touched && state.valid
            ? " border-green-500"
            : state.touched && !state.valid
            ? "border-red-600"
            : "border-gray-300"
        } block py-2.5 px-3 w-full text-sm text-white bg-transparent 
            border-2 rounded-full  appearance-none 
              focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder=" "
        required
        onBlur={(event) => validPassword(event)}
      />
      <label
        htmlFor="password"
        className={`${
          state.touched && state.valid
            ? "text-green-500"
            : state.touched && !state.valid
            ? "text-red-600"
            : "text-gray-500"
        } peer-focus:font-medium absolute text-sm
              pl-3 duration-300 transform -translate-y-8
             scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
              peer-focus:scale-100 peer-focus:-translate-y-8 `}
      >
        Password
      </label>
      <span
        id="pwdspan"
        className="text-red-700 text-sm ml-4 mt-2 flex justify-even"
      ></span>
    </div>
  );
}
