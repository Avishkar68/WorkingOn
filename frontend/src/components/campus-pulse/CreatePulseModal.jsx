import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, EyeOff, BarChart3, Laugh, AlertCircle } from "lucide-react";
import { buttonTap } from "../../lib/motion";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function CreatePulseModal({ close }) {
  const [type, setType] = useState("confession");
  const [content, setContent] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const handleAddOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, ""]);
  };

  const handleOptionChange = (idx, val) => {
    const newOpts = [...pollOptions];
    newOpts[idx] = val;
    setPollOptions(newOpts);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error("Write something first!");
    
    let options = [];
    if (type === "poll") {
      options = pollOptions.filter(o => o.trim() !== "");
      if (options.length < 2) return toast.error("Need at least two valid poll options!");
    }

    setLoading(true);
    try {
      // Create FormData if we want to support images later, normally simple JSON works
      // But pulseController expects req.body.type, req.body.content, req.body.pollOptions
      const payload = new FormData();
      payload.append("type", type);
      payload.append("content", content);
      
      if (type === "poll") {
        // Pulse schema expects [{text: "opt"}, ...] in controller parser
        const formattedOptions = options.map(t => ({ text: t }));
        payload.append("pollOptions", JSON.stringify(formattedOptions));
      }

      await api.post("/pulses", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Posted to the Pulse! 🔥");
      close();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to post on Pulse");
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: "confession", label: "Confession", icon: Laugh, color: "text-purple-400" },
    { id: "poll", label: "Poll", icon: BarChart3, color: "text-brand-400" }
    // Asks intentionally removed as per request
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-pro w-full max-w-lg p-6 rounded-3xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-brand-500/10 flex items-center justify-center">
              <EyeOff size={20} className="text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Share a Pulse</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Anonymous Interaction Hub</p>
            </div>
          </div>
          <button onClick={close} disabled={loading} className="p-2 hover:bg-white/5 rounded-xl transition text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Safety Warning */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-500/80">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed font-medium">
            Be respectful. No abuse, harassing individuals, or targeting groups. Admins can review flagged content to keep our campus safe.
          </p>
        </div>

        {/* Type Switcher */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          {types.map((t) => (
            <button
              key={t.id}
              disabled={loading}
              onClick={() => setType(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                type === t.id ? "bg-white/10 text-white shadow-xl" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <t.icon size={14} className={type === t.id ? t.color : ""} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
              Your {type === "confession" ? "Confession" : "Question"}
            </label>
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              placeholder={
                type === "confession" ? "Something on your mind? Spill the beans anonymously..." :
                "What do you want to ask the campus?"
              }
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all min-h-[100px] lg:min-h-[140px]"
            />
          </div>

          {type === "poll" && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                Poll Options
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    disabled={loading}
                    placeholder={`Option ${i + 1}`}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all shadow-inner"
                  />
                ))}
              </div>
              {pollOptions.length < 4 && (
                <button
                  onClick={handleAddOption}
                  disabled={loading}
                  className="text-[10px] font-bold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-widest mt-1 px-1"
                >
                  + Add Option
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 cursor-not-allowed group opacity-50">
            <div className="h-4 w-4 rounded-full border border-white/20 flex items-center justify-center bg-brand-500 border-brand-400">
               <div className="h-1.5 w-1.5 bg-white rounded-full group-hover:scale-125 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-slate-400">Posts are strictly anonymous</span>
          </div>

          <motion.button
            whileTap={buttonTap}
            onClick={handleSubmit}
            disabled={loading}
            className={`btn-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(20,184,166,0.2)] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Send size={16} />
            {loading ? "Posting..." : "Post"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
