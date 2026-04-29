import { motion } from "motion/react";

export default function Splash({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center text-white p-6 z-50"
      onAnimationComplete={() => {
        setTimeout(onComplete, 3000);
      }}
    >
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-3xl md:text-5xl font-bold text-center mb-4"
      >
        Ambition Plus Academic Care Dashboard
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-lg md:text-xl opacity-90 mb-12 font-medium"
      >
        This app is created by Imad Uddin
      </motion.p>
      
      <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
          className="w-full h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        />
      </div>
    </motion.div>
  );
}
