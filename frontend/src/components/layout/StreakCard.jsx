import { useEffect, useMemo, useState } from "react";
import { Sparkles, CalendarDays, CheckCircle2, Flame } from "lucide-react";
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
    if (day > lastDate) break; // Don't render empty 6th row
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

    const handleStreakUpdate = () => loadStatus();
    window.addEventListener("streak-status-updated", handleStreakUpdate);
    return () => window.removeEventListener("streak-status-updated", handleStreakUpdate);
  }, []);

  const calendarGrid = useMemo(() => {
    const today = new Date();
    return buildCalendar(today.getFullYear(), today.getMonth());
  }, []);

  const completedDates = useMemo(() => {
    return new Set((status?.streakHistory || []).map((item) => normalizeDayKey(item)));
  }, [status]);

  const todayKey = normalizeDayKey(new Date());
  const streakDoneToday = status?.dailyTasksCompleted?.quizCompleted && status?.dailyTasksCompleted?.postCreated;

  return (
    <div className="bg-[#0f172a]/40 backdrop-blur-xl rounded-[2rem] p-4 border border-white/5 overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Streak</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {loading ? "..." : status?.streakCount || 0}
            </h2>
            <span className="text-xs font-medium text-slate-400">days</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
          <div className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
            <Flame size={20} className="text-white fill-current" />
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white/[0.03] rounded-2xl p-3 border border-white/5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            {new Date().toLocaleString("en-US", { month: "short", year: "numeric" })}
          </span>
          <CalendarDays size={14} className="text-indigo-400 opacity-70" />
        </div>

        {/* Labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S','M','T','W','T','F','S'].map((l, i) => (
            <div key={i} className="text-center text-[9px] font-black text-slate-600">{l}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1.5 gap-x-1">
          {calendarGrid.flat().map((day, idx) => {
            if (!day) return <div key={idx} className="h-7" />;
            
            const dateKey = normalizeDayKey(new Date(new Date().getFullYear(), new Date().getMonth(), day));
            const isCompleted = completedDates.has(dateKey);
            const isToday = todayKey === dateKey;

            return (
              <div key={idx} className="relative flex flex-col items-center justify-center">
                <div
                  className={`
                    flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold transition-all duration-300
                    ${isToday ? "bg-indigo-500 text-white shadow-indigo-500/40 shadow-lg scale-110" : ""}
                    ${!isToday && isCompleted ? "text-indigo-300" : "text-slate-400"}
                    ${!isToday && !isCompleted ? "hover:bg-white/5" : ""}
                  `}
                >
                  {day}
                </div>
                {isCompleted && !isToday && (
                  <div className="absolute -bottom-0.5 h-1 w-1 bg-indigo-400 rounded-full shadow-[0_0_5px_rgba(129,140,248,0.8)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="space-y-2.5 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-tight">Daily Progress</h3>
          {streakDoneToday && <span className="text-[10px] text-emerald-400 font-bold">READY</span>}
        </div>
        
        <div className="space-y-2">
          {[
            { label: "Daily Challenge", done: status?.dailyTasksCompleted?.quizCompleted },
            { label: "Community Post", done: status?.dailyTasksCompleted?.postCreated }
          ].map((task, i) => (
            <div key={i} className="group flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
              <span className={`text-[11px] ${task.done ? "text-slate-100" : "text-slate-500"}`}>{task.label}</span>
              <div className={`
                h-4 w-4 rounded-md flex items-center justify-center transition-all
                ${task.done ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-white/10"}
              `}>
                {task.done && <CheckCircle2 size={10} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
          <p className="text-[10px] text-red-300">Sync Error</p>
        </div>
      )}
    </div>
  );
}