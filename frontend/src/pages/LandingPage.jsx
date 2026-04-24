import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/common/SEO";
import {
  Users,
  Flame,
  Trophy,
  Target,
  MessageSquare,
  Briefcase,
  ArrowRight,
  Globe,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Terminal,
  ShieldAlert,
  BarChart3,
  Laugh,
  Heart,
  Zap,
  Megaphone,
  Calendar,
} from "lucide-react";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

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
    <div className="min-h-screen bg-[#020609] text-[#ededed] overflow-x-hidden selection:bg-brand-500/30 font-sans tracking-tight">
      <SEO 
        title="SPITConnect - Sardar Patel Institute of Technology Student Collaboration Platform" 
        description="The ultimate community for Sardar Patel Institute of Technology (SPIT) students. Join SPITConnect for internships, academic help, project collaboration, and campus pulse."
        keywords="SPIT Mumbai, Sardar Patel Institute of Technology, SPIT student portal, SPIT internships, SPIT projects, SPIT campus pulse"
      />
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-2 md:px-6 py-4 flex items-center justify-between bg-[#020609]/80 backdrop-blur-xl">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="SPITConnect Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400  to-brand-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] group-hover:scale-110 transition-transform">
            <Globe className="w-4 md:w-5 h-4 md:h-5 text-black" aria-hidden="true" />
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tighter">
            SPITConnect
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          {/* Add this link */}
          <button
            onClick={() => navigate("/landing/our-team")}
            className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Our Team
          </button>

          <button
            onClick={() => navigate("/login")}
            aria-label="Login to SPITConnect"
            className="
        text-sm font-bold transition-all
        /* Mobile Styles */
        px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white active:scale-95
        /* Desktop Reset (md: prefix) */
        md:bg-transparent md:border-none md:p-0 md:text-gray-400 md:hover:text-white md:active:scale-100
      "
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            aria-label="Join the SPIT Campus"
            className="text-sm hidden md:block font-bold btn-primary px-6 py-2.5 rounded-xl shadow-[0_0_25px_rgba(20,184,166,0.2)] hover:shadow-[0_0_35px_rgba(20,184,166,0.5)] transition-all hover:scale-105"
          >
            Join the Campus
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* 🔥 SECTION 1: HERO */}
        <section className="pt-25 md:pt-50 pb-20 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="w-full lg:w-1/ flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-inner"
              >
                <Sparkles className="w-4 h-4 text-brand-400" /> Exclusively for
                SPIT students
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-3"
              >
                Everything happening <br />
                at <span className="text-brand-400">SPIT</span> Mumbai.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-indigo-500">
                  All in one place.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed font-medium"
              >
                Connect with peers at <span className="text-white">Sardar Patel Institute of Technology</span>. 
                Collaborate on projects, find internships, and stay updated with the campus pulse.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 w-full -mt-4 mb-8"
              >
                <button
                  onClick={() => navigate("/register")}
                  aria-label="Register for SPITConnect"
                  className="w-full sm:w-auto btn-primary py-4 px-10 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.03] shadow-[0_0_40px_rgba(20,184,166,0.3)]"
                >
                  Join SPITConnect
                </button>
                <button
                  onClick={() => navigate("/login")}
                  aria-label="Explore the SPIT Campus Pulse"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Explore Campus Pulse
                </button>
              </motion.div>
            </div>

            {/* Dashboard Preview Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-1/2 relative group"
            >
              <div className="absolute inset-0 bg-brand-500/10 blur-[100px] group-hover:bg-brand-500/20 transition-all"></div>

              {/* Mock App Window */}
              <div className="relative glass-pro border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl bg-[#0b1015]/95">
                <div className="h-10 border-b border-white/10 flex items-center px-6 gap-2 bg-white/[0.03]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="mx-auto text-[10px] font-mono text-gray-500 tracking-widest ">
                    LIVE_DASHBOARD
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mock Feed Item */}
                  <div className="p-4 rounded-2xl glass border border-white/10 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                        <Laugh size={14} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                        Anonymous • 2m ago
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-300">
                      "Anyone knows if the DS Lab submission was extended?
                      Asking for a friend... 💀"
                    </p>
                    <div className="flex gap-2 text-[10px] text-brand-400 font-bold">
                      <span>🔥 12</span>
                      <span>💬 4</span>
                    </div>
                  </div>

                  {/* Leaderboard Glimpse */}
                  <div className="p-4 rounded-2xl glass border border-white/10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        Campus Ranks
                      </span>
                      <Trophy size={14} className="text-amber-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">1. Aryan (BE)</span>
                        <span className="text-brand-400 font-bold">
                          4,280 XP
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">2. Sneha (TE)</span>
                        <span className="text-brand-400 font-bold">
                          4,120 XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Challenge Item */}
                  <div className="md:col-span-2 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-brand-400" />
                        <span className="text-[10px] font-black uppercase text-brand-400">
                          Daily Challenge
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">
                        Starts in 04:20:11
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white italic">
                      "Optimize binary search for duplicate elements."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Streak */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-6 glass-pro p-4 rounded-2xl border border-white/20 shadow-xl backdrop-blur-2xl z-20"
              >
                <div className="flex flex-col items-center">
                  <Flame className="w-8 h-8 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                  <span className="text-2xl font-black text-white">14</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Day Streak
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 🔥 SECTION 1.5: QUICK FEATURE OVERVIEW (BENTO) */}
        <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              What's inside SPITConnect?
            </h2>
            <p className="text-gray-400 text-lg font-medium">
              Everything you need, built natively for SPIT.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
            {/* Campus Pulse - Span 2 */}
            <div className="md:col-span-2 glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-purple-500/10 hover:border-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <ShieldAlert className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Campus Pulse</h3>
                  <p className="text-gray-400 text-sm font-medium max-w-md">
                    Confessions, polls, and raw campus thoughts. Completely
                    anonymous. Only for verified students.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                    Real-time Feed
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Streaks - Span 1 */}
            <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-orange-500/10 hover:border-orange-500/30">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <Flame className="w-8 h-8 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Daily Streaks</h3>
                  <p className="text-gray-400 text-sm font-medium">
                    Build a habit. Stay consistent and climb the ranks.
                  </p>
                </div>
                <div className="text-3xl font-black text-white/20 group-hover:text-orange-500/40 transition-colors">
                  7+ DAYS
                </div>
              </div>
            </div>

            {/* Communities - Span 1 */}
            <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-brand-500/10 hover:border-brand-500/30">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <MessageSquare className="w-8 h-8 text-brand-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Communities</h3>
                  <p className="text-gray-400 text-xs font-medium">
                    Join 20+ interest-based hubs across campus.
                  </p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-brand-500 border border-[#020609]"></div>
                  <div className="w-6 h-6 rounded-full bg-indigo-500 border border-[#020609]"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 border border-[#020609]"></div>
                </div>
              </div>
            </div>

            {/* Opportunities - Span 1 */}
            <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-indigo-500/10 hover:border-indigo-500/30">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <Target className="w-8 h-8 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Opportunities</h3>
                  <p className="text-gray-400 text-xs font-medium">
                    Internships and referrals, curated for you.
                  </p>
                </div>
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-400 uppercase">
                  12 New Postings
                </div>
              </div>
            </div>

            {/* Events - Span 1 */}
            <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-amber-500/10 hover:border-amber-500/30">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <Calendar className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Events</h3>
                  <p className="text-gray-400 text-xs font-medium">
                    Never miss a workshop, fest, or seminar.
                  </p>
                </div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  RSVP Directly
                </div>
              </div>
            </div>

            {/* Academic Help - Span 2 */}
            <div className="md:col-span-2 glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-brand-400/10 hover:border-brand-400/30">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <Terminal className="w-8 h-8 text-brand-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Academic Help</h3>
                    <p className="text-gray-400 text-sm font-medium max-w-md">
                      Get unstuck faster. Match with seniors who have already
                      taken your courses.
                    </p>
                  </div>
                  <div className="hidden md:block p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-[10px] text-brand-400">
                    $ find seniors --skills "React"
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard - Span 1 */}
            <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-amber-500/10 hover:border-amber-500/30">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <Trophy className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
                  <p className="text-gray-400 text-xs font-medium">
                    Compete monthly for the top campus spot.
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">#1</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Campus Rank
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 💣 SECTION 2: PROBLEM */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <motion.h2
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-black tracking-tighter mb-6"
              >
                SPIT is active. <br />
                <span className="text-gray-500">
                  But everything is scattered.
                </span>
              </motion.h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                Information is dying in unread WhatsApp messages. We built a
                command center for your college life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Opportunities lost in chats",
                  desc: "Internal referrals and team openings get buried under memes and stickers.",
                  icon: <Briefcase className="w-6 h-6 text-red-400" />,
                },
                {
                  title: "Important updates missed",
                  desc: "Official notices and hackathon alerts disappear in the noise of 50+ groups.",
                  icon: <Megaphone className="w-6 h-6 text-amber-400" />,
                },
                {
                  title: "Too many groups, no clarity",
                  desc: "Managing 15 groups for 5 subjects is a mental drain. We bring order.",
                  icon: <Zap className="w-6 h-6 text-indigo-400" />,
                },
                {
                  title: "No proper collaboration",
                  desc: "Finding project partners shouldn't feel like a cold email campaign.",
                  icon: <Users className="w-6 h-6 text-brand-400" />,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="glass-card p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col items-start"
                >
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: SOLUTION */}
        <section className="py-24 bg-brand-500/[0.02] border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
              <div className="text-left">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                  Your entire campus. Organized.
                </h2>
                <p className="text-gray-400 text-lg font-medium max-w-xl italic">
                  "The platform SPIT deserved, finally built by SPITians."
                </p>
              </div>
              <div className="flex items-center gap-4 border border-white/10 rounded-2xl px-6 py-4 glass">
                <div className="text-center">
                  <div className="text-2xl font-black text-white line-clamp-1">
                    350+
                  </div>
                  <div className="text-[10px] uppercase font-bold text-gray-500">
                    Daily Active
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">20+</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500">
                    Communities
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Communities",
                  desc: "Discussion hubs for every interest. Coding, photography, gaming, or just random college news.",
                  icon: <MessageSquare className="text-indigo-400" />,
                  tags: ["Tech", "Hobby", "Academic"],
                },
                {
                  title: "Opportunities",
                  desc: "Hand-picked campus opportunities. Internships, hackathons, and part-time roles curated for you.",
                  icon: <Target className="text-brand-400" />,
                  tags: ["Internships", "Competitions"],
                },
                {
                  title: "Collaboration",
                  desc: "Find teammates for your next big project or start a study group for that tough end-sem.",
                  icon: <Users className="text-purple-400" />,
                  tags: ["Seniors", "Skill Match"],
                },
                {
                  title: "Events",
                  desc: "Never miss a fest, workshop, or seminar again. Integrated campus calendar with RSVP.",
                  icon: <Calendar className="text-amber-400" />,
                  tags: ["Fest", "Workshops"],
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  className="glass-pro p-10 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row gap-8 items-start hover:border-brand-500/20 transition-all"
                >
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {feature.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-widest"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 🔥 SECTION 4: ENGAGEMENT (HOOK) */}
        <section className="py-32 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                Not just a platform. <br />{" "}
                <span className="text-brand-400">A daily habit.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl font-medium">
                Compete with your peers, maintain your streak, and build a
                campus reputation that gets you noticed.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[320px]">
              {/* Daily Streak */}
              <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden group flex flex-col justify-between border-orange-500/10 hover:border-orange-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Flame className="w-10 h-10 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="text-3xl font-black mb-2">Daily Streak</h4>
                  <p className="text-gray-400 text-sm font-medium">
                    Show up every day, stay ahead. Consistency is the only
                    metric that matters.
                  </p>
                </div>
                <div className="relative z-10 w-full p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Active SPITians
                    </span>
                    <span className="text-[10px] font-black text-orange-500">
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">214</span>
                    <span className="text-sm font-bold text-gray-500 italic">
                      currently on a 10+ day streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden group border-amber-500/10 hover:border-amber-500/30">
                <Trophy className="w-10 h-10 text-amber-500 mb-6" />
                <h4 className="text-3xl font-black mb-2">Leaderboard</h4>
                <p className="text-gray-400 text-sm font-medium mb-8">
                  Climb the ranks. The top contributors get exclusive access to
                  campus networking events.
                </p>

                <div className="space-y-3 relative z-10">
                  {[
                    { name: "Rahul S.", xp: "4820", rank: "1" },
                    { name: "Neha K.", xp: "4610", rank: "2" },
                    { name: "Amit P.", xp: "4300", rank: "3" },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500">
                          #{user.rank}
                        </span>
                        <span className="text-xs font-bold text-gray-200">
                          {user.name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-amber-500">
                        {user.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Challenge */}
              <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden group border-indigo-500/10 hover:border-indigo-500/30">
                <Target className="w-10 h-10 text-indigo-400 mb-6" />
                <h4 className="text-3xl font-black mb-2">Daily Challenge</h4>
                <p className="text-gray-400 text-sm font-medium mb-8">
                  Test your skills every 24 hours. From puzzles to code
                  snippets, stay sharp.
                </p>

                <div className="p-6 bg-[#0c1117] rounded-2xl font-mono text-xs border border-white/5 shadow-inner">
                  <span className="text-brand-400">while</span> (
                  <span className="text-indigo-400">curiosity</span>): <br />
                  &nbsp;&nbsp;<span className="text-amber-400">learn_more</span>
                  () <br />
                  &nbsp;&nbsp;
                  <span className="text-brand-400">maintain_streak</span>(
                  <span className="text-white">today</span>)
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-2xl font-black text-gray-500 tracking-tighter italic lowercase">
                Compete. Stay consistent.{" "}
                <span className="text-brand-400">Get recognized.</span>
              </p>
            </div>
          </div>
        </section>

        {/* 😶 SECTION 5: CAMPUS PULSE */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                  What’s really happening <br /> inside SPIT 👀
                </h2>
                <p className="text-gray-400 text-lg font-medium">
                  The heartbeat of campus. Anonymous. Real. Raw.
                </p>
              </div>
              <div className="px-6 py-3 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-bold uppercase tracking-widest">
                Only for SPIT students
              </div>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {/* Mock Confession */}
              <div className="glass-card p-6 break-inside-avoid border-purple-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Laugh size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    Anonymous Confession
                  </span>
                </div>
                <p className="text-lg font-medium text-white italic leading-relaxed">
                  "Still haven't told my group that I haven't even installed the
                  IDE for our project due tomorrow... God help me 😭"
                </p>
                <div className="mt-6 flex items-center gap-4 text-[10px] font-bold text-gray-500">
                  <span>🔥 142 spicy</span>
                  <span>💬 12 reactions</span>
                </div>
              </div>

              {/* Mock Poll */}
              <div className="glass-card p-6 break-inside-avoid border-brand-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400">
                    <BarChart3 size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    Campus Poll
                  </span>
                </div>
                <p className="text-sm font-bold text-white mb-4">
                  Best spot to study during finals?
                </p>
                <div className="space-y-2">
                  <div className="relative p-3 rounded-xl border border-white/5 bg-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-500/20 w-[64%]"></div>
                    <div className="relative flex justify-between text-[11px] font-bold">
                      <span>Library (Quiet Zone)</span>
                      <span>64%</span>
                    </div>
                  </div>
                  <div className="relative p-3 rounded-xl border border-white/5 bg-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-500/10 w-[36%]"></div>
                    <div className="relative flex justify-between text-[11px] font-bold">
                      <span>Cafeteria</span>
                      <span>36%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Thought */}
              <div className="glass-card p-6 break-inside-avoid border-indigo-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Megaphone size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    Hot Take
                  </span>
                </div>
                <p className="text-base font-medium text-gray-300">
                  "The new cafeteria coffee is actually better than Starbucks.
                  Don't @ me."
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-[#020609] bg-brand-500"></div>
                    <div className="w-6 h-6 rounded-full border-2 border-[#020609] bg-indigo-500"></div>
                    <div className="w-6 h-6 rounded-full border-2 border-[#020609] bg-purple-500"></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 italic">
                    24 students agree
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🧠 SECTION 6: SOCIAL PROOF */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="glass p-12 md:p-20 rounded-[4rem] text-center border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-indigo-600/10 opacity-50"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-16">
                  Already growing across SPIT
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-4xl md:text-6xl font-black text-white mb-2">
                      500+
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Verified Students
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-6xl font-black text-brand-400 mb-2">
                      2.4k
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Monthly Posts
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-6xl font-black text-indigo-400 mb-2">
                      850
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Active Members
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-6xl font-black text-purple-400 mb-2">
                      120+
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Opportunities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: FINAL CTA */}
        <section className="py-20 ">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-full mx-auto glass-pro p-16 md:p-24  text-center border-2 border-brand-500/20 relative shadow-[0_0_100px_rgba(20,184,166,0.15)] overflow-hidden"
          >
            <div className="absolute  bg-gradient-to-br from-brand-500/20 via-transparent to-indigo-500/20"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">
                If you're in SPIT, <br /> you should be here.
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Don’t miss out on what your campus is building. Join the
                conversation, find your team, and stay in the loop.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="btn-primary px-12 py-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-4 mx-auto shadow-[0_0_60px_rgba(20,184,166,0.4)] hover:shadow-[0_0_80px_rgba(20,184,166,0.7)] transition-all hover:scale-105"
              >
                Join SPITConnect Now
              </button>

              <p className="mt-8 text-xs font-bold text-gray-600 uppercase tracking-[0.2em]">
                Verified SPIT credentials required to join
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#010305] text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="font-black text-white tracking-widest uppercase">
                SPITConnect
              </span>
            </div>
            <div className="flex gap-8 text-xs font-bold tracking-widest uppercase">
              <a href="#" className="hover:text-brand-400">
                About
              </a>
              <a href="#" className="hover:text-brand-400">
                Guidelines
              </a>
              <a href="#" className="hover:text-brand-400">
                Support
              </a>
            </div>
            <p className="text-[10px] font-medium">
              Built by Students. For the Campus. © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
