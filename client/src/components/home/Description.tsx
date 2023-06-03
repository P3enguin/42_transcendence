import { motion } from 'framer-motion';
interface textRef {
  text0Ref: React.RefObject<HTMLDivElement>;
  text1Ref: React.RefObject<HTMLDivElement>;
}

function Description({ text0Ref, text1Ref }: textRef) {
  return (
    <>
      <motion.div
        ref={text0Ref}
        key="descrip-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut', duration: 1.7 }}
        exit={{ opacity: 0 }}
        className="absolute right-[-10%]  top-[8%]  rotate-90 p-[12%]  text-center"
      >
        Playing video games is good. Programming them is great.But then… Setting
        up tournaments is even better!{' '}
      </motion.div>
      <motion.div
        ref={text1Ref}
        key="descrip-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut', duration: 1.5 }}
        exit={{ opacity: 0 }}
        className="absolute  bottom-[8%]  left-[-9%] rotate-90    pt-[3%] text-center sm:p-12"
      >
        Ft_transcendence is the last project in 42 common-core cursus.With
        ft_transcendence, you learn how to recreate the 1979 classic Pong,
        integrate it into a website and turn it into a competitive gaming
        platform.
      </motion.div>
    </>
  );
}

export default Description;
