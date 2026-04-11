import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#04090b]">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/20 blur-[120px] rounded-full opacity-50 shadow-[0_0_100px_rgba(20,184,166,0.1)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group"
        >
          {/* Logo Glow Ring */}
          <div className="absolute inset-0 rounded-2xl bg-brand-500/20 blur-xl group-hover:bg-brand-500/30 transition-all duration-500 animate-pulse" />

          {/* Logo Box */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-2xl border border-white/20">
            <Globe className="w-10 h-10 text-black drop-shadow-lg" />
          </div>
        </motion.div>

        {/* Text Loader */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            SPITConnect
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-brand-500 animate-[bounce_1s_infinite]" />
            <div className="h-1 w-1 rounded-full bg-brand-500 animate-[bounce_1s_infinite_150ms]" />
            <div className="h-1 w-1 rounded-full bg-brand-500 animate-[bounce_1s_infinite_300ms]" />
          </div>
        </motion.div>
      </div>

      {/* Version Tag */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400"
      >
        v1.2.0 • Advanced Campus Engine
      </motion.p>
    </div>
  );
}
