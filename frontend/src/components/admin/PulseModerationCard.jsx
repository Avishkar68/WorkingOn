import { motion } from "framer-motion";
import { Trash2, RotateCcw, ShieldAlert, ThumbsUp, ThumbsDown, BarChart3, Flame, Laugh } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function PulseModerationCard({ pulse, onRefresh }) {
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this pulse?")) return;
    try {
      await api.delete(`/admin/pulse/${pulse._id}`);
      toast.success("Pulse deleted");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete pulse");
    }
  };

  const handleRestore = async () => {
    try {
      await api.post(`/admin/pulse/${pulse._id}/restore`);
      toast.success("Pulse restored to active feed");
      onRefresh();
    } catch (err) {
      toast.error("Failed to restore pulse");
    }
  };

  const upvotes = Array.isArray(pulse.upvotes) ? pulse.upvotes.length : 0;
  const downvotes = Array.isArray(pulse.downvotes) ? pulse.downvotes.length : 0;
  const reports = Array.isArray(pulse.reportedBy) ? pulse.reportedBy.length : 0;

  return (
    <div className="glass-card p-5 relative overflow-hidden break-inside-avoid mb-4 border-white/5 bg-white/[0.02]">
      {/* STATUS BADGE */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
           <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            pulse.type === "confession" ? "bg-purple-500/10 text-purple-400" :
            pulse.type === "poll" ? "bg-brand-500/10 text-brand-400" :
            "bg-amber-500/10 text-amber-400"
          }`}>
             {pulse.type === "confession" ? <Laugh size={14} /> :
              pulse.type === "poll" ? <BarChart3 size={14} /> :
              <Flame size={14} />}
          </div>
          <span className="text-[11px] font-bold text-text-muted capitalize tracking-widest">{pulse.type}</span>
        </div>
        
        <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
          pulse.status === "hidden" ? "bg-red-500/20 text-red-400 border border-red-500/20" : 
          pulse.status === "reported" ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" :
          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
        }`}>
          {pulse.status}
        </div>
      </div>

      <p className="text-sm text-text-primary/90 leading-relaxed mb-4 line-clamp-3 whitespace-pre-wrap">
        {pulse.content}
      </p>

      {/* METRICS */}
      <div className="flex items-center gap-4 py-3 border-y border-white/5 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400/80">
          <ThumbsUp size={14} /> {upvotes}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-400/80">
          <ThumbsDown size={14} /> {downvotes}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400/80">
          <ShieldAlert size={14} /> {reports}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold py-2 rounded-xl transition flex items-center justify-center gap-2"
        >
          <Trash2 size={12} /> Delete
        </button>
        {(pulse.status === "hidden" || pulse.status === "reported") && (
          <button
            onClick={handleRestore}
            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold py-2 rounded-xl transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={12} /> Restore
          </button>
        )}
      </div>

      {/* BACKGROUND DECO */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
