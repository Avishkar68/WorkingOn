import { useState, useEffect } from "react"
import { Bell, Menu, Plus, Search } from "lucide-react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { AnimatePresence, motion } from "framer-motion"
import api from "../../api/axios"

import CreatePostModal from "../post/CreatePostModal"
import CreateProjectModal from "../project/CreateProjectModal"
import CreateEventModal from "../events/CreateEventModal"
import CreateOpportunityModal from "../opportunity/CreateOpportunityModal"
import ChallengeModal from "../dialogueboxes/ChallengeModal"
import { buttonTap } from "../../lib/motion"

export default function Topbar({ openSidebar }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [challenge, setChallenge] = useState(null)
  const [leaderboardPreview, setLeaderboardPreview] = useState([])
  const [type, setType] = useState(null)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate()
  const location = useLocation()

  const titleMap = {
    "/": "Dashboard",
    "/projects": "Projects",
    "/events": "Events",
    "/opportunities": "Opportunities",
    "/explore": "Explore",
    "/campus-pulse": "Campus Pulse",
    "/search": "Search",
    "/leaderboard": "Leaderboard",
    "/challenge": "Challenge",
    "/notifications": "Notifications",
    "/settings": "Settings",
    "/profile": "Profile"
  }

  const currentTitle = titleMap[location.pathname] || "Workspace"

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const decoded = jwtDecode(token)
      const id = decoded.id || decoded._id
      const res = await api.get(`/users/${id}`)
      setUser(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadChallengePreview = async () => {
    try {
      const [{ data: today }, { data: leaderboard }] = await Promise.all([
        api.get("/challenge/today"),
        api.get("/streak/leaderboard")
      ])
      setChallenge(today)
      setLeaderboardPreview(leaderboard.slice(0, 3))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadUser()
    loadChallengePreview()

    const todayKey = new Date().toISOString().split("T")[0]
    const shownKey = `challengeModalShown:${todayKey}`

    if (!localStorage.getItem(shownKey)) {
      setShowChallengeModal(true)
      localStorage.setItem(shownKey, "true")
    }

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("global-search-input")?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get("q") || ""
    if (location.pathname === "/search") {
      setSearchQuery(q)
    } else {
      setSearchQuery("")
    }
  }, [location.search, location.pathname])

  return (
    <>
      <div className="sticky top-0 z-20 glass rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2">

        {/* LEFT: Menu & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          <button
            onClick={openSidebar}
            className="p-1 -ml-1 lg:hidden text-white"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 leading-tight">Workspace</p>
            <h1 className="text-sm font-semibold text-slate-100 truncate">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* CENTER: SEARCH (Hidden on small mobile) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400">
            <Search size={16} />
          </div>
          <input
            id="global-search-input"
            type="text"
            placeholder="Search..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value
              setSearchQuery(val)
              if (val.trim() || location.pathname === "/search") {
                navigate(`/search?q=${val}`, { replace: true })
              }
            }}
            onFocus={() => location.pathname !== "/search" && navigate("/search")}
          />
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          {/* MOBILE SEARCH ICON (Only visible when search bar is hidden) */}
          {/* <button
            onClick={() => navigate("/search")}
            className="md:hidden p-2 text-slate-300"
          >
            <Search size={18} />
          </button> */}

          {/* CREATE BUTTON - Icon only on mobile */}

          <motion.button
            onClick={() => setShowMenu(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="hidden md:flex btn-primary flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 rounded-xl text-sm min-w-[36px] sm:min-w-auto"
          >
            <Plus size={24} />
            <span className="hidden sm:inline">Create</span>
          </motion.button>
          <motion.button
            onClick={() => setShowMenu(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="md:hidden flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 rounded-xl text-sm min-w-[36px] sm:min-w-auto"
          >
            <Plus size={24} />
          </motion.button>

          {/* CHALLENGE BUTTON (Hidden on mobile) */}
          <motion.button
            onClick={() => {
              loadChallengePreview()
              setShowChallengeModal(true)
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="hidden md:inline-flex items-center gap-2 rounded-xl btn-secondary px-4 py-2 text-xs font-semibold transition"
          >
            Challenge
          </motion.button>

          {/* NOTIFICATION */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={buttonTap}
            onClick={() => navigate("/notifications")}
            className="p-1"
          >
            <Bell className="text-slate-300 icon-interactive" size={20} />
          </motion.button>

          {/* PROFILE */}
          <Link to="/profile" className="flex-shrink-0 group/avatar">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-white/10 group-hover/avatar:border-indigo-500 transition-colors"
                alt="Profile"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-500 text-white flex items-center justify-center rounded-full border border-indigo-300/30 font-bold text-xs sm:text-sm">
                {user?.name?.[0] || "A"}
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* CREATE MENU MODAL (No changes needed, already mobile friendly) */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-pro p-6 rounded-2xl w-[85%] max-w-[320px] text-white space-y-3 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h2 className="font-semibold text-lg text-center mb-4">Create New</h2>
              {["post", "project", "event", "opportunity"].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    setType(item)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition capitalize"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => setShowMenu(false)}
                className="w-full text-sm text-slate-400 pt-2"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL COMPONENTS */}
      {type === "post" && <CreatePostModal close={() => setType(null)} refreshFeed={() => window.dispatchEvent(new Event("global-refresh"))} />}
      {type === "project" && <CreateProjectModal close={() => setType(null)} refresh={() => window.dispatchEvent(new Event("global-refresh"))} />}
      {type === "event" && <CreateEventModal close={() => setType(null)} refresh={() => window.dispatchEvent(new Event("global-refresh"))} />}
      {type === "opportunity" && <CreateOpportunityModal close={() => setType(null)} refresh={() => window.dispatchEvent(new Event("global-refresh"))} />}

      <ChallengeModal
        open={showChallengeModal}
        close={() => setShowChallengeModal(false)}
        leaderboard={leaderboardPreview}
        challenge={challenge}
        onStart={() => {
          setShowChallengeModal(false)
          navigate("/challenge")
        }}
      />
    </>
  )
}