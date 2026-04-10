import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Zap,
  Calendar,
  Trophy,
  ArrowRight,
  ChevronRight,
  Activity,
  Globe,
  Star
} from "lucide-react";

const features = [
  {
    title: "Find Your People",
    description: "Connect with communities built around your passions and interests.",
    icon: <Users className="w-6 h-6 text-brand-400" />,
    color: "from-brand-500/20 to-brand-500/0",
    border: "group-hover:border-brand-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]",
  },
  {
    title: "Build Together",
    description: "Find co-founders, collaborators, and team members for your next big project.",
    icon: <Zap className="w-6 h-6 text-indigo-400" />,
    color: "from-indigo-500/20 to-indigo-500/0",
    border: "group-hover:border-indigo-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
  },
  {
    title: "Never Miss Out",
    description: "Get real-time updates on internships, jobs, and exclusive opportunities.",
    icon: <Briefcase className="w-6 h-6 text-purple-400" />,
    color: "from-purple-500/20 to-purple-500/0",
    border: "group-hover:border-purple-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  },
  {
    title: "Stay Updated",
    description: "Discover tech events, hackathons, and cultural fests happening on campus.",
    icon: <Calendar className="w-6 h-6 text-pink-400" />,
    color: "from-pink-500/20 to-pink-500/0",
    border: "group-hover:border-pink-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
  },
  {
    title: "Gamified Growth",
    description: "Climb the leaderboard, build your streak, and earn respect among peers.",
    icon: <Trophy className="w-6 h-6 text-amber-400" />,
    color: "from-amber-500/20 to-amber-500/0",
    border: "group-hover:border-amber-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
  },
];

const mockCards = [
  { title: "Hackathon 2026", type: "Event", icon: Calendar, delay: 0.2 },
  { title: "Frontend Dev Wanted", type: "Opportunity", icon: Briefcase, delay: 0.4 },
  { title: "AI/ML Enthusiasts", type: "Community", icon: Users, delay: 0.6 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  if (isAuth === true) {
    return <Navigate to="/" replace />;
  }

  // Prevent flash of unauthenticated content
  if (isAuth === null) return null;

  return (
    <div className="min-h-screen bg-[#04090b] text-[#ededed] overflow-hidden selection:bg-brand-500/30 selection:text-brand-200">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation (Minimal) */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.5)]">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">SPITConnect</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/login")} className="text-sm font-medium text-gray-300 hover:text-white transition">
            Log in
          </button>
          <button onClick={() => navigate("/register")} className="btn-primary text-sm px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between z-10 pt-48">
        
        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left mb-16 lg:mb-0 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-2"
          >
            <Star className="w-4 h-4" /> The New Standard for Students
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Your Entire <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
              College Life.
            </span>
            <br />
            In One Platform.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-gray-400 max-w-xl leading-relaxed"
          >
            Projects, internships, communities, and events — everything you need to build your career, organized in one beautiful space. Stop missing out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4"
          >
            <button onClick={() => navigate("/register")} className="btn-primary px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 text-lg shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] hover:-translate-y-1">
              Join SPITConnect <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => {
              document.getElementById("features").scrollIntoView({ behavior: "smooth" })
            }} className="btn-secondary px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 text-lg transition-all hover:-translate-y-1 bg-white/5 hover:bg-white/10">
              Explore Platform
            </button>
          </motion.div>
        </div>

        {/* Floating Mock UI */}
        <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 rounded-[2rem] blur-3xl opacity-50"></div>
          
          <div className="relative w-full h-full">
            {mockCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50, x: idx * 20 }}
                  animate={{ opacity: 1, y: [0, -10, 0], x: idx * 20 }}
                  transition={{ 
                    opacity: { duration: 0.5, delay: card.delay },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: card.delay }
                  }}
                  className={`absolute glass-pro p-5 rounded-2xl w-64 border border-white/10 flex items-start gap-4 shadow-2xl z-${30 - idx * 10}`}
                  style={{
                    top: `${15 + idx * 25}%`,
                    left: `${10 + idx * 15}%`,
                    backdropFilter: "blur(20px)"
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 shrink-0">
                    <Icon className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-brand-400 mb-1 tracking-wider uppercase">{card.type}</div>
                    <div className="text-sm font-medium text-white">{card.title}</div>
                    <div className="h-2 w-20 bg-white/10 rounded-full mt-3"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem Section (Pain) */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#04090b] to-[#080d11]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            College is chaotic. <br className="hidden md:block"/>
            <span className="text-gray-500">We fix that.</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
            {[
              { title: "Scattered Info", text: "Endless WhatsApp groups, missed emails, and lost links." },
              { title: "Missed Opportunities", text: "Finding out about that perfect internship a day after the deadline." },
              { title: "Disconnected Builders", text: "Having a great idea but no way to find the right teammates." }
            ].map((pain, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl border border-red-500/10 bg-red-500/5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20"></div>
                <h3 className="text-lg font-semibold text-red-200 mb-2">{pain.title}</h3>
                <p className="text-gray-400 text-sm">{pain.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section (Features) */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Everything you need to thrive.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">A unified ecosystem designed specifically to help you build your network, skills, and career.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group glass-card p-8 rounded-3xl relative overflow-hidden transition-all duration-300 ${feature.border} ${feature.glow}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-white/5 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">Join the fastest growing network on campus.</h2>
              <p className="text-gray-400">Trusted by top students and builders.</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-8">
              {[
                { label: "Active Students", value: "500+" },
                { label: "Opportunities Shared", value: "250+" },
                { label: "Projects Built", value: "50+" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-indigo-300 mb-1">{stat.value}</div>
                  <div className="text-xs font-medium text-gray-400 tracking-wider uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[45px] left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent"></div>

            {[
              { step: "01", title: "Join", desc: "Create your profile and set your interests in seconds." },
              { step: "02", title: "Explore", desc: "Discover communities, events, and projects that match your vibe." },
              { step: "03", title: "Grow", desc: "Participate, build, and climb the leaderboard." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full glass border border-brand-500/20 flex items-center justify-center text-2xl font-bold text-brand-400 mb-6 relative z-10 bg-[#04090b] shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm max-w-[250px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 rounded-[3rem] glass-pro text-center relative overflow-hidden border border-brand-500/20 shadow-[0_20px_60px_-15px_rgba(20,184,166,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-indigo-500/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 relative z-10 tracking-tight">Stop missing out.<br/>Start building.</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 relative z-10 max-w-xl mx-auto">
              Join hundreds of students who are already using SPITConnect to level up their college experience.
            </p>
            
            <button onClick={() => navigate("/register")} className="relative z-10 btn-primary px-10 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mx-auto shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:shadow-[0_0_60px_rgba(20,184,166,0.6)] transition-all hover:-translate-y-1">
              Join SPITConnect Now <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-gray-500" />
          <span className="font-semibold text-gray-300">SPITConnect</span>
        </div>
        <p className="text-sm text-gray-500">© 2026 SPITConnect. All rights reserved.</p>
        <p className="text-xs text-gray-600 mt-2">Built for students, by students.</p>
      </footer>
    </div>
  );
}
