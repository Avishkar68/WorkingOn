import { useEffect, useState } from "react"
import api from "../api/axios"
import { motion } from "framer-motion"
import { staggerContainer } from "../lib/motion"

import EventCard from "../components/events/EventCard"
import CreateEventModal from "../components/events/CreateEventModal"
import PageShell from "../components/layout/PageShell"

export default function Events(){

  const [events,setEvents] = useState([])
  const [showCreate,setShowCreate] = useState(false)

  const loadEvents = async ()=>{
    try{
      const res = await api.get("/events")
      setEvents(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    loadEvents()
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

        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}

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