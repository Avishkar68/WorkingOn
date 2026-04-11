import { useState, useEffect, useRef, useContext } from "react"
import { Send, User as UserIcon } from "lucide-react"
import api from "../../api/axios"
import { useSocket } from "../../context/SocketContext"
import { AuthContext } from "../../context/AuthContext"

export default function CommunityChat({ communityId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const socket = useSocket()
  const { user } = useContext(AuthContext)
  const scrollRef = useRef(null)

  // ✅ LOAD HISTORY
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages/${communityId}`)
        setMessages(res.data)
      } catch (err) {
        console.error("Failed to load history:", err)
      } finally {
        setLoading(false)
      }
    }

    if (communityId) fetchHistory()
  }, [communityId])

  // ✅ SOCKET LISTENERS
  useEffect(() => {
    if (!socket || !communityId) return

    socket.emit("join-community", communityId)

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg])
    }

    socket.on("new-community-message", handleNewMessage)

    return () => {
      socket.emit("leave-community", communityId)
      socket.off("new-community-message", handleNewMessage)
    }
  }, [socket, communityId])

  // ✅ AUTO SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    socket.emit("send-community-message", {
      communityId,
      content: newMessage.trim()
    })

    setNewMessage("")
  }

  // ✅ HELPER FOR DATE FORMATTING
  const formatTime = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return "";
    }
  }

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Loading chat history...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] glass-card overflow-hidden">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender?._id === user?._id || msg.sender === user?._id
            return (
              <div 
                key={msg._id || idx} 
                className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* AVATAR */}
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                   {msg.sender?.profileImage ? (
                     <img src={msg.sender.profileImage} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <UserIcon size={14} className="text-slate-500" />
                   )}
                </div>

                {/* BUBBLE */}
                <div className={`max-w-[70%] space-y-1`}>
                  {!isMe && (
                    <span className="text-[10px] font-medium text-slate-400 ml-1">
                      {msg.sender?.name || "User"}
                    </span>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMe 
                      ? "bg-indigo-600 text-white rounded-br-none" 
                      : "bg-slate-800/80 text-slate-100 border border-white/5 rounded-bl-none"
                  }`}>
                    {msg.content}
                  </div>
                  <div className={`text-[9px] text-slate-500 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                    {msg.createdAt ? formatTime(msg.createdAt) : "Just now"}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <form 
        onSubmit={handleSendMessage}
        className="p-4 border-t border-white/10 bg-black/20"
      >
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
