import Image from "next/image";
import { HomeIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function UserHomePage() {
    return (<div className="h-screen p-10">
        <div className="  w-full h-16 z-0 bg-gradient-to-r border  border-[#0097E2] rounded-tr-3xl rounded-bl-3xl
         from-[#28346C] via-[#121C46] to-[#263268]">

        </div>
        <div className="  absolute top-10 z-10 flex flex-col items-center w-16 h-5/6 overflow-hidden
              border rounded-tr-3xl rounded-bl-3xl 
              border-[#0097E2] bg-gradient-to-t from-[#141E4A] to-[#28346C] rounded">
            <a className="flex items-center justify-center mt-3" href="#">
                <Image src="/logo.png" alt="logo" width={39} height={41} className="" />
            </a>
            <div className=" border-b  border-t-0 border-r-0  rounded-bl-3xl
                border-[#0097E2] border w-full h-[20px] absolute top-[43px]">
            </div>
            <div className="flex flex-col items-center mt-3">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded  " href="#">
                    <Image src="/homeIcon.svg" alt="homeIcon" width={33} height={33} />
                </a>
            </div>

            <div className="flex flex-col items-center mt-3">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded  " href="#">
                    <Image src="/chatIcon.svg" alt="homeIcon" width={33} height={33} />
                </a>
            </div>
            <div className="flex flex-col items-center mt-3">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded  " href="#">
                <Image src="/gameIcon.svg" alt="homeIcon" width={33} height={33} />
                </a>
            </div>
            <div className="flex flex-col items-center mt-3">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded  " href="#">
                    <Image src="/profileIcon.svg" alt="homeIcon" width={33} height={33} />
                </a>
            </div>
            <div className="flex flex-col items-center mt-3">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded  " href="#">
                    <Image src="/settingsIcon.svg" alt="homeIcon" width={33} height={33} />
                </a>
            </div>
	    </div>
    </div>);
    
}

export default UserHomePage;