import { useEffect, useState } from "react"
import api from "../api/axios"
import { jwtDecode } from "jwt-decode"
import CreateOpportunityModal from "../components/opportunity/CreateOpportunityModal"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "../lib/motion"
import PageShell from "../components/layout/PageShell"
import Skeleton from "../components/ui/Skeleton"
import { CalendarDays, Hourglass, Share2 } from "lucide-react";
import toast from "react-hot-toast";

const EXTERNAL_USER_ID = "000000000000000000000001"

const normalize = (text) => text?.toLowerCase().trim()

const skillMap = {
  react: ["react", "reactjs", "react.js"],
  javascript: ["js", "javascript", "node", "nodejs"],
  python: ["python", "django", "flask"],
  ai: ["ai", "artificial intelligence"],
  ml: ["ml", "machine learning"],
  frontend: ["frontend", "html", "css", "react"],
  backend: ["backend", "node", "express"],
  data: ["data", "data science", "analytics"],
}

const matchScore = (userSkills, tags) => {
  let score = 0
  const normalizedUserSkills = userSkills.map(normalize)
  const normalizedTags = tags.map(normalize)

  normalizedTags.forEach(tag => {
    normalizedUserSkills.forEach(skill => {
      if (tag === skill) score += 3
      else if (tag.includes(skill) || skill.includes(tag)) score += 2
      Object.values(skillMap).forEach(group => {
        if (group.includes(skill) && group.includes(tag)) score += 2
      })
    })
  })
  return score
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [filtered, setFiltered] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token")
      let skills = []
      if (token) {
        const decoded = jwtDecode(token)
        const id = decoded.id || decoded._id
        const userRes = await api.get(`/users/${id}`)
        skills = userRes.data.skills || []
        setUserSkills(skills.map(s => normalize(s)))
      }
      const res = await api.get("/opportunities")
      setOpportunities(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    window.addEventListener("global-refresh", loadData)
    return () => window.removeEventListener("global-refresh", loadData)
  }, [])

  const daysLeft = (deadline) => {
    if (!deadline) return "No deadline"
    const diff = new Date(deadline) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days left` : "Expired"
  }

  const handleShare = async (opId) => {
    const url = `${window.location.origin}/opportunities/${opId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  useEffect(() => {
    let data = [...opportunities]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(op =>
        op.title.toLowerCase().includes(q) ||
        op.company?.toLowerCase().includes(q) ||
        op.tags?.some(tag => tag.toLowerCase().includes(q))
      )
    }
    if (filter === "external") {
      data = data.filter(op => !op.postedBy || (op.postedBy?._id || op.postedBy) === EXTERNAL_USER_ID)
    }
    if (filter === "student") {
      data = data.filter(op => op.postedBy && (op.postedBy?._id || op.postedBy) !== EXTERNAL_USER_ID)
    }
    if (filter === "best") {
      data = data
        .map(op => ({ ...op, score: matchScore(userSkills, op.tags || []) }))
        .filter(op => op.score > 0)
        .sort((a, b) => b.score - a.score)
    }
    setFiltered(data)
  }, [search, filter, opportunities, userSkills])

  return (
    <PageShell
      eyebrow="Discover"
      title="Opportunities"
      subtitle="Find internships, external roles, and student-shared openings."
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary w-full md:w-auto px-4 py-2 rounded-xl text-sm font-medium"
        >
          Post Opportunity
        </button>
      }
    >

      {/* SEARCH + FILTER - Stack on mobile, side-by-side on desktop */}
      <div className="glass p-3 md:p-4 rounded-2xl flex flex-col md:flex-row gap-3 border border-white/10">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 w-full"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input w-full md:max-w-[220px]"
        >
          <option value="all">Filters</option>
          <option value="best">Best For Me</option>
          <option value="student">College Posts</option>
          <option value="external">External</option>
        </select>
      </div>

      {/* LIST */}
      <motion.div
        className="grid grid-cols-1 gap-4 mt-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 flex flex-col gap-4">
              <div className="flex gap-2"><Skeleton className="w-20 h-6 rounded-full" /><Skeleton className="w-24 h-6 rounded-full" /></div>
              <div className="space-y-2"><Skeleton className="w-1/3 h-6" /><Skeleton className="w-1/4 h-4" /></div>
              <Skeleton className="w-full h-16" />
              <div className="flex gap-4"><Skeleton className="w-20 h-4" /><Skeleton className="w-24 h-4" /></div>
              <Skeleton className="w-full h-12 rounded-xl mt-2" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-10">No opportunities found</div>
        ) : filtered.map(op => {
          const isExternal = !op.postedBy || (op.postedBy?._id || op.postedBy) === EXTERNAL_USER_ID
          const isUserPost = !isExternal

          return (
            <motion.div
              key={op._id}
              variants={fadeInUp}
              className={`relative p-4 md:p-6 glass-card space-y-4 overflow-hidden
                ${isUserPost ? "border-amber-300/30 shadow-[inset_0_0_15px_rgba(251,191,36,0.05)]" : ""}`}
            >
              {/* BADGES */}
              <div className="flex gap-2 flex-wrap relative z-10">
                {isUserPost ? (
                  <span className="pill-badge bg-amber-400/10 text-amber-400 border-amber-500/20">⭐ College</span>
                ) : (
                  <span className="pill-badge">🌐 External</span>
                )}
                {filter === "best" && op.score > 0 && (
                  <span className="pill-badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20">🔥 {op.score} Match</span>
                )}
              </div>

              {/* TITLE */}
              <div className="relative z-10">
                <h2 className="text-base md:text-lg font-semibold text-slate-100 break-words">
                  {op.title}
                </h2>
                <p className="text-indigo-300 text-xs md:text-sm">{op.company}</p>
              </div>

              {/* DESC */}
              <p className="relative z-10 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 md:line-clamp-none">
                {op.description}
              </p>

              {/* TAGS */}
              <div className="flex gap-2 flex-wrap relative z-10">
                {op.tags?.flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean).map(tag => (
                  <span key={tag} className="pill-badge text-[10px] md:text-xs">#{tag}</span>
                ))}
              </div>

              {/* INFO */}
              <div className="flex gap-3 md:gap-4 text-xs md:text-sm flex-wrap relative z-10 text-slate-400">
                {op.stipend && <span className="flex items-center gap-1">{op.stipend}</span>}
                {op.duration && (
                  <span className="flex items-center gap-1">
                    <Hourglass size={14} className="text-yellow-400" /> {op.duration}
                  </span>
                )}
                <span className="flex gap-2 items-center">
                  <CalendarDays size={14} className="text-[#2DD4BF]" /> {daysLeft(op.deadline)}
                </span>
              </div>

              {/* APPLY & SHARE */}
              <div className="flex gap-3 relative z-10 pt-2">
                <a
                  href={op.registrationLink || op.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 block text-center py-2.5 md:py-3 rounded-xl text-sm font-medium btn-primary transition-all active:scale-[0.98]"
                >
                  Apply Now
                </a>
                <button
                  onClick={() => handleShare(op._id)}
                  className="p-2.5 md:p-3 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center shrink-0"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {showModal && <CreateOpportunityModal close={() => setShowModal(false)} refresh={loadData} />}
    </PageShell>
  )
}