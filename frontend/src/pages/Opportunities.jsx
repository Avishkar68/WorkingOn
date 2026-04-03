import { useEffect, useState } from "react"
import api from "../api/axios"
import { jwtDecode } from "jwt-decode"
import CreateOpportunityModal from "../components/opportunity/CreateOpportunityModal"

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
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h1 className="text-2xl font-bold text-white">
            🎒 Opportunities
          </h1>
          <p className="text-gray-400">
            Internships, hackathons, and projects
          </p>
        </div>

        <button
          onClick={()=>setShowModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          Post Opportunity
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-3">

        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="flex-1 bg-white/10 text-white px-4 py-2 rounded-xl outline-none"
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
  className="bg-zinc-900 text-white border border-zinc-700 
             px-4 py-2 rounded-xl outline-none 
             focus:ring-2 focus:ring-blue-500 
             hover:bg-zinc-800 transition-all duration-200"
>
  <option value="all" className="input text-white">Filters</option>
  <option value="best" className="bg-zinc-900 text-white">⭐ Best For Me</option>
  <option value="student" className="bg-zinc-900 text-white">Student Posts</option>
  <option value="external" className="bg-zinc-900 text-white">External</option>
</select>

      </div>

      {/* LIST */}
      <div className="space-y-5">

        {filtered.map(op => {

          const isUserPost =
            op.postedBy?._id !== EXTERNAL_USER_ID

          return (
            <div
              key={op._id}
              className={`relative p-6 rounded-2xl space-y-4 transition overflow-hidden
              ${
                isUserPost
                  ? "glass border border-yellow-400/30 shadow-[0_8px_25px_rgba(255,215,0,0.15)] hover:shadow-[0_10px_30px_rgba(255,215,0,0.25)]"
                  : "glass hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]"
              }`}
            >

              {/* BADGES */}
              <div className="flex gap-2 flex-wrap relative z-10">

                {isUserPost ? (
                  <span className="text-xs bg-yellow-400/10 text-yellow-300 px-2 py-1 rounded-full font-medium">
                    ⭐ Student
                  </span>
                ) : (
                  <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                    🌐 External
                  </span>
                )}

                {filter === "best" && op.score > 0 && (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                    🔥 {op.score} Match
                  </span>
                )}

              </div>

              {/* TITLE */}
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-white">
                  {op.title}
                </h2>
                <p className="text-indigo-400 text-sm">
                  {op.company}
                </p>
              </div>

              {/* DESC */}
              <p className="relative z-10 text-gray-300 text-sm">
                {op.description}
              </p>

              {/* TAGS */}
              <div className="flex gap-2 flex-wrap relative z-10">
                {op.tags?.map(tag=>(
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* INFO */}
              <div className="flex gap-4 text-sm flex-wrap relative z-10 text-gray-400">
                {op.stipend && <span>💰 {op.stipend}</span>}
                {op.duration && <span>⏳ {op.duration}</span>}
                <span>📅 {daysLeft(op.deadline)}</span>
              </div>

              {/* APPLY */}
              <a
                href={op.registrationLink || op.link}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 block text-center py-3 rounded-xl font-semibold transition bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                Apply Now
              </a>

            </div>
          )
        })}

      </div>

      {/* MODAL */}
      {showModal &&
        <CreateOpportunityModal
          close={()=>setShowModal(false)}
          refresh={loadData}
        />
      }

    </div>
  )
}