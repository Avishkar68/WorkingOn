import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"

export default function RightSidebar() {

  const [events,setEvents] = useState([])
  const [opportunities,setOpportunities] = useState([])

  const navigate = useNavigate()

  const loadData = async ()=>{
    try{
      const [eRes,oRes] = await Promise.all([
        api.get("/events"),
        api.get("/opportunities")
      ])

      setEvents(eRes.data.slice(0,3))
      setOpportunities(oRes.data.slice(0,3))

    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    loadData()
  },[])

  return (
    <div className="w-[320px] p-4 space-y-4 hidden lg:block overflow-y-auto">

      {/* TAGS */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-semibold mb-3 text-white">Trending Tags</h3>

        <div className="flex flex-wrap gap-2">
          {["React","Internship","Hackathon","DevOps","DataScience"].map(tag => (
            <span key={tag} className="bg-white/10 text-xs px-3 py-1 rounded-full text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* EVENTS */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-semibold mb-3 text-white">Upcoming Events</h3>

        {events.map(event => (
          <div
            key={event._id}
            onClick={()=>navigate(`/events/${event._id}`)}
            className="cursor-pointer mb-3 hover:bg-white/10 p-2 rounded-lg"
          >
            <p className="text-sm font-medium text-white">{event.title}</p>
            <p className="text-xs text-gray-400">{event.location}</p>
          </div>
        ))}
      </div>

      {/* OPPORTUNITIES */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-semibold mb-3 text-white">Recent Opportunities</h3>

        {opportunities.map(op => (
          <div
            key={op._id}
            onClick={()=>navigate(`/opportunities/${op._id}`)}
            className="cursor-pointer mb-3 hover:bg-white/10 p-2 rounded-lg"
          >
            <p className="text-sm font-medium text-white">{op.title}</p>
            <p className="text-xs text-gray-400">{op.company}</p>
          </div>
        ))}
      </div>

    </div>
  )
}