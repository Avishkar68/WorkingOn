import { useEffect, useState } from "react"
import api from "../api/axios"
import { motion } from "framer-motion"
import { staggerContainer } from "../lib/motion"

import EventCard from "../components/events/EventCard"
import CreateEventModal from "../components/events/CreateEventModal"
import PageShell from "../components/layout/PageShell"
import Skeleton from "../components/ui/Skeleton"

export default function Events(){

  const [events,setEvents] = useState([])
  const [showCreate,setShowCreate] = useState(false)
  const [loading,setLoading] = useState(true)

  const loadEvents = async ()=>{
    try{
      const res = await api.get("/events")
      setEvents(res.data)
    }catch(err){
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(()=>{
    loadEvents()
    window.addEventListener("global-refresh", loadEvents)
    return () => window.removeEventListener("global-refresh", loadEvents)
  },[])

  return(

    <PageShell
      eyebrow="Calendar"
      title="Events"
      subtitle="Discover workshops, competitions, and meetups across your network."
      actions={
        <button
          onClick={()=>setShowCreate(true)}
          className="btn-primary text-sm font-medium px-4 py-2 rounded-xl"
        >
          Create Event
        </button>
      }
    >

      {/* EVENTS */}
      <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">

        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
              <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <Skeleton className="w-1/2 h-6" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <div className="flex gap-4 mt-4">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            No events found
          </div>
        ) : (
          events.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        )}

      </motion.div>

      {showCreate &&
        <CreateEventModal
          close={()=>setShowCreate(false)}
          refresh={loadEvents}
        />
      }

    </PageShell>

  )
}