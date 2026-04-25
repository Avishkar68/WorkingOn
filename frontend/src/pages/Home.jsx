


import { useContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import api from "../api/axios"
import { jwtDecode } from "jwt-decode"
import { ArrowUpRight, Plus, Users, LayoutGrid } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import WelcomeModal from "../components/dialogueboxes/WelcomeModal"
import ChallengeSuccessModal from "../components/dialogueboxes/ChallengeSuccessModal"
import PageShell from "../components/layout/PageShell"
import Skeleton from "../components/ui/Skeleton"
import { AuthContext } from "../context/AuthContext"
import { trackEvent } from "../utils/analytics"

export default function Home() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showChallengeSuccess, setShowChallengeSuccess] = useState(false)
  const [userRank, setUserRank] = useState(0)
  const { getUser } = useContext(AuthContext)
  const [joiningId, setJoiningId] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

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

  // ✅ STAGGER CONTAINER
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  // ✅ INDIVIDUAL CARD ANIMATION
  const item = {
    hidden: {
      opacity: 0,
      y: 12,
      scale: 0.98
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
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

  // Inside handleJoin in Home.jsx
  const handleJoin = async (e, id) => {
    e.stopPropagation()
    setJoiningId(id) // Start loading for this specific card

    try {
      await api.post(`/communities/${id}/join`)
      await getUser()

      trackEvent('join_community', { id: id });
      toast.success("Joined community successfully!")
      await fetchCommunities()

      navigate("/communities", {
        state: {
          selectedCommunityId: id,
          justJoined: true
        }
      })
    } catch (err) {
      console.error(err)
      toast.error("Failed to join community")
    } finally {
      setJoiningId(null) // Reset loading state
    }
  }

  useEffect(() => {
    trackEvent('page_view_component', { page: 'Home' });
    fetchCommunities()
    const showWelcome = localStorage.getItem("showWelcomeModal")
    if (showWelcome === "true") {
      setShowWelcome(true)
      localStorage.removeItem("showWelcomeModal")
    }

    // 🏆 CHECK CHALLENGE SUCCESS
    if (location.state?.challengeSuccess) {
      trackEvent('challenge_success', { rank: location.state.rank });
      setShowChallengeSuccess(true)
      setUserRank(location.state.rank)
      // Clear location state so it doesn't show again on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  if (loading) {
    return (
      <PageShell eyebrow="Communities" title="Explore communities" subtitle="Join focused spaces and collaborate with people in your domain.">
        <div className="grid grid-cols-1  gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card p-6 flex flex-col min-h-[220px] justify-between">
              <Skeleton className="absolute top-4 right-4 w-12 h-6 rounded-full" />
              <div className="space-y-3 mt-2">
                <Skeleton className="w-3/4 h-8" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
              </div>
              <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/10">
                <Skeleton className="w-24 h-8 rounded-xl" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow="Communities"
      title="Explore communities"
      subtitle="Join focused spaces and collaborate with people in your domain."
      actions={
        <div className="flex items-center gap-3 ">
          <button
            onClick={() => navigate("/communities")}
            className="flex items-center gap-2 px-4 py-2  text-sm font-semibold text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/10"
          >
            <LayoutGrid size={16} />
            Communities Hub
          </button>
        </div>
      }
    >
      {showWelcome && <WelcomeModal close={() => setShowWelcome(false)} />}
      {showChallengeSuccess && (
        <ChallengeSuccessModal
          rank={userRank}
          close={() => setShowChallengeSuccess(false)}
        />
      )}

      {/* ✅ ANIMATED GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 "
      >
        {communities.map((c) => {
          const isJoined = c.members?.includes(userId)
          const isThisCardLoading = joiningId === c._id // Check if this specific card is joining

          return (
            <motion.div
              key={c._id}
              variants={item}
              onClick={() => {
                trackEvent('card_click', { card_type: 'community', id: c._id, name: c.name });
                navigate("/communities", { state: { selectedCommunityId: c._id } });
              }}
              className="group relative glass-card p-6  cursor-pointer flex flex-col min-h-[220px] justify-between overflow-hidden"
            >
              {/* MEMBER COUNT */}
              <div className="absolute top-4 right-4 pill-badge z-20 shadow-sm border-white/5 bg-black/40 backdrop-blur-md">
                <Users size={12} className="text-indigo-400 mr-1.5" />
                <span>{c.members?.length || 0}</span>
              </div>

              {/* CONTENT */}
              <div className="relative z-10 space-y-3 mt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-indigo-300 transition-colors tracking-tight leading-snug">
                  {c.name}
                </h2>

                <p className="text-sm text-text-secondary mb-2 leading-relaxed line-clamp-2 whitespace-pre-wrap">
                  {c.description}
                </p>
              </div>

              {/* ACTION BAR */}
              <div className="relative z-10 flex items-center justify-between mt-auto pt-5 border-t border-white/10">
                <button
                  onClick={(e) => !isThisCardLoading && handleJoin(e, c._id)}
                  disabled={isThisCardLoading}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center gap-2 ${isJoined
                    ? "bg-emerald-500/16 text-emerald-300 border border-emerald-400/30"
                    : "btn-primary"
                    } ${isThisCardLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isThisCardLoading ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : isJoined ? (
                    "Joined"
                  ) : (
                    "Join now"
                  )}
                </button>

                <div className="text-slate-500 group-hover:text-slate-200 transition-all flex items-center gap-1.5 text-xs font-medium tracking-wide">
                  Explore <ArrowUpRight size={16} />
                </div>
              </div>

              {/* HOVER GLOW */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/8 rounded-full blur-[60px] group-hover:bg-indigo-500/14 transition-all duration-700" />
            </motion.div>
          )
        })}
      </motion.div>
    </PageShell>
  )
}