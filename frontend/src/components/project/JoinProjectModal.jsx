import { useState } from "react"
import { createPortal } from "react-dom"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function JoinProjectModal({ projectId, close, refresh }) {
  const [message, setMessage] = useState("")

  const sendRequest = async () => {
    try {
      await api.post(`/projects/${projectId}/join`, { message })
      toast.success("Request sent successfully!")
      refresh()
      close()
    } catch (err) {
      console.error(err)
      toast.error("Failed to send request")
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      {/* The main modal container with glassmorphism and thin border */}
      <div className="bg-[#121212]/80 border border-white/10 backdrop-blur-md w-[500px] rounded-2xl p-8 space-y-6 text-white shadow-2xl">

        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-xl tracking-tight">Join Project</h2>
            <p className="text-gray-400 text-sm mt-1">Briefly explain your interest and skills</p>
          </div>
          <button onClick={close} className="text-gray-500 hover:text-white transition-colors text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            placeholder="Tell them why you'd like to join..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-white/5 rounded-lg p-4 text-sm focus:outline-none focus:border-[#22d3ee]/50 min-h-[120px] resize-none placeholder:text-gray-600"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={close}
            className="px-5 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg text-gray-300 transition-all font-medium"
          >
            Cancel
          </button>

          <button
            onClick={sendRequest}
            className="bg-[#22d3ee] hover:bg-[#0891b2] text-[#083344] px-6 py-2 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            Send Request
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}