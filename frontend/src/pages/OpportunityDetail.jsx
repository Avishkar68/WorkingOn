import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

export default function OpportunityDetail(){

  const { id } = useParams()
  const [op,setOp] = useState(null)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await api.get(`/opportunities/${id}`)
        setOp(res.data)
      }catch(err){
        console.error(err)
      }
    }

    load()
  },[id])

  if(!op){
    return <div className="text-gray-400">Loading...</div>
  }

  const daysLeft = (deadline)=>{
    const diff = new Date(deadline) - new Date()
    const days = Math.ceil(diff / (1000*60*60*24))
    return days > 0 ? `${days} days left` : "Expired"
  }

  return(
    <div className="max-w-3xl mx-auto p-6">

      <div className="glass p-6 rounded-2xl space-y-4">

        <h1 className="text-2xl font-bold text-white">
          {op.title}
        </h1>

        <p className="text-indigo-400">
          {op.company}
        </p>

        <p className="text-gray-300">
          {op.description}
        </p>

        <div className="text-sm text-gray-400 space-y-1">
          <p>💰 Stipend: {op.stipend}</p>
          <p>⏳ Duration: {op.duration}</p>
          <p>📅 {daysLeft(op.deadline)}</p>
        </div>

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap">
          {op.tags?.map(tag=>(
            <span
              key={tag}
              className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* APPLY */}
        <a
          href={op.registrationLink}
          target="_blank"
          rel="noreferrer"
          className="block text-center bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          Apply Now
        </a>

      </div>

    </div>
  )
}