import { useState, useEffect } from "react"
import { Bell, Command, Menu, Plus, Search } from "lucide-react"
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
    loadChallengePreview() // ✅ Fetch preview data on mount so it's ready

    const todayKey = new Date().toISOString().split("T")[0]
    const shownKey = `challengeModalShown:${todayKey}`

    if (!localStorage.getItem(shownKey)) {
      setShowChallengeModal(true)
      localStorage.setItem(shownKey, "true")
    }

    // Keyboard shortcut for search
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("global-search-input")?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Sync searchQuery with URL params
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
      <div className="sticky top-0 z-20 glass rounded-2xl px-4 sm:px-5 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">
          <Menu
            className="text-white cursor-pointer lg:hidden"
            onClick={openSidebar}
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-slate-400">Workspace</p>
            <h1 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* CENTER: SEARCH */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-400">
            <Search size={16} />
          </div>
          <input
            id="global-search-input"
            type="text"
            placeholder="Search users, posts..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value
              setSearchQuery(val)
              if (val.trim() || location.pathname === "/search") {
                navigate(`/search?q=${val}`, { replace: true })
              }
            }}
            onFocus={() => {
              if (location.pathname !== "/search") {
                navigate("/search")
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.target.blur()
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-medium text-slate-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/*<button className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:border-white/20">
            <Command size={14} />
            Search
          </button>*/}

          {/* CREATE BUTTON */}
          <motion.button
            onClick={() => setShowMenu(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="btn-primary inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm"
          >
            <Plus size={14} />
            Create
          </motion.button>

          <motion.button
            onClick={() => {
              loadChallengePreview() // ✅ Refresh data when manual button is clicked
              setShowChallengeModal(true)
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="hidden md:inline-flex items-center gap-2 rounded-xl btn-secondary px-4 py-2 text-xs font-semibold transition"
          >
            Challenge
          </motion.button>

          {/* NOTIFICATION */}
          <motion.div whileHover={{ scale: 1.06 }} whileTap={buttonTap}>
            <Bell
              className="cursor-pointer text-slate-300 icon-interactive"
              onClick={() => navigate("/notifications")}
            />
          </motion.div>

          {/* PROFILE */}
          <Link
            to="/profile"
            className="cursor-pointer group/avatar"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover/avatar:border-indigo-500 transition-colors"
                alt="Profile"
              />
            ) : (
              <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-full border border-indigo-300/30 group-hover/avatar:border-indigo-400 font-bold transition-colors">
                {user?.name?.[0] || "A"}
              </div>
            )}
          </Link>

        </div>
      </div>

      {/* CREATE MENU MODAL */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >

            {/* MODAL BOX */}
            <motion.div
              className="glass-pro p-6 rounded-2xl w-[90%] max-w-85 text-white space-y-3 shadow-2xl"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.24 }}
            >

              <h2 className="font-semibold text-lg text-center">Create</h2>

              {["post", "project", "event", "opportunity"].map(item => (
                <motion.button
                  key={item}
                  onClick={() => {
                    setType(item)
                    setShowMenu(false)
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={buttonTap}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl transition"
                >
                  Create {item}
                </motion.button>
              ))}

              <button
                onClick={() => setShowMenu(false)}
                className="w-full text-sm text-slate-400 mt-2"
              >
                Cancel
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
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