import { Label } from "flowbite-react";
import { AnimateSharedLayout, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";


function LoginComponent() {

    const [text,changeText]=useState([{text:"Sign In",status:true},
                                  {text:"gg",status:false}]);

    return (<div className="w-1/4 flex flex-col text-2xl ">
        <motion.div key="login" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
            className="">
            <div className="text-white flex flex-col items-center gap-3 ">
                <p >CONTINUE WITH</p>
                <div className="flex flex-row gap-5">
                    <motion.button whileHover={{scale: 1.5}} 
                        className={`border border-white rounded-full bg-white p-1 flex flex-row `}
                        >

                        <Image src="/google 1.png" alt="google-Logo" width={22} height={22} className=""></Image>
                        {/* <span className={`text-black ${text[0].status ? "contents" : "hidden"}`}>{text[0].text}</span> */}

                    </motion.button>
                    {/* <button className="border border-white rounded-full bg-white p-1 hover:w-10 hover:contents">
                        <Image src="/google 1.png" alt="google-Logo" width={22} height={22}></Image>
                        <span className="text-black  ">Sign In </span>
                    </button> */}
                    <motion.button whileHover={{scale: 1.5}} 
                        className={`border border-white rounded-full bg-white p-1 flex flex-row`}>

                        <Image src="/42_Logo 1.png" alt="42Logo" width={22} height={22}></Image>
                        {/* <span className={`text-black ${text[0].status ? "contents" : "hidden"}`}>{text[0].text}</span> */}
                    </motion.button>
                   
                </div>
               
                <div className="w-2/4 py-5 self-center">
                        <div className="border border-white"> </div>
                </div>
                <p>OR</p>
            </div>
            <div>
            <form className="flex flex-col items-center ">
                <div className="relative z-0 w-3/4 mb-6 group">
                    <input type="input" name="username" id="username" 
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent 
                    border-0 border-b-2 border-gray-300 appearance-none dark:text-white
                     dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none 
                     focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="username" className="peer-focus:font-medium absolute text-sm
                     text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 
                     scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
                      peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                      peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                </div>
                <div className="relative z-0 w-3/4 mb-6 group">
                    <input type="password" name="password" id="password" 
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent 
                    border-0 border-b-2 border-gray-300 appearance-none dark:text-white
                     dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none
                      focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-sm
                     text-gray-500 dark:text-gray-400 duration-300 transform 
                     -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0
                      peer-focus:text-blue-600 peer-focus:dark:text-blue-500
                       peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                       peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                </div>
                    <motion.div key="buttonSign" layout={false} layoutId='button'  initial={false} transition={{type: "Tween" }}
                        className="self-center w-3/4" >
                        <button className="uppercase w-full  shadow bg-[#0097E2] hover:bg-[#2C3B7C] 
                                transform transition duration-300 
                                hover:text-l hover:scale-110  text-white text-s hover:text-md
                                font-bold py-2 px-12  rounded-full">
                                SIGN IN
                        </button>
                    </motion.div>
            </form>
            </div>
        </motion.div>
    </div>  );
}

export default LoginComponent;