import { motion } from "framer-motion";

interface VICoinProps {
  onClick: () => void;
}

export function VICoin({ onClick }: VICoinProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-80 h-80 rounded-full bg-gradient-to-br from-violet-800/50 to-black border-8 border-violet-500/30 shadow-2xl shadow-violet-500/20 flex items-center justify-center cursor-pointer"
    >
      <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-white to-violet-200 animate-gradient tracking-widest">
        VI
      </div>
    </motion.div>
  );
}