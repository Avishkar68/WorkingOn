import { useEffect, useState } from "react";
import api from "../api/axios";
import PageShell from "../components/layout/PageShell";
import { Trophy, Sparkles, Crown, Zap } from "lucide-react";

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

  const podiumThemes = [
    { rank: 1, text: "text-amber-400", border: "border-amber-500/30", glow: "shadow-amber-500/10", icon: Crown, order: "order-2" },
    { rank: 2, text: "text-slate-300", border: "border-slate-400/20", glow: "shadow-slate-500/5", icon: Trophy, order: "order-1" },
    { rank: 3, text: "text-orange-400", border: "border-orange-500/20", glow: "shadow-orange-500/5", icon: Trophy, order: "order-3" },
  ];

  return (
    <PageShell
      eyebrow="The Campus Arena"
      title="Streak Leaderboard"
      subtitle="The defining rankings for campus engagement and mastery."
    >
      <div className="max-w-[1000px] mx-auto space-y-8">
        {/* Podium - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-8">
          {topThree.map((user, index) => {
            const theme = podiumThemes[index];
            const isFirst = theme.rank === 1;

            return (
              <div
                key={user._id}
                className={`${theme.order} relative group`}
              >
                {/* Ranking Badge */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1f2e] border-2 ${theme.border} ${theme.text} font-bold text-sm shadow-xl`}>
                  #{theme.rank}
                </div>

                <div className={`
                  relative overflow-hidden glass-card p-5
                  ${isFirst ? "min-h-[320px] md:scale-105 z-10 border-amber-500/40" : "min-h-[280px] border-white/5"}
                  ${theme.glow} shadow-2xl
                `}>
                  {/* Subtle Top Light Glow */}
                  <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${isFirst ? 'from-amber-500/10' : 'from-white/5'} to-transparent opacity-50`} />

                  <div className="relative z-10 flex flex-col items-center text-center h-full">
                    <div className={`mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 ${theme.text}`}>
                      <theme.icon size={isFirst ? 32 : 24} />
                    </div>

                    <h3 className="text-lg font-bold text-white truncate w-full px-2">{user.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Ranked {theme.rank}</p>

                    {/* Stats Pills */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                        <Zap size={12} className="text-indigo-400" />
                        <span className="text-xs font-bold text-white">{user.streakCount || 0}d</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                        <Trophy size={12} className={theme.text} />
                        <span className="text-xs font-bold text-white">{user.score || 0}</span>
                      </div>
                    </div>

                    {/* Footer Activity */}
                    <div className="mt-auto w-full grid grid-cols-2 border-t border-white/5 pt-4">
                      <div>
                        <p className="text-sm font-bold text-white">{user.totalPosts || 0}</p>
                        <p className="text-[9px] uppercase text-slate-500 font-bold">Posts</p>
                      </div>
                      <div className="border-l border-white/5">
                        <p className="text-sm font-bold text-white">{user.totalComments || 0}</p>
                        <p className="text-[9px] uppercase text-slate-500 font-bold">Comments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* List for the rest */}
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Arena Standings</h2>
            <Sparkles size={16} className="text-indigo-400 opacity-50" />
          </div>

          <div className="space-y-2">
            {loading ? (
              <p className="text-slate-500 text-sm text-center py-4">Calculating rankings...</p>
            ) : (
              others.map((user, index) => (
                <div key={user._id} className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.01] px-4 py-3 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-600 w-6">#{index + 4}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">Streak: {user.streakCount || 0}d</span>
                        <span className="text-[10px] text-slate-700">•</span>
                        <span className="text-[10px] text-slate-500">{user.totalPosts || 0} posts</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-indigo-400">{user.score}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}