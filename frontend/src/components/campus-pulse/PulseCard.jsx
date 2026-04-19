import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Flame, Heart, Laugh, Flag, BarChart3, Clock, ShieldAlert, ArrowBigUpDash, ArrowBigDownDash } from "lucide-react";
import { buttonTap, cardHover } from "../../lib/motion";
import api from "../../api/axios";
import toast from "react-hot-toast";
import ReportModal from "../common/ReportModal";
import { AuthContext } from "../../context/AuthContext";


export default function PulseCard({ post }) {
  const { user } = useContext(AuthContext);
  const currentUserId = user?._id;

  const [voted, setVoted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  
  // Track counts and check if I have reacted
  const [reactions, setReactions] = useState({
    funny: Array.isArray(post.reactions?.funny) ? post.reactions.funny.length : 0,
    relatable: Array.isArray(post.reactions?.relatable) ? post.reactions.relatable.length : 0,
    spicy: Array.isArray(post.reactions?.spicy) ? post.reactions.spicy.length : 0,
    userReactions: {
      funny: Array.isArray(post.reactions?.funny) && post.reactions.funny.includes(currentUserId),
      relatable: Array.isArray(post.reactions?.relatable) && post.reactions.relatable.includes(currentUserId),
      spicy: Array.isArray(post.reactions?.spicy) && post.reactions.spicy.includes(currentUserId)
    },
    upvotes: Array.isArray(post.upvotes) ? post.upvotes.length : 0,
    downvotes: Array.isArray(post.downvotes) ? post.downvotes.length : 0,
    userVote: Array.isArray(post.upvotes) && post.upvotes.includes(currentUserId) ? "upvote" : 
              Array.isArray(post.downvotes) && post.downvotes.includes(currentUserId) ? "downvote" : null
  });

  const [status, setStatus] = useState(post.status || "active");
  const [showHiddenContent, setShowHiddenContent] = useState(false);

  useEffect(() => {
    if (post.reactions) {
      setReactions({
        funny: Array.isArray(post.reactions.funny) ? post.reactions.funny.length : 0,
        relatable: Array.isArray(post.reactions.relatable) ? post.reactions.relatable.length : 0,
        spicy: Array.isArray(post.reactions.spicy) ? post.reactions.spicy.length : 0,
        userReactions: {
          funny: Array.isArray(post.reactions.funny) && post.reactions.funny.includes(currentUserId),
          relatable: Array.isArray(post.reactions.relatable) && post.reactions.relatable.includes(currentUserId),
          spicy: Array.isArray(post.reactions.spicy) && post.reactions.spicy.includes(currentUserId)
        }
      });
    }

    if (post.upvotes || post.downvotes) {
      setReactions(prev => ({
        ...prev,
        upvotes: Array.isArray(post.upvotes) ? post.upvotes.length : prev.upvotes,
        downvotes: Array.isArray(post.downvotes) ? post.downvotes.length : prev.downvotes,
        userVote: Array.isArray(post.upvotes) && post.upvotes.includes(currentUserId) ? "upvote" : 
                  Array.isArray(post.downvotes) && post.downvotes.includes(currentUserId) ? "downvote" : null
      }));
    }

    if (post.status) setStatus(post.status);
    
    if (post.votedUsers) {
      setVoted(post.votedUsers.some(v => (v._id || v).toString() === currentUserId?.toString()));
    }
  }, [post.reactions, post.upvotes, post.downvotes, post.status, post.votedUsers, currentUserId]);

  const handleReaction = async (type) => {
    if (!currentUserId) return toast.error("Login to react!");

    // Optimistic UI update
    const alreadyReacted = reactions.userReactions[type];
    setReactions(prev => ({
      ...prev,
      [type]: alreadyReacted ? prev[type] - 1 : prev[type] + 1,
      userReactions: {
        ...prev.userReactions,
        [type]: !alreadyReacted
      }
    }));
    
    try {
      await api.post(`/pulses/${post._id}/react`, { type });
    } catch (err) {
      toast.error("Failed to react");
      // Rollback logic would be complex here, usually rely on socket update
    }
  };

  const handleVote = async (optionId) => {
    if (!currentUserId) return toast.error("Login to vote!");
    
    // Optimistic lock
    setVoted(true);
    
    try {
      await api.post(`/pulses/${post._id}/vote`, { optionId });
      toast.success("Vote recorded!");
    } catch (err) {
      setVoted(false);
      toast.error(err.response?.data?.message || "Failed to vote");
    }
  };

  const handleReport = () => {
    setShowReport(true);
  };

  const handlePulseVote = async (type) => {
    if (!currentUserId) return toast.error("Login to vote!");
    
    // Toggle logic: if clicking same type, we are basically removing it (backend handles filter)
    // But for UI feel, we can simulate toggle
    try {
      const res = await api.post(`/pulses/${post._id}/vote-pulse`, { voteType: type });
      // Update will come via Socket, but we can update local state for speed
      setReactions(prev => ({
        ...prev,
        upvotes: res.data.upvotes.length,
        downvotes: res.data.downvotes.length,
        userVote: res.data.upvotes.includes(currentUserId) ? "upvote" : 
                  res.data.downvotes.includes(currentUserId) ? "downvote" : null
      }));
      setStatus(res.data.status);
    } catch (err) {
      toast.error("Failed to record vote");
    }
  };


  const renderContent = () => {
    switch (post.type) {
      case "poll":
        return (
          <div className="space-y-3 mt-2">
            <p className="text-text-primary text-[15px] leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
            {post.pollOptions?.map((opt) => {
              const totalVotes = post.pollOptions.reduce((acc, curr) => acc + (curr.votes || 0), 0);
              const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
              const isMyChoice = opt.voters?.some(v => (v._id || v || v.toString()).toString() === currentUserId?.toString());

              return (
                <button
                  key={opt._id}
                  onClick={() => handleVote(opt._id)}
                  className="w-full relative group overflow-hidden"
                >
                  <div className={`relative z-10 p-3.5 flex justify-between items-center rounded-xl border transition-all duration-300 ${
                    isMyChoice 
                      ? "border-brand-500 bg-brand-500/10 shadow-[0_0_15px_rgba(20,184,166,0.2)]" 
                      : voted 
                        ? "border-white/5 bg-white/[0.03]" 
                        : "border-white/10 bg-white/[0.05] hover:border-brand-500/40 hover:bg-brand-500/[0.02]"
                  }`}>
                    <div className="flex items-center gap-2">
                       <span className={`text-sm font-medium ${isMyChoice ? "text-brand-400" : "text-text-primary/90"}`}>
                         {opt.text}
                       </span>
                       {isMyChoice && <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />}
                    </div>
                    {voted && <span className={`text-xs font-bold tracking-tight ${isMyChoice ? "text-brand-400" : "text-text-muted"}`}>{percentage}%</span>}
                  </div>
                  {/* Progress Bar */}
                  {voted && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="absolute inset-0 bg-brand-500/10 pointer-events-none rounded-xl"
                    />
                  )}
                </button>
              );
            })}
            <p className="text-[10px] text-text-muted mt-2 italic tracking-wide">
              {voted ? "Thanks for voting! " : ""}Anonymous poll • {post.pollOptions?.reduce((a, c) => a + (c.votes || 0), 0) || 0} votes
            </p>
          </div>
        );


      default: // Confession
        return (
          <p className="text-[17px] leading-relaxed font-medium bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent tracking-tight whitespace-pre-wrap">
            {post.content}
          </p>
        );
    }
  };

  if (status === "hidden" && !showHiddenContent) {
    return (
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="glass-card p-6 flex flex-col items-center justify-center text-center gap-4 mb-4 lg:mb-6"
      >
        <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
           <ShieldAlert size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary mb-1"> Post Hidden</p>
          <p className="text-[11px] text-text-muted leading-relaxed">
            This pulse was hidden due to community feedback.
          </p>
        </div>
        <button 
          onClick={() => setShowHiddenContent(true)}
          className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition"
        >
          View Content Anyway
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={cardHover}
      className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden break-inside-avoid mb-4 lg:mb-6 h-fit"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            post.type === "confession" ? "bg-purple-500/10 text-purple-400" :
            post.type === "poll" ? "bg-brand-500/10 text-brand-400" :
            "bg-amber-500/10 text-amber-400"
          }`}>
             {post.type === "confession" ? <Laugh size={16} /> : <BarChart3 size={16} />}
          </div>
          <div>
            <span className="text-[11px] font-bold text-text-primary uppercase tracking-[0.15em] opacity-80 decoration-indigo-500/30 underline-offset-4">
              Anonymous Student 
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-medium mt-0.5">
               <span>
                 {new Date(post.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </span>
               <span className="opacity-40">•</span>
               <span className="capitalize tracking-wider">{post.type}</span>
            </div>
          </div>
        </div>
        <button onClick={handleReport} className="text-red-500/50 hover:text-red-400 transition-colors" title="Report Pulse">
          <ShieldAlert size={16} />
        </button>
      </div>

      {showReport && (
        <ReportModal
          entityId={post._id}
          entityModel="Pulse"
          reportedUserId={null} // Anonymous, so no explicit user traced on frontend
          snapshot={`[${post.type.toUpperCase()}] ${post.content}`}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Content */}

      <div className="flex-1">
        {renderContent()}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={buttonTap}
            onClick={() => handleReaction("funny")}
             className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${reactions.userReactions.funny ? "text-amber-400" : "text-slate-500 hover:text-amber-400"}`}
          >
            <Laugh size={16} />
            <span>{reactions.funny}</span>
          </motion.button>
          <motion.button
            whileTap={buttonTap}
            onClick={() => handleReaction("relatable")}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${reactions.userReactions.relatable ? "text-brand-400" : "text-slate-500 hover:text-brand-400"}`}
          >
            <Heart size={16} />
            <span>{reactions.relatable}</span>
          </motion.button>
          <motion.button
            whileTap={buttonTap}
            onClick={() => handleReaction("spicy")}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${reactions.userReactions.spicy ? "text-orange-500" : "text-slate-500 hover:text-orange-500"}`}
          >
            <Flame size={16} />
            <span>{reactions.spicy}</span>
          </motion.button>
        </div>
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
           <motion.button
             whileTap={buttonTap}
             onClick={() => handlePulseVote("upvote")}
             className={`flex items-center gap-1 text-[11px] font-bold transition ${reactions.userVote === "upvote" ? "text-emerald-400" : "text-text-muted hover:text-emerald-400"}`}
           >
             <ArrowBigUpDash /> {reactions.upvotes}
           </motion.button>
           <motion.button
             whileTap={buttonTap}
             onClick={() => handlePulseVote("downvote")}
             className={`flex items-center gap-1 text-[11px] font-bold transition ${reactions.userVote === "downvote" ? "text-red-400" : "text-text-muted hover:text-red-400"}`}
           >
             <ArrowBigDownDash /> {reactions.downvotes}
           </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
