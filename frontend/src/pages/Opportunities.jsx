import { useEffect, useState } from "react"
import api from "../api/axios"
import CreateOpportunityModal from "../components/opportunity/CreateOpportunityModal"

export default function Opportunities() {

  const [opportunities,setOpportunities] = useState([])
  const [showModal,setShowModal] = useState(false)

  const loadOpportunities = async () => {
    try{
      const res = await api.get("/opportunities")
      setOpportunities(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    loadOpportunities()
  },[])

  const daysLeft = (deadline)=>{
    const diff = new Date(deadline) - new Date()
    const days = Math.ceil(diff / (1000*60*60*24))
    return days > 0 ? `${days} days left` : "Expired"
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🎒 Opportunities
          </h1>

          <p className="text-gray-400">
            Internships, hackathons, and projects
          </p>
        </div>

        <button
          onClick={()=>setShowModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          Post Opportunity
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-5">

        {opportunities.map(op => (

          <div
            key={op._id}
            className="glass p-6 rounded-2xl space-y-4 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition"
          >

            {/* TITLE */}
            <div>
              <h2 className="text-lg font-semibold text-white">
                {op.title}
              </h2>

              <p className="text-indigo-400 text-sm">
                {op.company}
              </p>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-300 text-sm leading-relaxed">
              {op.description}
            </p>

            {/* TAGS */}
            <div className="flex gap-2 flex-wrap">
              {op.tags?.map(tag=>(
                <span
                  key={tag}
                  className="bg-white/10 text-xs px-3 py-1 rounded-full text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* DEADLINE */}
            <div className="text-gray-400 text-sm">
              📅 {daysLeft(op.deadline)}
            </div>

            {/* APPLY */}
            <a
              href={op.registrationLink}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              Apply Now
            </a>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {showModal &&
        <CreateOpportunityModal
          close={()=>setShowModal(false)}
          refresh={loadOpportunities}
        />
      }

    </div>
  )
}