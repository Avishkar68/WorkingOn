import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Plus, Sparkles, Filter, Zap, Heart, Clock, ShieldAlert } from "lucide-react";
import PageShell from "../components/layout/PageShell";
import PulseCard from "../components/campus-pulse/PulseCard";
import CreatePulseModal from "../components/campus-pulse/CreatePulseModal";
import { buttonTap, staggerContainer } from "../lib/motion";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";

export default function CampusPulse() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [activeSort, setActiveSort] = useState("latest");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    const fetchPulses = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/pulses?sort=${activeSort}`);
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch pulses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPulses();
  }, [activeSort]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new posts
    const handleNewPulse = (newPulse) => {
      setPosts((prev) => [newPulse, ...prev]);
    };

    // Listen for reactions
    const handleReactions = ({ pulseId, reactions }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === pulseId ? { ...p, reactions } : p))
      );
    };

    // Listen for poll updates
    const handlePollUpdate = ({ pulseId, pollOptions, votedUsers }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === pulseId ? { ...p, pollOptions, votedUsers } : p))
      );
    };

    socket.on("new-pulse", handleNewPulse);
    socket.on("pulse-reaction", handleReactions);
    socket.on("poll-update", handlePollUpdate);
    socket.on("pulse-vote-update", ({ pulseId, upvotes, downvotes, status }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === pulseId ? { ...p, upvotes, downvotes, status } : p))
      );
    });

    return () => {
      socket.off("new-pulse", handleNewPulse);
      socket.off("pulse-reaction", handleReactions);
      socket.off("poll-update", handlePollUpdate);
      socket.off("pulse-vote-update");
    };
  }, [socket]);

  const filteredPosts = activeTab === "all" ? posts : posts.filter(p => p.type === activeTab);

  const tabs = [
    { id: "all", label: "All", icon: Filter },
    { id: "confession", label: "Confessions 😶", icon: Sparkles },
    { id: "poll", label: "Polls 📊", icon: Zap },
  ];

  const sortTabs = [
    { id: "latest", label: "🆕 Latest", icon: Clock },
    { id: "trending", label: "🔥 Trending", icon: Flame },
    { id: "controversial", label: "⚠️ Controversial", icon: ShieldAlert },
  ];

  const trendingPosts = [...posts].sort((a, b) => 
    (a.reactions?.funny + a.reactions?.relatable + a.reactions?.spicy) - 
    (b.reactions?.funny + b.reactions?.relatable + b.reactions?.spicy)
  ).reverse().slice(0, 3);

  return (
    <PageShell
      eyebrow="Anonymous hub"
      title="Campus Pulse 🔥"
      subtitle="See what’s happening inside campus anonymously. No names, just vibes."
      actions={
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={buttonTap}
          onClick={() => setShowCreateModal(true)}
          className="btn-primary rounded-2xl px-5 py-2.5 text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
        >
          <Plus size={18} />
          <span>Create Pulse</span>
        </motion.button>
      }
    >
      <div className="space-y-8">
        {/* Main Feed */}
        <div className="space-y-8">
          {/* Tabs */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                    activeTab === tab.id 
                      ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white border-brand-500 shadow-lg shadow-brand-500/20" 
                      : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mr-2 flex-shrink-0">Sort By:</span>
              {sortTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSort(tab.id)}
                  className={`whitespace-nowrap flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                    activeSort === tab.id 
                      ? "bg-white/10 text-white border-white/20" 
                      : "bg-transparent text-text-muted border-transparent hover:text-text-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-text-muted/60 font-medium px-1">
              🛡️ Posts are moderated by the community and admins. Misuse can lead to removal.
            </p>
          </div>

          {/* Feed */}
          {loading ? (
            <div className="flex justify-center py-20 text-slate-500">Loading Pulses...</div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="columns-1 md:columns-2 xl:columns-3 gap-4 lg:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => (
                  <PulseCard 
                    key={post._id} 
                    post={post} 
                  />
                ))}
              </AnimatePresence>

              {filteredPosts.length === 0 && (
                 <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                       <Zap size={32} className="opacity-20" />
                    </div>
                    <p className="font-bold text-lg tracking-tight">No pulses in this category yet</p>
                    <p className="text-sm">Be the first to share something anonymous!</p>
                 </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePulseModal 
            close={() => setShowCreateModal(false)} 
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}
