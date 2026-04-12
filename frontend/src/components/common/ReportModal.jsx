import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function ReportModal({ entityId, entityModel, reportedUserId, snapshot, onClose }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const predefinedReasons = [
    "Spam or misleading",
    "Harassment or hate speech",
    "Inappropriate content",
    "Self-harm or suicide",
    "Violation of campus rules",
    "Other"
  ];

  const handleSubmit = async () => {
    if (!reason) return toast.error("Please select a reason");

    setLoading(true);
    try {
      await api.post("/reports", {
        entityId,
        entityModel,
        reportedUserId,
        reason,
        snapshot
      });
      toast.success("Report submitted to admins.");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#121212] border border-white/10 w-full max-w-md p-6 rounded-3xl space-y-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Report Content</h2>
            <p className="text-xs text-slate-400">Specify what's wrong with this {entityModel?.toLowerCase()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block px-1">
            Why are you reporting this?
          </label>
          <div className="grid grid-cols-1 gap-2">
            {predefinedReasons.map((r) => (
              <label
                key={r}
                onClick={() => setReason(r)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  reason === r
                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                    : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  reason === r ? "border-red-500" : "border-slate-500"
                }`}>
                  {reason === r && <div className="w-2 h-2 rounded-full bg-red-500" />}
                </div>
                <span className="text-sm font-medium">{r}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500/80">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed font-medium">
            Reports are anonymous. Our mod team will review the content against campus guidelines.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !reason}
          className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            reason && !loading
              ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              : "bg-red-500/20 text-red-500/50 cursor-not-allowed"
          }`}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </motion.div>
    </div>,
    document.body
  );
}
