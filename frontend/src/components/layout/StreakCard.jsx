import { useEffect, useMemo, useState } from "react";
import { Sparkles, CalendarDays, CheckCircle2 } from "lucide-react";
import api from "../../api/axios";

const normalizeDayKey = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const buildCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let day = 1;

  for (let week = 0; week < 6; week += 1) {
    const days = [];
    for (let weekday = 0; weekday < 7; weekday += 1) {
      if ((week === 0 && weekday < firstDay) || day > lastDate) {
        days.push(null);
      } else {
        days.push(day);
        day += 1;
      }
    }
    weeks.push(days);
  }

  return weeks;
};

export default function StreakCard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        setLoading(true);
        const res = await api.get("/streak/status");
        setStatus(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();

    const handleStreakUpdate = () => {
      loadStatus();
    };

    window.addEventListener("streak-status-updated", handleStreakUpdate);
    return () => window.removeEventListener("streak-status-updated", handleStreakUpdate);
  }, []);

  const calendarGrid = useMemo(() => {
    const today = new Date();
    return buildCalendar(today.getFullYear(), today.getMonth());
  }, []);

  const completedDates = useMemo(() => {
    return new Set(
      (status?.streakHistory || []).map((item) => normalizeDayKey(item))
    );
  }, [status]);

  const todayKey = normalizeDayKey(new Date());
  const streakDoneToday = status?.dailyTasksCompleted?.quizCompleted && status?.dailyTasksCompleted?.postCreated;
  const lastActive = status?.lastActiveDate ? new Date(status.lastActiveDate) : null;
  const inactive = lastActive && (new Date() - new Date(normalizeDayKey(lastActive)) > 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="glass-card rounded-3xl p-5 border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Your Streak</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{loading ? "..." : `${status?.streakCount || 0} days`}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200 shadow-[0_0_30px_rgba(99,102,241,0.18)]">
          <Sparkles size={24} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}</p>
              <p className="text-sm font-semibold text-white mt-1">Calendar</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
              <CalendarDays className="text-indigo-300" />
              Today
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-500 mb-3 uppercase">
            {['S','M','T','W','T','F','S'].map((label) => (
              <div key={label} className="text-center font-semibold">{label}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarGrid.map((week, weekIndex) =>
              week.map((day, dayIndex) => {
                if (!day) {
                  return <div key={`${weekIndex}-${dayIndex}`} className="h-10 rounded-2xl bg-white/5" />;
                }

                const dateKey = normalizeDayKey(new Date(new Date().getFullYear(), new Date().getMonth(), day));
                const isCompleted = completedDates.has(dateKey);
                const isToday = todayKey === dateKey;

                return (
                  <div
                    key={`${weekIndex}-${day}`}
                    className={`flex h-11 items-center justify-center rounded-3xl text-xs font-semibold transition ${
                      isToday
                        ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                        : isCompleted
                        ? "bg-indigo-400/20 text-indigo-100 border border-indigo-400/20"
                        : "bg-slate-950/80 text-slate-400 border border-white/5"
                    }`}
                  >
                    <span className={isCompleted ? "text-white" : "text-slate-300"}>{day}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">Daily tasks</p>
            {streakDoneToday ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200 text-xs">
                <CheckCircle2 size={14} /> Completed
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Complete today’s challenge",
                completed: status?.dailyTasksCompleted?.quizCompleted
              },
              {
                label: "Upload a post",
                completed: status?.dailyTasksCompleted?.postCreated
              }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`h-5 w-5 rounded-xl ${item.completed ? "bg-indigo-500" : "bg-white/10 border border-white/10"} flex items-center justify-center transition`}> 
                  {item.completed ? <CheckCircle2 size={14} className="text-white" /> : null}
                </div>
                <span className={`text-sm ${item.completed ? "text-slate-100" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {inactive && !streakDoneToday ? (
            <div className="rounded-2xl border border-rose-500/15 bg-rose-500/5 p-3 text-sm text-rose-100">
              Your streak is at risk — reconnect today to keep it alive.
            </div>
          ) : null}
        </div>
      </div>

      {streakDoneToday ? (
        <div className="mt-4 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-sm text-indigo-100">
          <span className="font-semibold">Streak Completed Today</span> — keep the flame going.
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-rose-300">Unable to load streak details.</p>
      ) : null}
    </div>
  );
}
