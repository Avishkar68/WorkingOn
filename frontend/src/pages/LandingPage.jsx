import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, Flame, Trophy, Target, MessageSquare, Briefcase,
  ArrowRight, Globe, Sparkles, CheckCircle2, XCircle, ArrowUpRight, Terminal
} from "lucide-react";

// Mock Data for Marquee
const TICKER_ITEMS = [
  { text: "Rahul just solved the Daily Challenge.", time: "2m ago", color: "text-brand-400" },
  { text: "3 new projects need collaborators.", time: "15m ago", color: "text-indigo-400" },
  { text: "Sneha reached Rank #2 on the Leaderboard.", time: "1hr ago", color: "text-amber-400" },
  { text: "Aman asked a doubt in Data Structures.", time: "2hrs ago", color: "text-blue-400" },
  { text: "SPIT Hackathon pre-registration goes live tonight.", time: "3hrs ago", color: "text-pink-400" }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuth(true);
    else setIsAuth(false);
  }, []);

  if (isAuth === true) return <Navigate to="/" replace />;
  if (isAuth === null) return null;

  return (
    <div className="min-h-screen bg-[#020509] text-[#ededed] overflow-x-hidden selection:bg-brand-500/30 font-sans tracking-tight">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/15 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between bg-[#020509]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            <Globe className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight">SPITConnect</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/login")} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</button>
          <button onClick={() => navigate("/register")} className="text-sm font-bold btn-primary px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all hover:scale-105 active:scale-95">Register</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(20,184,166,0.15)]"
            >
              <Sparkles className="w-4 h-4" /> Exclusively for SPIT Students
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6"
            >
              Everything happening <br />
              in SPIT. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-indigo-500">
                One place.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-lg mb-8 leading-relaxed font-medium"
            >
              SPIT students are already here. Find opportunities, build projects, maintain daily streaks, and climb the campus leaderboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full"
            >
              <button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto btn-primary py-3.5 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(20,184,166,0.4)]"
              >
                Enter your campus <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* Hero Visual - Dashboard Snippets */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full lg:w-1/2 relative h-[500px]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 to-indigo-600/20 rounded-3xl blur-[80px]"></div>

            {/* Main Mock Window */}
            <div className="absolute inset-0 glass-pro border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[#0b1015]/90">
              <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="mx-auto text-xs font-mono text-gray-500 opacity-50">&gt; campus_feed</div>
              </div>
              <div className="p-4 space-y-4 flex-1 overflow-hidden relative">
                {/* Fake Activity Feed */}
                <div className="p-4 rounded-xl border border-white/5 flex gap-4 bg-white/5">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Target className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-200">Daily Challenge #42</h4>
                    <p className="text-xs text-brand-400 mt-1 font-medium">94 students completed • +50 XP</p>
                    <p className="text-xs text-gray-500 mt-2">Solve two-sum array optimization.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 flex gap-4">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-200">Doubt: OS Paging Algorithm</h4>
                    <p className="text-xs text-indigo-400 mt-1 font-medium">4 answers • TE Comps</p>
                    <p className="text-xs text-gray-500 mt-2">I need help understanding page faults.</p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b1015] to-transparent"></div>
              </div>
            </div>

            {/* Floating Streak Card */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 lg:-right-12 top-20 glass-pro p-4 rounded-xl border border-white/10 shadow-xl w-48 z-20 backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Your Streak</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  14
                </div>
                <div className="text-sm font-bold text-gray-400">Days</div>
              </div>
              <div className="text-xs text-amber-500/80 font-medium mt-1">Keep it alive!</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Ticker - Real time FOMO urgency */}
      <div className="relative py-4 border-y border-white/5 bg-[#0a0f14] overflow-hidden flex z-10 w-full mb-20 whitespace-nowrap">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0f14] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0f14] to-transparent z-10"></div>
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 items-center opacity-70"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className={`text-sm font-semibold tracking-wide ${item.color}`}>{item.text}</span>
              <span className="text-xs text-gray-500 font-medium pr-10">{item.time}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bento Box Grid - The "Campus Gamification" */}
      <section className="py-20 relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">Gamify your college life.</h2>
          <p className="text-gray-400 text-lg max-w-2xl font-medium">
            While others are lost in dead WhatsApp groups, our top students are maintaining streaks, joining hackathon teams, and ranking up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">

          {/* Bento Item 1: Streak System */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <Flame className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-2">Daily Streak System</h3>
              <p className="text-gray-400 font-medium text-sm">Show up daily. Stay ahead. Maintain your streak by solving daily challenges or helping peers.</p>
            </div>
            <div className="relative z-10 mt-4 p-4 rounded-xl bg-black/50 border border-amber-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <div className="text-xl font-black text-white">218 SPITians</div>
              </div>
              <div className="text-xs text-amber-500 font-bold mt-1 uppercase tracking-wider">Are on a 7+ day streak</div>
            </div>
          </div>

          {/* Bento Item 2: Leaderboard Snippet */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <Trophy className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Leaderboard</h3>
            <p className="text-gray-400 font-medium text-sm mb-6">Be seen. Be ranked. Compete with the entire campus for top spots.</p>

            <div className="space-y-3 relative z-10">
              {['A', 'K', 'R'].map((initial, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 w-4">{idx + 1}</span>
                    <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold">{initial}</div>
                    <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-purple-500 w-[80%]"></div></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-400">4,200 XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Item 3: Daily Challenge */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <Target className="w-8 h-8 text-brand-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-bold mb-2 relative z-10">Daily Challenge</h3>
            <p className="text-gray-400 font-medium text-sm mb-6 relative z-10">Win your day. New challenge every 24 hours. Code, logic, or campus trivia.</p>

            <div className="p-4 bg-[#0a0e14] border border-white/5 rounded-xl font-mono text-xs text-gray-400 relative z-10">
              <span className="text-brand-400">def</span> <span className="text-blue-300">solve_today</span>(): <br />
              &nbsp;&nbsp;return <span className="text-green-300">"streak_maintained"</span>
            </div>
          </div>

          {/* Bento Item 4: Academic & Collaboration (Span 2) */}
          <div className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex flex-col md:flex-row gap-8 relative z-10 h-full items-center">
              <div className="flex-1">
                <Users className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Projects & Academic Help</h3>
                <p className="text-gray-400 font-medium">Build with people who match your skills. Get unstuck faster by asking the right seniors directly.</p>
              </div>
              <div className="flex-1 w-full bg-[#06090e] border border-white/10 rounded-2xl p-4 shadow-inner relative overflow-hidden">
                <div className="absolute top-1/2 left-4 w-10 h-10 rounded-full border border-indigo-500/50 bg-indigo-500/10 flex items-center justify-center -translate-y-1/2 z-10"><MessageSquare className="w-4 h-4 text-indigo-400" /></div>
                <div className="absolute top-1/2 right-4 w-10 h-10 rounded-full border border-brand-500/50 bg-brand-500/10 flex items-center justify-center -translate-y-1/2 z-10"><Terminal className="w-4 h-4 text-brand-400" /></div>

                {/* Connecting Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-indigo-500/30 group-hover:stroke-indigo-500/60 transition-colors" fill="none" strokeWidth="2" strokeDasharray="4 4">
                  <path d="M 40 50 Q 100 100 250 50" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bento Item 5: Opportunities */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between">
            <div>
              <Briefcase className="w-8 h-8 text-zinc-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-white">Opportunities</h3>
              <p className="text-gray-400 font-medium text-sm">Targeted campus opportunities. Never miss an internal referral or team opening again.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Comparison Table Section - Problem vs Solution */}
      <section className="py-24 relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">50 WhatsApp Groups. 0 Collaboration.</h2>
          <p className="text-gray-400 text-lg">Information is scattered everywhere. We fixed it by building a single hub.</p>
        </div>

        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="grid grid-cols-3 bg-white/5 p-6 border-b border-white/10 font-bold text-sm tracking-widest uppercase text-gray-400">
            <div className="col-span-1">Experience</div>
            <div className="col-span-1 text-center">Random Groups</div>
            <div className="col-span-1 text-center text-brand-400 glow font-black border-b-2 border-brand-500 pb-1">One Platform. Entire SPIT.</div>
          </div>

          {[
            { label: "Finding Collaborators", wp: false, sc: true },
            { label: "Academic Doubt Solving", wp: false, sc: true },
            { label: "Building a Campus Reputation", wp: false, sc: true },
            { label: "Daily Gamification", wp: false, sc: true },
            { label: "Information Archival", wp: false, sc: true },
          ].map((row, idx) => (
            <div key={idx} className={`grid grid-cols-3 p-6 border-b border-white/5 ${idx % 2 === 0 ? 'bg-black/20' : 'bg-transparent'} hover:bg-white/5 transition-colors`}>
              <div className="col-span-1 font-medium text-gray-300 text-sm">{row.label}</div>
              <div className="col-span-1 flex justify-center">{<XCircle className="w-5 h-5 text-red-900/50" />}</div>
              <div className="col-span-1 flex justify-center"><CheckCircle2 className="w-5 h-5 text-brand-500 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* Massive Aggressive CTA */}
      <section className="py-12 relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-12 md:p-10 rounded-[3rem] glass-pro text-center relative overflow-hidden border border-brand-500/30 shadow-[0_30px_100px_-15px_rgba(20,184,166,0.25)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-[#0b1015] to-indigo-600/20"></div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10 tracking-tighter text-white">Don't be the last one <br /> in SPIT to join this.</h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10 relative z-10 max-w-xl mx-auto font-medium">
            Your classmates are already building their streaks, finding teams, and securing their spot on the leaderboard.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="relative z-10 btn-primary px-12 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 mx-auto shadow-[0_0_50px_rgba(20,184,166,0.6)] hover:shadow-[0_0_80px_rgba(20,184,166,0.8)] transition-all hover:scale-105 active:scale-95"
          >
            Join SPITConnect <ArrowUpRight className="w-6 h-6" />
          </button>

          <p className="relative z-10 text-xs text-gray-500 mt-6 font-medium">Only for verified SPIT students.</p>
        </motion.div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 border-t border-white/5 text-center px-6 bg-black relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-gray-600" />
          <span className="font-bold text-gray-400 tracking-tight">SPITConnect</span>
        </div>
        <p className="text-xs text-gray-600 font-medium pb-4">By Students. For Students.</p>
      </footer>
    </div>
  );
}
