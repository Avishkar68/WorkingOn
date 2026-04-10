import { motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function WelcomeModal({ close, openCreatePost }) {
  const modalContent = (
    <motion.div 
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[9999] bg-black/60 m-0 p-0 top-0 left-0"
    >
      
      {/* Container with a subtle border gradient for that 'premium' look */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative p-[1px] rounded-3xl bg-gradient-to-b from-white/20 to-transparent"
      >
        
        <div className="relative bg-[#09090b]/90 backdrop-blur-2xl p-10 rounded-[22px] w-[540px] text-center overflow-hidden shadow-2xl">
          
          {/* Animated Background Orbs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/15 blur-[100px] rounded-full"></div>

          {/* Header Section */}
          <div className="space-y-2 mb-8">
            <span className="px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
              Verified SPITian
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white pt-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-indigo-500">SPITConnect</span>
            </h2>
          </div>

          {/* Body Text: Adjusted sizing for better visual balance */}
          <p className="text-gray-300 text-lg leading-relaxed font-medium mb-10">
            You're officially inside the campus hub. <br /> 
            <span className="text-gray-400 font-normal">Ready to build your streak and rank up?</span>
          </p>

          {/* Action Area */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                close()
                if (typeof openCreatePost === "function") {
                  openCreatePost()
                }
              }}
              className="group relative w-full overflow-hidden rounded-xl btn-primary px-8 py-4 font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)]"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)]">
                <div className="relative h-full w-8 bg-white/20 blur-md animate-shine"></div>
              </div>
              
              <span className="relative flex items-center justify-center gap-2 cursor-pointer text-white">
                Start Exploring
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={close}
              className="w-full py-2 text-sm cursor-pointer font-medium text-gray-500 transition-colors hover:text-white"
            >
              Maybe later
            </button>
          </div>
          
        </div>
      </motion.div>

    </motion.div>
  );

  return createPortal(modalContent, document.body);
}