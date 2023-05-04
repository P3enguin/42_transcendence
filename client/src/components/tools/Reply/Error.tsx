import { motion } from 'framer-motion';

function Error({ reply }: { reply: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute z-20 -mb-12 w-[300px] rounded
        border border-red-400 bg-red-600 px-4 py-3 text-center`}
    >
      <strong id="err-profile" className="font-bold">
        {reply}
      </strong>
    </motion.div>
  );
}

export default Error;
