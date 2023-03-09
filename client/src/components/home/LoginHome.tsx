import { Label } from "flowbite-react";
import { AnimateSharedLayout, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

function Login() {
  const [text, changeText] = useState([
    { text: "Sign In", status: true },
    { text: "gg", status: false },
  ]);

  return (
    <div className=" w-full md:w-2/3  max-w-lg	 text-base md:text-2xl justify-center">
      <motion.div
        key="login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className=""
      >
        <div className="text-white flex flex-col items-center gap-5 w-full">
          <p>CONTINUE WITH</p>
          <div className="flex flex-row gap-5">
            <a href={process.env.NEXT_PUBLIC_GOOGLE_ENDPOINT}>
              <motion.button
                whileHover={{ scale: 1.5 }}
                className={`border border-white rounded-full bg-white p-1 flex flex-row `}
              >
                <Image
                  src="/googleLogo.png"
                  alt="google-Logo"
                  width={22}
                  height={22}
                  className=""
                ></Image>
                {/* <span className={`text-black ${text[0].status ? "contents" : "hidden"}`}>{text[0].text}</span> */}
              </motion.button>
            </a>
            {/* <button className="border border-white rounded-full bg-white p-1 hover:w-10 hover:contents">
                        <Image src="/google 1.png" alt="google-Logo" width={22} height={22}></Image>
                        <span className="text-black  ">Sign In </span>
                    </button> */}
            <a href={process.env.NEXT_PUBLIC_FORTYTWO_ENDPOINT}>
              <motion.button
                whileHover={{ scale: 1.5 }}
                className={`border border-white rounded-full bg-white p-1 flex flex-row`}
              >
                <Image
                  src="/42_Logo 1.png"
                  alt="42Logo"
                  width={22}
                  height={22}
                ></Image>
                {/* <span className={`text-black ${text[0].status ? "contents" : "hidden"}`}>{text[0].text}</span> */}
              </motion.button>
            </a>
          </div>
          <div className="w-2/4 py-5 self-center">
            <div className="border border-white"> </div>
          </div>
          <p>OR</p>
        </div>
        <form className="flex flex-col items-center mt-3 gap-3 w-full">
          <div className="relative z-0 w-3/4 mb-6 group">
            <input
              type="input"
              name="username"
              id="username"
              className="block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />

            <label
              htmlFor="username"
              className="peer-focus:font-medium absolute text-sm
                     text-gray-500 pl-3 duration-300 transform -translate-y-8
                     scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                      peer-focus:scale-100 peer-focus:-translate-y-8 "
            >
              Username
            </label>
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
          </div>

          <motion.div
            key="buttonSign"
            layout={false}
            layoutId="button"
            initial={false}
            transition={{ type: "Tween" }}
            className="self-center  w-3/4"
          >
            <button
              className="uppercase w-full  shadow bg-[#0097E2] hover:bg-[#2C3B7C] 
                                transform transition duration-300 
                                hover:text-l hover:scale-110  text-white text-xs  text-center md:text-base hover:text-md
                                 py-2 px-12  rounded-full"
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
