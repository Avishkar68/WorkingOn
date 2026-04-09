import { useEffect, useState } from "react"
import api from "../api/axios"
import { jwtDecode } from "jwt-decode"
import CreateOpportunityModal from "../components/opportunity/CreateOpportunityModal"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "../lib/motion"
import PageShell from "../components/layout/PageShell"
import { CalendarDays, IndianRupee, Hourglass } from "lucide-react";

const EXTERNAL_USER_ID = "000000000000000000000001"

// 🔥 NORMALIZER
const normalize = (text) => text?.toLowerCase().trim()

// 🔥 SKILL SYNONYMS MAP
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

// 🔥 MATCHING FUNCTION
const matchScore = (userSkills, tags) => {
  let score = 0

  const normalizedUserSkills = userSkills.map(normalize)
  const normalizedTags = tags.map(normalize)

  normalizedTags.forEach(tag => {
    normalizedUserSkills.forEach(skill => {

      if (tag === skill) score += 3
      else if (tag.includes(skill) || skill.includes(tag)) score += 2

      Object.values(skillMap).forEach(group => {
        if (group.includes(skill) && group.includes(tag)) {
          score += 2
        }
      })

    })
  })

  return score
}

export default function Opportunities() {

  const [opportunities,setOpportunities] = useState([])
  const [filtered,setFiltered] = useState([])
  const [userSkills,setUserSkills] = useState([])

  const [search,setSearch] = useState("")
  const [filter,setFilter] = useState("all")

  const [showModal,setShowModal] = useState(false)

  const loadData = async () => {
    try{
      const token = localStorage.getItem("token")
      let skills = []

      if(token){
        const decoded = jwtDecode(token)
        const id = decoded.id || decoded._id
        const userRes = await api.get(`/users/${id}`)
        skills = userRes.data.skills || []
        setUserSkills(skills.map(s => normalize(s)))
      }

      const res = await api.get("/opportunities")
      setOpportunities(res.data)

    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    loadData()
  },[])

  const daysLeft = (deadline)=>{
    if(!deadline) return "No deadline"
    const diff = new Date(deadline) - new Date()
    const days = Math.ceil(diff / (1000*60*60*24))
    return days > 0 ? `${days} days left` : "Expired"
  }

  useEffect(()=>{

    let data = [...opportunities]

    // 🔍 SEARCH
    if(search){
      const q = search.toLowerCase()
      data = data.filter(op =>
        op.title.toLowerCase().includes(q) ||
        op.company?.toLowerCase().includes(q) ||
        op.tags?.some(tag => tag.toLowerCase().includes(q))
      )
    }

    // 🎯 FILTERS
    if(filter === "external"){
      data = data.filter(op => op.postedBy?._id === EXTERNAL_USER_ID)
    }

    if(filter === "student"){
      data = data.filter(op => op.postedBy?._id !== EXTERNAL_USER_ID)
    }

    // ⭐ BEST FOR ME
    if(filter === "best"){
      data = data
        .map(op => {
          const score = matchScore(userSkills, op.tags || [])
          return { ...op, score }
        })
        .filter(op => op.score > 0)
        .sort((a,b)=> b.score - a.score)
    }

    setFiltered(data)

  },[search,filter,opportunities,userSkills])

  return (
    <PageShell
      eyebrow="Discover"
      title="Opportunities"
      subtitle="Find internships, external roles, and student-shared openings."
      actions={
        <button
          onClick={()=>setShowModal(true)}
          className="btn-primary px-4 py-2 rounded-xl text-sm font-medium"
        >
          Post Opportunity
        </button>
      }
    >

      {/* SEARCH + FILTER */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-3 border border-white/10">

        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="input flex-1"
        />

        {/* <select
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
          className="bg-white/10 text-white px-4 py-2 rounded-xl outline-none"
        >
          <option value="all">Filters</option>
          <option value="best">⭐ Best For Me</option>
          <option value="student">Student Posts</option>
          <option value="external">External</option>
        </select> */}

        <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="input max-w-[220px]"
>
  <option value="all">Filters</option>
  <option value="best">Best For Me</option>
  <option value="student">Student Posts</option>
  <option value="external">External</option>
</select>

      </div>

      {/* LIST */}
      <motion.div
        className="grid grid-cols-1 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >

        {filtered.map(op => {

          const isUserPost =
            op.postedBy?._id !== EXTERNAL_USER_ID

          return (
            <motion.div
              key={op._id}
              variants={fadeInUp}
              className={`relative p-6 glass-card space-y-4 overflow-hidden
                ${
                  isUserPost
                    ? "border-amber-300/30 hover:border-amber-400/50 shadow-[inset_0_0_15px_rgba(251,191,36,0.05)]"
                    : ""
                }`}
            >

              {/* BADGES */}
              <div className="flex gap-2 flex-wrap relative z-10">

                {isUserPost ? (
                  <span className="pill-badge bg-amber-400/10 text-amber-400 border-amber-500/20">
                    ⭐ Student
                  </span>
                ) : (
                  <span className="pill-badge">
                    🌐 External
                  </span>
                )}

                {filter === "best" && op.score > 0 && (
                  <span className="pill-badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    🔥 {op.score} Match
                  </span>
                )}

              </div>

              {/* TITLE */}
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-slate-100">
                  {op.title}
                </h2>
                <p className="text-indigo-300 text-sm">
                  {op.company}
                </p>
              </div>

              {/* DESC */}
              <p className="relative z-10 text-slate-300 text-sm leading-relaxed">
                {op.description}
              </p>

              {/* TAGS */}
              <div className="flex gap-2 flex-wrap relative z-10">
                {op.tags?.map(tag=>(
                  <span
                    key={tag}
                    className="pill-badge "
                          style={{ backgroundColor: "#2DD4BF10", color: "#2DD4BF" }}

                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* INFO */}
             <div className="flex gap-4 text-sm flex-wrap relative z-10 text-slate-400">
  
  {op.stipend && (
    <span className="flex items-center gap-1">
      {op.stipend}
    </span>
  )}

  {op.duration && (
    <span className="flex items-center gap-1">
      <Hourglass size={14} className="text-yellow-400" />
      {op.duration}
    </span>
  )}

  <span className="flex gap-2 items-center">
    <CalendarDays size={16} className="text-[#2DD4BF]" />
    {daysLeft(op.deadline)}
  </span>

</div>

              {/* APPLY */}
              <a
                href={op.registrationLink || op.link}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 block text-center py-3 rounded-xl text-sm font-medium btn-primary"
              >
                Apply Now
              </a>

            </motion.div>
          )
        })}

      </motion.div>

      {/* MODAL */}
      {showModal &&
        <CreateOpportunityModal
          close={()=>setShowModal(false)}
          refresh={loadData}
        />
      }

    </PageShell>
  )
}