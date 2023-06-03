import { motion } from 'framer-motion';
import Image from 'next/image';
interface contactRef {
  contact1Ref: React.RefObject<HTMLDivElement>;
  contact2Ref: React.RefObject<HTMLDivElement>;
  contact3Ref: React.RefObject<HTMLDivElement>;
  contact4Ref: React.RefObject<HTMLDivElement>;
}

function Contact({
  contact1Ref,
  contact2Ref,
  contact3Ref,
  contact4Ref,
}: contactRef) {
  return (
    <>
      <motion.div
        ref={contact1Ref}
        key="contact-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut' }}
        exit={{ opacity: 0 }}
        className="absolute  bottom-[7.7%]  left-[-10%] -rotate-90   "
      >
        <a
          className="block h-[100%] w-[97.6%] opacity-20 transition-opacity duration-700  ease-in hover:opacity-100"
          href=""
        >
          {/* eslint-disable-next-line */}
          <img
            className="h-[100%] w-[100%]"
            src="https://badge.mediaplus.ma/darkblue/mbabela"
            alt="mbabela's 42 stats"
            loading="eager"
            width={100}
            height={100}
          />
        </a>
      </motion.div>
      <motion.div
        ref={contact2Ref}
        key="contact-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut' }}
        exit={{ opacity: 0 }}
        className="absolute  right-[-11%]  top-[6.5%]  -rotate-90    "
      >
        <a
          className="block h-[100%] w-[97.6%] opacity-20 transition-opacity duration-700  ease-in hover:opacity-100"
          href=""
        >
          {/* eslint-disable-next-line */}
          <img
            className="h-[100%] w-[100%]"
            src="https://badge.mediaplus.ma/darkblue/hel-makh"
            alt="hel-makh's 42 stats"
            loading="eager"
            width={100}
            height={100}
          />
        </a>
      </motion.div>
      <motion.div
        ref={contact3Ref}
        key="contact-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut' }}
        exit={{ opacity: 0 }}
        className="absolute bottom-[7.7%]  right-[-11%]  -rotate-90   "
      >
        <a
          className="block h-[100%] w-[97.6%] opacity-20 transition-opacity duration-700  ease-in hover:opacity-100"
          href=""
        >
          {/* eslint-disable-next-line */}
          <img
            className="h-[100%] w-[100%]"
            src="https://badge.mediaplus.ma/darkblue/ybensell"
            alt="ael-hadd's 42 stats"
            loading="eager"
            width={100}
            height={100}
            sizes="(max-width: max-w-full) 100vw"
          />
        </a>
      </motion.div>
      <motion.div
        ref={contact4Ref}
        key="contact-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut' }}
        exit={{ opacity: 0 }}
        className="absolute  left-[-10%]  top-[6.5%] -rotate-90   "
      >
        <a
          className="block h-[100%] w-[97.6%] opacity-20 transition-opacity duration-700  ease-in hover:opacity-100"
          href=""
        >
          {/* eslint-disable-next-line */}
          <img
            className="h-[100%] w-[100%]"
            src="https://badge.mediaplus.ma/darkblue/ael-hadd"
            alt="ael-hadd's 42 stats"
            loading="eager"
            width={100}
            height={100}
          />
        </a>
      </motion.div>
    </>
  );
}

export default Contact;
