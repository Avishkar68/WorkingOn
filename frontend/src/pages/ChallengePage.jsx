import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PageShell from "../components/layout/PageShell";
import toast from "react-hot-toast";

import { CheckCircle2, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ChallengePage() {
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      const res = await api.get("/streak/status");
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [challengeRes, statusRes] = await Promise.all([
          api.get("/challenge/today"),
          api.get("/streak/status")
        ]);
        
        setChallenge(challengeRes.data);
        if (statusRes.data?.dailyTasksCompleted?.quizCompleted) {
          setIsCompleted(true);
        }
      } catch (err) {
        console.error("Failed to load challenge data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const submitChallenge = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/challenge/complete", { answer });
      const status = await fetchStatus();
      window.dispatchEvent(new Event("streak-status-updated"));
      
      let successMsg = res.data.message || "Challenge completed!";
      if (res.data.streakUpdated) {
        successMsg = "🎉 Correct! Your daily streak has been updated.";
      } else if (status?.dailyTasksCompleted?.quizCompleted) {
        successMsg = "✅ Correct! Quiz marked complete. Now upload a post to finish today's streak.";
      }
      
      setMessage(successMsg);
      toast.success(successMsg);

      // 🏆 Redirect to Home with Rank
      setTimeout(() => {
        navigate("/home", { state: { challengeSuccess: true, rank: res.data.rank } });
      }, 1500);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Unable to submit challenge.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Challenge"
      title="Today's Challenge"
      subtitle="Answer quick questions to earn your daily streak."
      actions={
        <button
          onClick={() => navigate("/leaderboard")}
          className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
        >
          View leaderboard
        </button>
      }
    >
      <div className="grid gap-6">
        <div className="glass-card overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6">
          {isCompleted ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-4 rounded-full border border-emerald-500/30"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white">Challenge Completed!</h2>
              <p className="mt-2 text-slate-400">
                You've already conquered today's challenge. Keep up the great work!
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/home")}
                  className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                >
                  Return Home
                </button>
                <button
                  onClick={() => navigate("/leaderboard")}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <Award size={18} />
                  View Leaderboard
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Challenge</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{challenge?.title || "Daily streak quiz"}</h2>
              </div>
              <p className="text-sm leading-7 text-slate-300">{challenge?.description || "Complete today's challenge to stay on track."}</p>

              {challenge?.questions?.length ? (
                <div className="space-y-4">
                  {challenge.questions.map((question) => (
                    <div key={question.id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                      <p className="font-semibold text-white">{question.question}</p>
                      {question.options ? (
                        <div className="mt-3 grid gap-3">
                          {question.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setAnswer(option)}
                              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                                answer === option
                                  ? "border-indigo-400 bg-indigo-500/15 text-white"
                                  : "border-white/10 bg-white/5 text-slate-300 hover:border-indigo-400/30 hover:bg-white/10"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <textarea
                          rows={4}
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/25"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  </div>
                ) : null
              )}

              {!loading && (
                <button
                  onClick={submitChallenge}
                  disabled={loading || !answer}
                  className="rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit answers"}
                </button>
              )}

              {message ? <p className="text-sm text-slate-300">{message}</p> : null}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
