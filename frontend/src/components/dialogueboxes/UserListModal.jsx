import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, User as UserIcon, ArrowRight } from "lucide-react"

export default function UserListModal({ isOpen, onClose, title, users, navigate }) {
  const safeUsers = Array.isArray(users) ? users : []

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 10 }}
           className="w-full max-w-[440px] rounded-2xl p-6 text-white space-y-5 
             bg-white/5 backdrop-blur-xl border border-white/10 
             shadow-[0_0_25px_rgba(99,102,241,0.15)]"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                {title}
              </h2>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
                {safeUsers.length} {safeUsers.length === 1 ? "User" : "Users"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* USER LIST */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide space-y-2 pr-1">
            {safeUsers.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 italic text-sm">
                No users found.
              </div>
            ) : (
              safeUsers.map((user) => (
                <motion.div
                  key={user._id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    navigate(`/user/${user._id}`)
                    onClose()
                  }}
                  className="group flex items-center gap-4 p-3 rounded-2xl border border-transparent 
                    hover:border-white/10 hover:bg-white/5 cursor-pointer transition-all"
                >
                  {/* AVATAR */}
                  <div className="relative">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-500/50 transition-all shadow-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user.name?.[0] || "U"}
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      View full profile
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                    <ArrowRight size={16} className="text-indigo-400" />
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-sm transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  )
}
