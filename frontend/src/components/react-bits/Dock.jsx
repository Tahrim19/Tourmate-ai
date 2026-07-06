import { motion } from 'framer-motion';

export default function Dock({ children, className = "" }) {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.15 }}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-bg-card/75 backdrop-blur-xl border border-[#252525]/80 rounded-2xl py-3 px-4 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[95%] sm:max-w-lg w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
