import Image from "next/image";
import { motion } from "framer-motion";

function UpdateProfile() {
    return (<div className="border-2 border-gray-300 p-12  rounded-md w-1/2 mg-top"> 
            <div className="flex flex-col justify-center items-center">
                <Image src="/wallpaper.png" alt="wallpaper" className="rounded-3xl" width={461} height={205}/>
                <label htmlFor="pfp">
                    <div className="pfp-container">
                        <Image src="/pfp1.png" alt="pfp" className="pfp -mt-10 pt-3" width={100} height={100}/>
                    </div>
                </label>
                <input id="pfp" type="file" />
            </div>
            <svg style={{visibility: "hidden",position:"absolute"}} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
                    <filter id="round">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />    
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                    </filter>
                </defs>
            </svg>
            <form className="grid grid-cols-2 justify-items-center	  mt-3 gap-3">
                <div className="relative z-0 w-3/4 mb-6 group">
                    <input type="input" name="username" id="username" 
                    className="block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                     <label htmlFor="username" className="peer-focus:font-medium absolute text-sm
                     text-gray-500 pl-3 duration-300 transform -translate-y-8
                     scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                      peer-focus:scale-100 peer-focus:-translate-y-8 ">First Name</label>
                </div>
                <div className="relative z-0 w-3/4 mb-6 group">
                    <input type="password" name="password" id="password" 
                    className="block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-sm
                     text-gray-500 px-3 duration-300 transform 
                     -translate-y-8 scale-100 top-3 -z-10 origin-[0] peer-focus:left-0
                      peer-focus:text-blue-600 
                       peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                       peer-focus:scale-100 peer-focus:-translate-y-8">Last Name</label>
                </div>
                <div className="relative z-0 w-3/4 mb-6 group">
                    <input type="input" name="username" id="username" 
                    className="block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                      
                     <label htmlFor="username" className="peer-focus:font-medium absolute text-sm
                     text-gray-500 pl-3 duration-300 transform -translate-y-8
                     scale-100 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600
                      peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                      peer-focus:scale-100 peer-focus:-translate-y-8 ">Username</label>
                </div>
                <div className="relative z-0 w-3/4 mb-6 group">
                    <input type="password" name="password" id="password" 
                    className="block py-2.5 px-3 w-full text-sm text-white bg-transparent 
                    border-2 rounded-full border-gray-300 appearance-none 
                      focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-sm
                     text-gray-500 px-3 duration-300 transform 
                     -translate-y-8 scale-100 top-3 -z-10 origin-[0] peer-focus:left-0
                      peer-focus:text-blue-600 
                       peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                       peer-focus:scale-100 peer-focus:-translate-y-8">Password</label>
                </div>
                    <motion.div key="buttonSign" layout={false} layoutId='button'  initial={false} transition={{type: "Tween" }}
                        className=" w-1/2 col-span-2" >
                        <button className="uppercase w-full  shadow bg-[#0097E2] hover:bg-[#2C3B7C] 
                                transform transition duration-300 
                                hover:text-l hover:scale-110  text-white text-xs  text-center md:text-base hover:text-md
                                 py-2 px-12  rounded-full">
                                Upadate
                        </button>
                    </motion.div>
            </form>
        </div> );
}

export default UpdateProfile;