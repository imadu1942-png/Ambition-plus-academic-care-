import { motion, AnimatePresence } from "motion/react";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export default function Splash({ onComplete }: { onComplete: () => void }) {
  const [startAnimation, setStartAnimation] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Initial blank delay
    const timer = setTimeout(() => setStartAnimation(true), 500);
    
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 70); // Approx 7 seconds to fill

    // Total duration before transition
    const totalTimer = setTimeout(onComplete, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(totalTimer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-[9999] overflow-hidden"
    >
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      <AnimatePresence>
        {startAnimation && (
          <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
            {/* Logo Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="mb-10 relative"
            >
              <div className="w-24 h-24 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
                <BookOpen className="w-12 h-12 text-blue-400" strokeWidth={1.5} />
              </div>
              {/* Glow Effect */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 blur-3xl -z-10"
              />
            </motion.div>

            {/* Text Sequence */}
            <div className="space-y-4 mb-16">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 1.5 }}
                className="text-2xl md:text-3xl font-black tracking-tight text-white/95"
              >
                Ambition Plus Academic Care Leaderboard
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, duration: 1.2 }}
                className="text-blue-400 font-black tracking-[0.3em] text-xs md:text-sm uppercase"
              >
                HSC 2026 Batch
              </motion.p>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 4.0, duration: 1.2 }}
                className="text-slate-500 text-sm font-medium tracking-wide"
              >
                This app is created by <span className="text-slate-300 font-bold">Imad Uddin</span>
              </motion.p>
            </div>

            {/* Premium Progress Bar */}
            <div className="w-64 max-w-full space-y-3">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                <span>Loading</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-20 opacity-20">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.2, 0.05],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" 
        />
      </div>
    </motion.div>
  );
}
