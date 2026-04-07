import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PageShell from "../components/layout/PageShell";

export default function ChallengePage() {
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
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
    const loadChallenge = async () => {
      try {
        const res = await api.get("/challenge/today");
        setChallenge(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadChallenge();
  }, []);

  const submitChallenge = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/challenge/complete", { answer });
      const status = await fetchStatus();
      window.dispatchEvent(new Event("streak-status-updated"));
      setMessage(res.data.message || "Challenge completed!");
      if (res.data.streakUpdated) {
        setMessage("Challenge complete! Your streak has been updated.");
      } else if (status?.dailyTasksCompleted?.quizCompleted) {
        setMessage("Quiz marked complete. Upload a post to finish today's streak.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Unable to submit challenge.");
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
        <div className="glass-card rounded-4xl border border-white/10 bg-white/5 p-6">
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
            ) : null}

            <button
              onClick={submitChallenge}
              disabled={loading}
              className="rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit answers"}
            </button>

            {message ? <p className="text-sm text-slate-300">{message}</p> : null}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
