import { statObj } from "./Interface";

export function firstName ({state}:{state:statObj}) {
    return ( <div className="relative z-0 w-3/4 mb-6 group">
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
      onBlur={(event) => valideFirstName(event)}
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
  </div>);
}


export function lastName() {
    return (<></>)
}