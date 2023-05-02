import { motion } from 'framer-motion';

function Success({ reply }: { reply: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute z-20 -mb-12 w-[300px] rounded border border-teal-500 bg-lime-500
          px-4  py-3 text-center text-teal-900 shadow-md `}
    >
      <strong id="succ-profile" className="font-bold">
        {reply}
      </strong>
    </motion.div>
  );
}

export default Success;
