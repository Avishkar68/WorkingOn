import { useEffect, useState } from "react";
import api from "../api/axios";
import PageShell from "../components/layout/PageShell";
import { Trophy, Sparkles } from "lucide-react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const res = await api.get("/streak/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <PageShell
      eyebrow="Leaderboard"
      title="Streak rankings"
      subtitle="See who’s leading the streak board with quiz completions and campus engagement."
    >
      <div className="grid gap-6">
        <div className="grid gap-4 xl:grid-cols-3">
          {topThree.map((user, index) => (
            <div
              key={user._id}
              className="glass-card rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.18)]"
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">#{index + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{user.name}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-500/15 text-indigo-200">
                  <Trophy size={20} />
                </div>
              </div>
              <div className="space-y-3 text-slate-300">
                <p>Streak: <span className="text-white font-semibold">{user.streakCount}</span></p>
                <p>Posts: <span className="text-white font-semibold">{user.totalPosts || 0}</span></p>
                <p>Comments: <span className="text-white font-semibold">{user.totalComments || 0}</span></p>
                <p>Score: <span className="text-indigo-200 font-semibold">{user.score}</span></p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-4xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Full ranking</p>
              <h2 className="mt-2 text-xl font-semibold text-white">All challengers</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-indigo-500/15 text-indigo-200">
              <Sparkles size={18} />
            </div>
          </div>

          {loading ? (
            <p className="text-slate-300">Loading leaderboard…</p>
          ) : others.length === 0 ? (
            <p className="text-slate-400">No leaderboard data available yet.</p>
          ) : (
            <div className="space-y-3">
              {others.map((user, index) => (
                <div
                  key={user._id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-4"
                >
                  <div className="text-sm font-semibold text-indigo-200">#{index + 4}</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">Streak {user.streakCount} • {user.totalPosts || 0} posts</p>
                  </div>
                  <div className="text-right text-sm font-semibold text-white">{user.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
