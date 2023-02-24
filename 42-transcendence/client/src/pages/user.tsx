import Image from "next/image";


function UserHomePage() {
    return (<div className="h-screen p-10">
        <div className="  w-full h-16 z-0 bg-gradient-to-r border  border-[#0097E2] rounded-tr-3xl rounded-bl-3xl
         from-[#28346C] via-[#121C46] to-[#263268]">

        </div>
        <div className="  absolute top-10 z-10 flex flex-col items-center w-16 h-full overflow-hidden
             text-gray-400 border rounded-tr-3xl rounded-bl-3xl 
              border-[#0097E2] bg-gradient-to-t from-[#141E4A] to-[#28346C] rounded">
		<a className="flex items-center justify-center mt-3" href="#">
			<Image src="/logo.png" alt="logo" width={39} height={41} className="" />
		</a>
        <div className=" border-b  border-t-0 border-r-0  rounded-bl-3xl
             border-[#0097E2] border w-full h-[20px] absolute top-[43px]">

        </div>
		<div className="flex flex-col items-center mt-3">
			<a className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300" href="#">
				<svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				 	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
			</a>
        	</div>
	</div>
    </div>);
    
}

export default UserHomePage;