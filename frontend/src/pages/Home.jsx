import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { jwtDecode } from "jwt-decode"
import { Users, Plus, ArrowUpRight } from "lucide-react"

import WelcomeModal from "../components/dialogueboxes/WelcomeModal"

export default function Home() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  let userId = null

  if (token) {
    try {
      const decoded = jwtDecode(token)
      userId = decoded.id || decoded._id
    } catch {
      userId = null
    }
  }

  const fetchCommunities = async () => {
    try {
      const res = await api.get("/communities")
      setCommunities(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleJoin = async (e, id) => {
    e.stopPropagation()
    try {
      await api.post(`/communities/${id}/join`)
      fetchCommunities()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCommunities()
    const isFirstVisit = localStorage.getItem("firstVisit")
    if (!isFirstVisit) {
      setShowWelcome(true)
      localStorage.setItem("firstVisit", "true")
    }
  }, [])

  if (loading) {
    return <p className="text-gray-400 text-center mt-10 animate-pulse">Loading...</p>
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      {showWelcome && <WelcomeModal close={() => setShowWelcome(false)} />}

      {/* HEADER */}
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Explore Communities
        </h1>

        <button
          onClick={() => navigate("/create-community")}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} className="inline mr-1" strokeWidth={2.5} />
          Create
        </button>
      </div>

      {/* COMMUNITY GRID (2-Column strictly to match image density) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((c) => {
          const isJoined = c.members?.includes(userId)

          return (
            <div
              key={c._id}
              onClick={() => navigate(`/community/${c._id}`)}
              // The base dark glass style from the image
              className="group relative glass rounded-[2rem] p-8 cursor-pointer 
              border border-white/5 hover:border-white/10 transition-all duration-300 
              flex flex-col min-h-[220px] justify-between overflow-hidden"
            >
              {/* MEMBER COUNT PILL - TOP RIGHT */}
              <div className="absolute top-6 right-8 flex items-center gap-1.5 bg-black/30 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full z-20">
                <Users size={12} className="text-indigo-400" />
                <span className="text-[11px] font-bold text-gray-200 tracking-widest uppercase">
                  {c.members?.length || 0}
                </span>
              </div>

              {/* CONTENT: TITLE & DESCRIPTION */}
              <div className="relative z-10 space-y-3">
                <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight leading-snug">
                  {c.name}
                </h2>
                
                <p className="text-sm text-gray-400 mb-2 leading-relaxed font-medium opacity-90 line-clamp-2">
                  {c.description}
                </p>
              </div>

              {/* ACTION BAR - ABSOLUTE BOTTOM positioning to match image */}
              <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <button
                  onClick={(e) => handleJoin(e, c._id)}
                  // Join Button styling from image: Bold, high contrast or Subtle Emerald
                  className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-90 ${
                    isJoined
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-white text-black hover:bg-indigo-500 hover:text-white"
                  }`}
                >
                  {isJoined ? "Joined" : "Join Now"}
                </button>

                {/* Explore button styling from image */}
                <div className="text-gray-500 group-hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                   Explore <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Subtle hover background effect */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-[60px] group-hover:bg-indigo-500/10 transition-all duration-700" />
            </div>
          )
        })}
      </div>
    </div>
  )
}