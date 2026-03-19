import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

export default function OpportunityDetail(){

  const { id } = useParams()
  const [op,setOp] = useState(null)

  const load = async ()=>{
    try{
      const res = await api.get(`/opportunities/${id}`)
      setOp(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    load()
  },[])

  if(!op) return <div>Loading...</div>

  const daysLeft = (deadline)=>{
    const diff = new Date(deadline) - new Date()
    const days = Math.ceil(diff / (1000*60*60*24))
    return days > 0 ? `${days} days left` : "Expired"
  }

  return(

    <div className="max-w-3xl mx-auto p-6">

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <h1 className="text-2xl font-bold">
          {op.title}
        </h1>

        <p className="text-indigo-600">
          {op.company}
        </p>

        <p className="text-gray-600">
          {op.description}
        </p>

        <div className="text-sm text-gray-500 space-y-1">
          <p>💰 Stipend: {op.stipend}</p>
          <p>⏳ Duration: {op.duration}</p>
          <p>📅 {daysLeft(op.deadline)}</p>
        </div>

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap">
          {op.tags?.map(tag=>(
            <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* APPLY */}
        <a
          href={op.registrationLink}
          target="_blank"
          rel="noreferrer"
          className="block text-center bg-indigo-600 text-white py-3 rounded-lg"
        >
          Apply Now
        </a>

      </div>

    </div>
  )
}