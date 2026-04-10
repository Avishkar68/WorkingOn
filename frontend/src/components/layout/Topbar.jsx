import { useState, useEffect } from "react"
import { Bell, Command, Menu, Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
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

  const [showMenu,setShowMenu] = useState(false)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [challenge, setChallenge] = useState(null)
  const [leaderboardPreview, setLeaderboardPreview] = useState([])
  const [type,setType] = useState(null)
  const [user,setUser] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  const titleMap = {
    "/": "Dashboard",
    "/projects": "Projects",
    "/events": "Events",
    "/opportunities": "Opportunities",
    "/explore": "Explore",
    "/search": "Search",
    "/leaderboard": "Leaderboard",
    "/challenge": "Challenge",
    "/notifications": "Notifications",
    "/settings": "Settings",
    "/profile": "Profile"
  }

  const currentTitle = titleMap[location.pathname] || "Workspace"

  const loadUser = async ()=>{
    try{
      const token = localStorage.getItem("token")
      if(!token) return

      const decoded = jwtDecode(token)
      const id = decoded.id || decoded._id

      const res = await api.get(`/users/${id}`)
      setUser(res.data)

    }catch(err){
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

  useEffect(()=>{
    loadUser()

    const todayKey = new Date().toISOString().split("T")[0]
    const shownKey = `challengeModalShown:${todayKey}`

    if (!localStorage.getItem(shownKey)) {
      loadChallengePreview()
      setShowChallengeModal(true)
      localStorage.setItem(shownKey, "true")
    }
  },[])

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

{/* RIGHT */}
<div className="flex items-center gap-3 sm:gap-4">
          {/*<button className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:border-white/20">
            <Command size={14} />
            Search
          </button>*/}

          {/* CREATE BUTTON */}
          <motion.button
            onClick={()=>setShowMenu(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            className="btn-primary inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm"
          >
            <Plus size={14} />
            Create
          </motion.button>

          <motion.button
            onClick={() => setShowChallengeModal(true)}
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
            onClick={()=>navigate("/notifications")}
          />
          </motion.div>

          {/* PROFILE */}
          <div
            onClick={()=>navigate("/profile")}
            className="cursor-pointer"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-full border border-indigo-300/30">
                {user?.name?.[0] || "A"}
              </div>
            )}
          </div>

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

            {["post","project","event","opportunity"].map(item=>(
              <motion.button
                key={item}
                onClick={()=>{
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
              onClick={()=>setShowMenu(false)}
              className="w-full text-sm text-slate-400 mt-2"
            >
              Cancel
            </button>

          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* MODALS */}
      {type === "post" && <CreatePostModal close={()=>setType(null)} refreshFeed={()=>window.dispatchEvent(new Event("global-refresh"))} />}
      {type === "project" && <CreateProjectModal close={()=>setType(null)} refresh={()=>window.dispatchEvent(new Event("global-refresh"))} />}
      {type === "event" && <CreateEventModal close={()=>setType(null)} refresh={()=>window.dispatchEvent(new Event("global-refresh"))} />}
      {type === "opportunity" && <CreateOpportunityModal close={()=>setType(null)} refresh={()=>window.dispatchEvent(new Event("global-refresh"))} />}
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