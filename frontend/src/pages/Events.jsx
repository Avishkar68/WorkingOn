import { useEffect, useState } from "react"
import api from "../api/axios"

import EventCard from "../components/events/EventCard"
import CreateEventModal from "../components/events/CreateEventModal"

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

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            📅 Upcoming Events
          </h1>

          <p className="text-gray-500">
            Workshops, hackathons, and meetups
          </p>

        </div>

        {/* CREATE EVENT BUTTON */}

        <button
          onClick={()=>setShowCreate(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg"
        >
          Create Event
        </button>

      </div>


      {/* EVENTS */}

      <div className="space-y-6">

        {events.map(event => (

          <EventCard
            key={event._id}
            event={event}
          />

        ))}

      </div>


      {showCreate &&
        <CreateEventModal
          close={()=>setShowCreate(false)}
          refresh={loadEvents}
        />
      }

    </div>

  )

}