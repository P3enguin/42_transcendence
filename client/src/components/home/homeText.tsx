import { Props } from "@headlessui/react/dist/types";
import { AnimateSharedLayout, motion } from "framer-motion";

export interface handleFunc {
  handleJoin: (event:React.MouseEvent) => void
}

function HomeText({ handleJoin }: handleFunc) {
  return (
    <div className="text-center xl:text-left w-auto xl:w-1/4 css ">
      <motion.div
        key="text1"
        initial={{ opacity: 0 }}
        layout={true}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h3 className="text-3xl xl:text-6xl text-white mb-1 md:mb-10 sh">
          Ponigator
        </h3>
        <p className="mt-4 text-xl xl:text-4xl md:text-3xl leading-relaxed mb-1 md:mb-10  text-white ">
          The Ultimate Exprerience For The Mighty Ping Context!
        </p>
        <div className="pt-5">
          <motion.div
            key="buttonSign1"
            layoutId="button"
            initial={false}
            transition={{ type: "Tween" }}
          >
            <button
              onClick={handleJoin}
              className="uppercase mx-auto shadow bg-[#0097E2] hover:bg-[#2C3B7C] 
                            transform transition duration-300 
                            hover:text-l hover:scale-110  text-white text-s hover:text-l 
                            font-bold py-2 px-12 rounded-full"
            >
              JOIN NOW
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default HomeText;
