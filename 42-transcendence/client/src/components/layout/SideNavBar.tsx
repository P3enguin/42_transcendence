import Image from "next/image";
import { useState,useEffect } from "react";
import { motion,AnimatePresence } from "framer-motion";

function SideNavBar() {

    const [svgIndex,setSvgIndex] = useState(0);
    const [isVisible,setVisible] = useState(false);

    const variants = {
        open: { opacity: 1},
        closed: { opacity: 0 },
    }

    function handleSvgIndex(index : number) {
        setSvgIndex(index)
    }

    function toggleSideBar() {
        setVisible(!isVisible);
    }
    useEffect(() => {
        const handleResize = () => {
          // Get the current screen width
          const screenWidth = window.innerWidth;
    
          // If the screen width is medium or larger, hide the sidebar
          if (screenWidth >= 640) {
            setVisible(true);
          }
          else
            setVisible(false);
        };
    
        // Add a resize event listener to the window object
        window.addEventListener('resize', handleResize);
    
        // Call the resize handler initially to ensure that the sidebar is hidden if necessary
        handleResize();
    
        // Remove the resize event listener when the component is unmounted
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return (

    <div className="sm:p-10">
        {/* navbar */}
        <div className="  w-full h-16 z-0 bg-gradient-to-r border  border-[#0097E2] rounded-tr-3xl rounded-bl-3xl
        from-[#28346C] via-[#121C46] to-[#263268] flex flex-row items-center sm:justify-center justify-between">
            <div className="flex flex-row gap-10 items-center">
                <a className="ml-3 mt-1 sm:hidden flex" href="#" >
                    <Image src="/logo.png" alt="logo" width={39} height={41}  />
                </a>
                <button type="button" className="text-[#8BD9FF] rounded-lg sm:hidden"
                    onClick={toggleSideBar}>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
            </div>
            <form className="w-1/2 sm:w-1/4 flex flex-row items-center justify-center ">
                <input type="search" id="search-bar" placeholder="search here for players,channels... " 
                        className="bg-[#2F3C78] rounded-xl border-none w-full text-sm text-white overflow-hidden truncate " ></input>
                <label htmlFor="search-bar " className="relative right-7 top-1">
                    <button type="submit">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.59922 17.3065C13.3484 17.3065 17.1984 13.4323 17.1984 8.65324C17.1984 3.87419 13.3484 0 8.59922 0C3.85 0 0 3.87419 0 8.65324C0 13.4323 3.85 17.3065 8.59922 17.3065Z" fill="#8BD9FF"/>
                            <path opacity="0.4" d="M18.6746 19.9553C18.3406 19.9445 18.0229 19.807 17.7854 19.5705L15.7489 17.1902C15.3123 16.7909 15.2766 16.1123 15.6689 15.6689C15.8525 15.4831 16.1021 15.3787 16.3625 15.3787C16.6229 15.3787 16.8726 15.4831 17.0562 15.6689L19.6172 17.7181C19.9862 18.0957 20.1 18.6563 19.9079 19.1492C19.7158 19.6422 19.2536 19.9754 18.728 20L18.6746 19.9553Z" fill="#8BD9FF"/>
                        </svg>
                    </button>
                </label>
            </form>
            <div className="absolute hidden sm:flex right-12">
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" 
                    className= "fill-[#8BD9FF] hover:fill-red-700 ease-in duration-200">
                <path opacity="0.4" d="M0 5.92933C0 2.66133 2.70698 0 6.03271 0H12.6475C15.9665 0 18.6667 2.65333 18.6667 5.916V20.7373C18.6667 24.0067 15.9597 26.6667 12.6326 26.6667H6.0205C2.7002 26.6667 0 24.0133 0 20.7507V19.4973V5.92933Z" />
                <path d="M26.3719 12.6064L22.5775 8.72771C22.1853 8.32771 21.5542 8.32771 21.1634 8.73037C20.7738 9.13304 20.7751 9.78237 21.166 10.1824L23.245 12.3064H21.2517H10.0646C9.5127 12.3064 9.0647 12.7664 9.0647 13.333C9.0647 13.901 9.5127 14.3597 10.0646 14.3597H23.245L21.166 16.4837C20.7751 16.8837 20.7738 17.533 21.1634 17.9357C21.3594 18.137 21.6153 18.2384 21.8724 18.2384C22.1269 18.2384 22.3827 18.137 22.5775 17.9384L26.3719 14.061C26.5602 13.8677 26.6667 13.6064 26.6667 13.333C26.6667 13.061 26.5602 12.7997 26.3719 12.6064Z" />
            </svg>
            </div>
        </div>

        {/* SideBar */}

        <motion.nav  animate={isVisible ? "open" : "closed"}
                variants={variants}
                exit={{ opacity: 0 }}
                >
        <div id="userSideBar" className={`absolute top-0 sm:top-10 z-10  flex-col items-center w-16 h-5/6 overflow-hidden
            border rounded-tr-3xl rounded-bl-3xl border-[#0097E2] bg-gradient-to-t from-[#141E4A]
            to-[#28346C] gap-6    ${isVisible ? 'flex' : 'hidden'}` }>
            <a className="flex items-center justify-center mt-3" href="#" >
                <Image src="/logo.png" alt="logo" width={39} height={41} />
            </a>
            <div className=" border-b  border-t-0 border-r-0 border-l  rounded-bl-3xl
                border-[#0097E2]  w-16 h-[20px] absolute top-[43px]">
            </div>
            <div className=" ">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded"  href="#"
                    onClick={() => handleSvgIndex(0)}>
                    <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg" 
                        className={`${svgIndex == 0 ? "fill-[#01FD91]" : "fill-[#8BD9FF]"} hover:fill-[#0097E2] ease-in duration-200`}>
                        <path d="M9.9656 28.1732V23.5729C9.96558 22.4071 10.9135 21.4601 12.0877 21.4527H16.3989C17.5783 21.4527 18.5344 22.4019 18.5344 23.5729V28.1598C18.5344 29.1709 19.356 29.9926 20.3744 30H23.3157C24.6895 30.0035 26.0081 29.4642 26.9808 28.5011C27.9534 27.5379 28.5 26.2301 28.5 24.8663V11.7988C28.5 10.6971 28.0081 9.65207 27.1569 8.94525L17.1645 1.0114C15.4178 -0.376316 12.9231 -0.331488 11.2281 1.11808L1.45052 8.94525C0.559111 9.63123 0.0263284 10.6793 0 11.7988V24.853C0 27.6956 2.32107 30 5.18426 30H8.05844C8.54876 30.0035 9.02023 29.8126 9.36821 29.4696C9.71619 29.1267 9.91189 28.66 9.91187 28.1732H9.9656Z" />
                    </svg>
                </a>
            </div>
            <div className="">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded " href="#"
                    onClick={() => handleSvgIndex(1)}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" 
                        className={`${svgIndex == 1 ? "fill-[#01FD91]" : "fill-[#8BD9FF]"} hover:fill-[#0097E2] ease-in duration-200`}>
                        <path opacity="0.4" d="M15.03 0C6.315 0 0 7.11 0 15C0 17.52 0.735 20.115 2.025 22.485C2.265 22.875 2.295 23.37 2.13 23.835L1.125 27.195C0.9 28.005 1.59 28.605 2.355 28.365L5.385 27.465C6.21 27.195 6.855 27.54 7.6215 28.005C9.8115 29.295 12.54 29.955 15 29.955C22.44 29.955 30 24.21 30 14.955C30 6.975 23.55 0 15.03 0Z" />
                        <path d="M8.05513 13.0952C9.12013 13.0952 9.97513 13.9502 9.97513 15.0152C9.97513 16.0652 9.12013 16.9202 8.05513 16.9352C7.00513 16.9352 6.13513 16.0652 6.13513 15.0152C6.13513 13.9502 6.99013 13.0952 8.05513 13.0952ZM14.9707 13.0952C16.0357 13.0952 16.8907 13.9502 16.8907 15.0152C16.8907 16.0652 16.0357 16.9352 14.9707 16.9352C13.9057 16.9202 13.0507 16.0652 13.0507 15.0002C13.0507 13.9502 13.9207 13.0802 14.9707 13.0952ZM21.8854 13.0952C22.9504 13.0952 23.8054 13.9502 23.8054 15.0152C23.8054 16.0652 22.9504 16.9352 21.8854 16.9352C20.8204 16.9352 19.9654 16.0652 19.9654 15.0152C19.9654 13.9502 20.8204 13.0952 21.8854 13.0952Z" />
                    </svg>
                </a>
            </div>
            <div className=" ">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded  " href="#"
                    onClick={() => handleSvgIndex(2)}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" 
                        className={`${svgIndex == 2 ? "fill-[#01FD91]" : "fill-[#8BD9FF]"} hover:fill-[#0097E2] ease-in duration-200`}>
                        <path opacity="0.4" d="M16.9576 5.82364V6.09821C16.2216 6.08376 15.4856 6.08376 14.7496 6.08376V5.83809C14.7496 4.84099 13.9105 4.03175 12.9095 4.03175H11.4522C9.78884 4.03175 8.43457 2.70229 8.43457 1.0838C8.43457 0.491325 8.93506 0 9.53859 0C10.1568 0 10.6426 0.491325 10.6426 1.0838C10.6426 1.51733 11.0106 1.86414 11.4522 1.86414H12.9095C15.1323 1.87859 16.9429 3.65603 16.9576 5.82364Z" />
                        <path d="M14.7498 6.08405C15.4858 6.08405 16.2218 6.08405 16.9578 6.0985C18.3562 6.0985 19.7547 6.1274 21.1678 6.14185C26.2758 6.14185 30 9.78343 30 14.8123V21.2718C30 26.3006 26.2758 29.9422 21.1678 29.9422C19.1217 29.9855 17.0756 30 15.0147 30C12.9539 30 10.8783 29.9855 8.83219 29.9422C3.72424 29.9422 0 26.3006 0 21.2718V14.8123C0 9.78343 3.72424 6.14185 8.84691 6.14185C10.7753 6.11295 12.7478 6.08405 14.7498 6.08405ZM10.6281 14.3499C10.0098 14.3499 9.52404 14.8412 9.52404 15.4337V16.951H7.96369C7.36016 16.951 6.85967 17.4423 6.85967 18.0348C6.85967 18.6417 7.36016 19.1186 7.96369 19.1186H9.52404V20.6504C9.52404 21.2429 10.0098 21.7342 10.6281 21.7342C11.2316 21.7342 11.7321 21.2429 11.7321 20.6504V19.1186H13.2777C13.8813 19.1186 14.3817 18.6417 14.3817 18.0348C14.3817 17.4423 13.8813 16.951 13.2777 16.951H11.7321V15.4337C11.7321 14.8412 11.2316 14.3499 10.6281 14.3499ZM22.1982 19.4799H22.051C21.4328 19.4799 20.947 19.9712 20.947 20.5637C20.947 21.1706 21.4328 21.6475 22.051 21.6475H22.1982C22.8018 21.6475 23.3023 21.1706 23.3023 20.5637C23.3023 19.9712 22.8018 19.4799 22.1982 19.4799ZM19.6811 14.5088H19.5339C18.9156 14.5088 18.4298 15.0001 18.4298 15.5926C18.4298 16.1996 18.9156 16.6764 19.5339 16.6764H19.6811C20.2846 16.6764 20.7851 16.1996 20.7851 15.5926C20.7851 15.0001 20.2846 14.5088 19.6811 14.5088Z" />
                    </svg>
                </a>
            </div>
            <div className=" ">
                <a className="flex items-center justify-center w-12 h-12 mt-2 rounded  " href="#"
                    onClick={() => handleSvgIndex(3)}>
                    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className={`${svgIndex == 3 ? "fill-[#01FD91]" : "fill-[#8BD9FF]"} hover:fill-[#0097E2] ease-in duration-200`}>
                        <path d="M11.9955 19.7623C5.526 19.7623 0 20.7823 0 24.8623C0 28.9438 5.4915 29.9998 11.9955 29.9998C18.465 29.9998 23.991 28.9813 23.991 24.8998C23.991 20.8183 18.501 19.7623 11.9955 19.7623Z"/>
                        <path opacity="0.4" d="M11.9955 15.876C16.4025 15.876 19.9335 12.3435 19.9335 7.938C19.9335 3.5325 16.4025 0 11.9955 0C7.59 0 4.0575 3.5325 4.0575 7.938C4.0575 12.3435 7.59 15.876 11.9955 15.876Z" />
                    </svg>
                </a>
            </div>

            <div className="flex flex-col absolute bottom-0 items-center gap-7">
                <div className="flex sm:hidden">
                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" 
                            className= "fill-[#8BD9FF] hover:fill-red-700 ease-in duration-200">
                        <path opacity="0.4" d="M0 5.92933C0 2.66133 2.70698 0 6.03271 0H12.6475C15.9665 0 18.6667 2.65333 18.6667 5.916V20.7373C18.6667 24.0067 15.9597 26.6667 12.6326 26.6667H6.0205C2.7002 26.6667 0 24.0133 0 20.7507V19.4973V5.92933Z" />
                        <path d="M26.3719 12.6064L22.5775 8.72771C22.1853 8.32771 21.5542 8.32771 21.1634 8.73037C20.7738 9.13304 20.7751 9.78237 21.166 10.1824L23.245 12.3064H21.2517H10.0646C9.5127 12.3064 9.0647 12.7664 9.0647 13.333C9.0647 13.901 9.5127 14.3597 10.0646 14.3597H23.245L21.166 16.4837C20.7751 16.8837 20.7738 17.533 21.1634 17.9357C21.3594 18.137 21.6153 18.2384 21.8724 18.2384C22.1269 18.2384 22.3827 18.137 22.5775 17.9384L26.3719 14.061C26.5602 13.8677 26.6667 13.6064 26.6667 13.333C26.6667 13.061 26.5602 12.7997 26.3719 12.6064Z" />
                    </svg>
                </div>
                <div className="  mb-3 ">
                    <a className="flex items-center justify-center w-12 h-12 mt-2 " href="#">
                        <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                            className="fill-[#8BD9FF] hover:fill-[#0097E2] ease-in duration-200">
                            <path d="M14.2681 19.245C11.8614 19.245 9.91455 17.37 9.91455 15.015C9.91455 12.66 11.8614 10.77 14.2681 10.77C16.6748 10.77 18.5756 12.66 18.5756 15.015C18.5756 17.37 16.6748 19.245 14.2681 19.245Z" />
                            <path opacity="0.4" d="M28.0952 18.555C27.8039 18.105 27.39 17.655 26.8535 17.37C26.4243 17.16 26.1484 16.815 25.9031 16.41C25.1213 15.12 25.5812 13.425 26.8842 12.66C28.4171 11.805 28.9077 9.9 28.0185 8.415L26.9915 6.645C26.1177 5.16 24.2015 4.635 22.6839 5.505C21.3349 6.225 19.6027 5.745 18.8209 4.47C18.5757 4.05 18.4377 3.6 18.4684 3.15C18.5143 2.565 18.3304 2.01 18.0545 1.56C17.4873 0.63 16.4602 0 15.3258 0H13.1644C12.0454 0.03 11.0183 0.63 10.4511 1.56C10.1598 2.01 9.99122 2.565 10.0219 3.15C10.0525 3.6 9.91457 4.05 9.6693 4.47C8.88751 5.745 7.15529 6.225 5.82164 5.505C4.2887 4.635 2.38786 5.16 1.49876 6.645L0.471688 8.415C-0.402085 9.9 0.0884544 11.805 1.60606 12.66C2.90906 13.425 3.36894 15.12 2.60247 16.41C2.34187 16.815 2.06594 17.16 1.63672 17.37C1.11552 17.655 0.655641 18.105 0.410371 18.555C-0.156815 19.485 -0.126157 20.655 0.44103 21.63L1.49876 23.43C2.06594 24.39 3.12367 24.99 4.22738 24.99C4.74858 24.99 5.36175 24.84 5.85229 24.54C6.23553 24.285 6.69541 24.195 7.20128 24.195C8.71888 24.195 9.99122 25.44 10.0219 26.925C10.0219 28.65 11.4322 30 13.2104 30H15.2952C17.0581 30 18.4684 28.65 18.4684 26.925C18.5143 25.44 19.7867 24.195 21.3043 24.195C21.7948 24.195 22.2547 24.285 22.6533 24.54C23.1438 24.84 23.7417 24.99 24.2782 24.99C25.3666 24.99 26.4243 24.39 26.9915 23.43L28.0645 21.63C28.6164 20.625 28.6624 19.485 28.0952 18.555Z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div> 

        </motion.nav>
    </div>);
}

export default SideNavBar;
