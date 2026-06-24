import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react"

export default function EventDetail(){

  const { id } = useParams()
  const [event,setEvent] = useState(null)

  useEffect(()=>{
    const loadEvent = async ()=>{
      try{
        const res = await api.get(`/events/${id}`)
        setEvent(res.data)
      }catch(err){
        console.error(err)
      }
    }

    loadEvent()
  },[id])

  if(!event){
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400">
        Loading event...
      </div>
    )
  }

  return(

    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* 🔥 EVENT CARD */}
      <div className="glass rounded-2xl p-6 space-y-5 border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]">

        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            {event.title}
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            Explore and participate in this event
          </p>
        </div>

        {/* META INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <div className="flex items-center gap-2 text-gray-300">
            <MapPin size={16} className="text-indigo-400"/>
            {event.location}
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={16} className="text-indigo-400"/>
            {new Date(event.date).toLocaleString()}
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Users size={16} className="text-indigo-400"/>
            Capacity: {event.capacity}
          </div>

        </div>

        {/* DESCRIPTION */}
        <div>
          <h3 className="text-white font-semibold mb-2">About Event</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2">
          {event.tags?.map(tag=>(
            <span
              key={tag}
              className="bg-white/10 text-xs px-3 py-1 rounded-full text-gray-300 hover:bg-indigo-500/20 transition"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* REGISTER BUTTON */}
        {event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            Register Now
            <ExternalLink size={16}/>
          </a>
        )}

      </div>

    </div>
  )
}