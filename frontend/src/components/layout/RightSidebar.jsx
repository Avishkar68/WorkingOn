import { useEffect, useState } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "../../lib/motion"

export default function RightSidebar() {

  const [events,setEvents] = useState([])
  const [opportunities,setOpportunities] = useState([])
  const [myCommunities,setMyCommunities] = useState([])

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

  const loadCommunities = async () => {
    try{
      const res = await api.get("/communities/user/me")
      setMyCommunities(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    loadData()
    loadCommunities()
  },[])

  return (
    <motion.div
      className="w-[280px] xl:w-[320px] p-3 sm:p-4 space-y-4 overflow-y-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >

      {/* 🔥 YOUR COMMUNITIES */}
      <motion.div className="card-hover glass rounded-2xl p-4" variants={fadeInUp}>
        <h3 className="font-semibold mb-3 text-white">
          Your Communities
        </h3>

        {myCommunities.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Join communities to see them here
          </p>
        ) : (
          myCommunities.map(c => (
            <div
              key={c._id}
              onClick={()=>navigate(`/community/${c._id}`)}
              className="cursor-pointer mb-2 hover:bg-white/10 p-2 rounded-lg transition"
            >
              <p className="text-sm text-white font-medium">
                {c.name}
              </p>
            </div>
          ))
        )}
      </motion.div>

      {/* EVENTS */}
      <motion.div className="card-hover glass rounded-2xl p-4" variants={fadeInUp}>
        <h3 className="font-semibold mb-3 text-white">Upcoming Events</h3>

        {events.length === 0 ? (
          <p className="text-gray-400 text-sm">No events</p>
        ) : (
          events.map(event => (
            <div
              key={event._id}
              onClick={()=>navigate(`/events/${event._id}`)}
              className="cursor-pointer mb-3 hover:bg-white/10 p-2 rounded-lg transition"
            >
              <p className="text-sm font-medium text-white line-clamp-1">
                {event.title}
              </p>
              <p className="text-xs text-gray-400 line-clamp-1">
                {event.location}
              </p>
            </div>
          ))
        )}
      </motion.div>

      {/* OPPORTUNITIES */}
      <motion.div className="card-hover glass rounded-2xl p-4" variants={fadeInUp}>
        <h3 className="font-semibold mb-3 text-white">Recent Opportunities</h3>

        {opportunities.length === 0 ? (
          <p className="text-gray-400 text-sm">No opportunities</p>
        ) : (
          opportunities.map(op => (
            <div
              key={op._id}
              onClick={()=>navigate(`/opportunities/${op._id}`)}
              className="cursor-pointer mb-3 hover:bg-white/10 p-2 rounded-lg transition"
            >
              <p className="text-sm font-medium text-white line-clamp-1">
                {op.title}
              </p>
              <p className="text-xs text-gray-400 line-clamp-1">
                {op.company}
              </p>
            </div>
          ))
        )}
      </motion.div>

    </motion.div>
  )
}