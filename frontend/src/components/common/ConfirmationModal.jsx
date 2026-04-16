import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger" 
}) {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"  onClick={(e) => {
        e.stopPropagation(); // 🔥 prevents card click
        onClose();
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card w-full max-w-sm p-6 rounded-3xl space-y-6 border border-white/10 shadow-2xl"
           onClick={(e) => e.stopPropagation()} 
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${isDanger ? 'bg-red-500/10 text-red-400' : 'bg-brand-500/10 text-brand-400'}`}>
              <AlertTriangle size={24} />
            </div>
            <button 
               onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
              className="p-2 hover:bg-white/5 rounded-xl transition text-slate-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}              className="flex-1 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                isDanger 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
