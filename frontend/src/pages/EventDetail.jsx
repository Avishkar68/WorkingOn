import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

export default function EventDetail(){

  const { id } = useParams()
  const [event,setEvent] = useState(null)

  const loadEvent = async ()=>{
    try{
      const res = await api.get(`/events/${id}`)
      setEvent(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    loadEvent()
  },[])

  if(!event) return <div>Loading...</div>

  return(

    <div className="max-w-3xl mx-auto p-6">

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <h1 className="text-2xl font-bold">
          {event.title}
        </h1>

        <p className="text-gray-600">
          {event.description}
        </p>

        <div className="text-sm text-gray-500 space-y-1">
          <p>📍 {event.location}</p>
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>👥 Capacity: {event.capacity}</p>
        </div>

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap">
          {event.tags?.map(tag=>(
            <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* REGISTER */}
        {event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noreferrer"
            className="block text-center bg-indigo-600 text-white py-3 rounded-lg"
          >
            Register Now
          </a>
        )}

      </div>

    </div>
  )
}