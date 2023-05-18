import { motion } from 'framer-motion';

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
        // transition={{ ease: 'easeOut' }}
        exit={{ opacity: 0 }}
        className="absolute  bottom-[8%]  left-[-9%] -rotate-90  border "
      >
        <a
          className="block h-[100%] max-w-full opacity-20 transition-opacity duration-700  ease-in hover:opacity-100"
          href=""
        >
          <img
            className="block h-full max-w-full"
            src="https://badge.mediaplus.ma/darkblue/mbabela"
            alt="mbabela's 42 stats"
            loading="eager"
          />
        </a>
      </motion.div>
      <motion.div
        ref={contact2Ref}
        key="contact-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // transition={{ ease: 'easeOut' }}
        exit={{ opacity: 0 }}
        className="absolute  right-[-10%]  top-[7%]  -rotate-90  border  "
      >
        <a
          className="block h-[100%] max-w-full opacity-20 transition-opacity duration-700  ease-in hover:opacity-100"
          href=""
        >
          <img
            className="block h-full max-w-full"
            src="https://badge.mediaplus.ma/darkblue/hel-makh"
            alt="hel-makh's 42 stats"
            loading="eager"
          />
        </a>
      </motion.div>
      <motion.div
        ref={contact3Ref}
        key="contact-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // transition={{ ease: 'easeOut' }}
        exit={{ opacity: 0 }}
        className="absolute right-[-11%]  bottom-[7.5%]  -rotate-90  border "
      >
        <a
          className="block h-[100%] max-w-full opacity-20 transition-opacity duration-700  ease-in hover:opacity-100"
          href=""
        >
         <img
            className="block h-full max-w-full"
            src="https://badge.mediaplus.ma/darkblue/ybensell"
            alt="ael-hadd's 42 stats"
            loading="eager"
          />
          </a>
      </motion.div>
      <motion.div
        ref={contact4Ref}
        key="contact-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // transition={{ ease: 'easeOut' }}
        exit={{ opacity: 0 }}
        className="absolute  left-[-9%]  top-[7%] -rotate-90 border  "
      >
        <a
          className="block h-[100%] max-w-full opacity-20 transition-opacity duration-700  ease-in hover:opacity-100"
          href=""
        >
          <img
            className="block h-full max-w-full"
            src="https://badge.mediaplus.ma/darkblue/ael-hadd"
            alt="ael-hadd's 42 stats"
            loading="eager"
          />
        </a>
      </motion.div>
    </>
  );
}

export default Contact;
