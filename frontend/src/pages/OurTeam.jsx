import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Globe, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animation Variants
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const teamMembers = [
    {
        name: "Avishkar Kakade",
        role: " Co-Founder & Developer",
        image: "https://res.cloudinary.com/dgof8mfp3/image/upload/v1776371819/Screenshot_2026-04-17_at_2.04.32_AM_renebx.png",
        bio: "Second-year Computer Engineering student at SPIT. Specialized in building Full-Stack Applications.",
        links: { github: "https://github.com/Avishkar68", linkedin: "https://www.linkedin.com/in/avishkar-kakade-16536124b/", twitter: "#" },
    },
    {
        name: "Falashree Shirodkar",
        role: "Co-Founder & Developer ",
        image: "https://res.cloudinary.com/dgof8mfp3/image/upload/v1776371611/WhatsApp_Image_2026-04-17_at_01.54.13_kwlcvi.jpg",
        bio: "Works on AI-driven features. Analyzes user behavior. Improves productivity and experience.",
        links: { github: "https://github.com/ShirodkarFalashree", linkedin: "https://www.linkedin.com/in/shirodkarfalashree/", twitter: "#" },
    },
    {
        name: "Pratiksha Hekare",
        role: "Developer & Marketing",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nitin",
        bio: "Crafting seamless user experiences with React and Framer Motion. UI polish enthusiast.",
        links: { github: "#", linkedin: "#", twitter: "#" },
    },
    {
        name: "Manasvi More",
        role: "Developer & Marketing",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Falashree",
        bio: "Focusing on user behavior and AI workplace productivity within the campus ecosystem.",
        links: { github: "#", linkedin: "#", twitter: "#" },
    },
];

export default function OurTeam() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020609] text-[#ededed] overflow-x-hidden selection:bg-brand-500/30 font-sans tracking-tight">
            {/* Dynamic Background (Matching Landing Page) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-600/10 blur-[180px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[180px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between bg-[#020609]/80 backdrop-blur-xl">
                <div
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-bold text-xl tracking-tighter">SPITConnect</span>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>
            </nav>

            <main className="relative z-10 pt-26 pb-20 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        The Minds Behind <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-500 to-indigo-500">
                            The Platform.
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                        We are a group of SPITians dedicated to bridging the gap between students,
                        opportunities, and campus culture.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ y: -10 }}
                            className="glass-pro p-6 rounded-[2.5rem] border border-white/5 hover:border-brand-500/30 transition-all group shadow-xl"
                        >
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="relative w-full aspect-square object-cover rounded-[2rem] border border-white/10"
                                />
                            </div>

                            <h3 className="text-2xl font-black tracking-tight mb-1">{member.name}</h3>
                            <p className="text-brand-400 text-xs font-black uppercase tracking-widest mb-4">
                                {member.role}
                            </p>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
                                {member.bio}
                            </p>

                            <div className="flex gap-4">
                                <a href={member.links.github} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                    <Github size={18} />
                                </a>
                                <a href={member.links.linkedin} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                    <Linkedin size={18} />
                                </a>
                                {/* <a href={member.links.twitter} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                    <Twitter size={18} />
                                </a> */}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </div>
    );
}