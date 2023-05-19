import { Props } from '@headlessui/react/dist/types';
import { AnimateSharedLayout, motion } from 'framer-motion';

export interface handleFunc {
  handleJoin: (event: React.MouseEvent) => void;
}

function HomeText({ handleJoin }: handleFunc) {
  return (
    <div className="xl:mb-[150px]  w-auto text-center xl:w-1/4 xl:text-left ">
      <motion.div
        key="text1"
        initial={{ opacity: 0 }}
        layout={true}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h3 className=" mb-1 text-white lg:mb-10  text-4xl lg:text-5xl">
          Ponigator
        </h3>
        <p className="mt-4 mb-1 2xl:text-3xl  md:max-2xl:text-2xl text-xl leading-relaxed text-white lg:mb-10  ">
          The Ultimate Exprerience For The Mighty Ping Context!
        </p>
        <div className="pt-5">
          <motion.div
            key="buttonSign1"
            layoutId="button"
            initial={false}
            transition={{ type: 'Tween' }}
          >
            <button
              onClick={handleJoin}
              className="hover:text-l text-s hover:text-l mx-auto transform 
                            rounded-full bg-[#0097E2] py-2 
                            px-12 font-bold  uppercase text-white shadow 
                            transition duration-300 hover:scale-110 hover:bg-[#2C3B7C]"
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
