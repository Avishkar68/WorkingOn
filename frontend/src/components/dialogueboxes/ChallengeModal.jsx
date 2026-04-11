import { motion } from "framer-motion";
import { Award, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

export default function ChallengeModal({ open, close, leaderboard, challenge, onStart }) {
  if (!open) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl rounded-4xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Today&apos;s Challenge</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Keep your streak alive</h2>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-500/15 text-indigo-200">
            <Sparkles size={24} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">{challenge?.title || "Daily campus challenge"}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{challenge?.description || "Complete today&apos;s challenge and post to stay on the leaderboard."}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Top 3 leaderboard preview</p>
              <div className="mt-4 space-y-3">
                {(leaderboard || []).slice(0, 3).map((user, idx) => (
                  <div key={user._id} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-200 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <Link to={`/user/${user._id}`} className="min-w-0 group/card">
                      <p className="font-semibold text-white truncate group-hover/card:text-indigo-400 transition-colors">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.score} points</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-indigo-500/10 p-5 text-slate-100">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">Ready?</p>
                <h3 className="mt-2 text-xl font-semibold">Want your name on leaderboard?</h3>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-500/15 text-indigo-200">
                <Award size={22} />
              </div>
            </div>
            <p className="text-sm text-slate-200 leading-6 mb-6">
              Complete today&apos;s challenge and add a post to stay in the top ranking.
            </p>

            <button
              onClick={onStart}
              className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Start Challenge
            </button>

            <button
              onClick={close}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
