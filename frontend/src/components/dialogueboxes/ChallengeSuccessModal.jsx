import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Trophy, ArrowRight, Zap } from "lucide-react";

export default function ChallengeSuccessModal({ close, rank }) {
  const modalContent = (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[9999] bg-black/80 backdrop-blur-md m-0 p-0 top-0 left-0"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative p-[1.5px] rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 shadow-[0_0_50px_rgba(99,102,241,0.3)]"
      >
        <div className="relative bg-[#09090b] p-10 rounded-[2.4rem] w-[480px] text-center overflow-hidden">
          
          {/* Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full"></div>

          {/* Trophy Icon */}
          <div className="relative flex justify-center mb-6">
            <div className="bg-indigo-500/10 p-5 rounded-3xl border border-indigo-500/20">
              <Trophy className="text-indigo-400 w-12 h-12" />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Challenge Complete!
            </h2>
            <p className="text-slate-400 text-lg">
              One more daily task finished. <br />
              <span className="text-slate-500 text-sm">You're making great progress!</span>
            </p>
          </div>

          {/* Rank Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 p-2 rounded-xl">
                <Zap className="text-emerald-400 w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Campus Rank</p>
                <p className="text-xl font-bold text-white"># {rank || "--"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                LOCKED IN
              </p>
            </div>
          </div>

          <button
            onClick={close}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 group active:scale-95"
          >
            Continue
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}
