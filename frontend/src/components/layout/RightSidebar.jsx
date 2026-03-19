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

      // get latest 3
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

      {/* TRENDING */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Trending Tags</h3>

        <div className="flex flex-wrap gap-2">
          {["React","Internship","Hackathon","DevOps","DataScience"].map(tag => (
            <span key={tag} className="bg-gray-100 text-xs px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* EVENTS */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Upcoming Events</h3>

        {events.length === 0 ? (
          <p className="text-sm text-gray-500">No events</p>
        ) : (
          events.map(event => (
            <div
              key={event._id}
              onClick={()=>navigate(`/events/${event._id}`)}
              className="cursor-pointer mb-3 hover:bg-gray-50 p-2 rounded"
            >
              <p className="text-sm font-medium">
                {event.title}
              </p>

              <p className="text-xs text-gray-500">
                {event.location}
              </p>
            </div>
          ))
        )}

      </div>

      {/* 🔥 OPPORTUNITIES */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Recent Opportunities</h3>

        {opportunities.length === 0 ? (
          <p className="text-sm text-gray-500">No opportunities</p>
        ) : (
          opportunities.map(op => (
            <div
              key={op._id}
              onClick={()=>navigate(`/opportunities/${op._id}`)}
              className="cursor-pointer mb-3 hover:bg-gray-50 p-2 rounded"
            >
              <p className="text-sm font-medium">
                {op.title}
              </p>

              <p className="text-xs text-gray-500">
                {op.company}
              </p>
            </div>
          ))
        )}

      </div>

    </div>
  )
}