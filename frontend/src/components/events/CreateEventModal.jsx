import { useState } from "react"
import api from "../../api/axios"

export default function CreateEventModal({close,refresh}){

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [date,setDate] = useState("")
  const [location,setLocation] = useState("")
  const [capacity,setCapacity] = useState(100)
  const [tags,setTags] = useState([])
  const [tagInput,setTagInput] = useState("")
  const [registrationLink,setRegistrationLink] = useState("")

  const addTag = ()=>{
    if(!tagInput.trim()) return
    setTags([...tags,tagInput])
    setTagInput("")
  }

  const createEvent = async ()=>{

    if(!title || !description || !date || !location){
      alert("Please fill all required fields")
      return
    }

    if(!registrationLink){
      alert("Please add registration link")
      return
    }

    try{
      await api.post("/events",{
        title,
        description,
        date,
        location,
        capacity,
        tags,
        registrationLink
      })

      refresh()
      close()

    }catch(err){
      console.error(err)
    }
  }

  return(

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="glass w-[500px] rounded-2xl p-6 space-y-4 text-white">

        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Create Event</h2>
          <button onClick={close} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        <input
          type="number"
          value={capacity}
          onChange={(e)=>setCapacity(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        <input
          placeholder="Registration Link"
          value={registrationLink}
          onChange={(e)=>setRegistrationLink(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        {/* TAGS */}
        <div className="flex gap-2">
          <input
            placeholder="Add tag"
            value={tagInput}
            onChange={(e)=>setTagInput(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 p-2 rounded text-gray-300"
          />

          <button
            onClick={addTag}
            className="bg-indigo-500 px-3 rounded text-white"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <span key={tag} className="bg-white/10 px-3 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="px-4 py-2 bg-white/10 rounded text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={createEvent}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            Create Event
          </button>
        </div>

      </div>

    </div>
  )
}