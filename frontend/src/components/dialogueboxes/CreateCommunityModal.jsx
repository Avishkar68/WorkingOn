import { useState } from "react"
import { createPortal } from "react-dom"
import { X, Plus } from "lucide-react"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function CreateCommunityModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim() || !description.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    const loadToast = toast.loading("Launching community...")
    setLoading(true)
    try {
      await api.post("/communities", { name, description })
      toast.success("Community created successfully!", { id: loadToast })
      setName("")
      setDescription("")
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to create community", { id: loadToast })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-[520px] rounded-2xl p-6 text-white space-y-5 
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_25px_rgba(99,102,241,0.15)]">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-wide">
              🌐 Create Community
            </h2>
            <p className="text-sm text-zinc-400">
              Build a hub for collaboration and discussion 🚀
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Community Name
            </label>
            <input
              placeholder="e.g. Competitive Programming"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Description
            </label>
            <textarea
              placeholder="What is this space about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="input resize-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white 
              shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? "Joining..." : "Create 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
