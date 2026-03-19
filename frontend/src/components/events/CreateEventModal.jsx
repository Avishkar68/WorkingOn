import { useState } from "react"
import api from "../../api/axios"

export default function CreateEventModal({close,refresh}){

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [date,setDate] = useState("")
  const [location,setLocation] = useState("")
  const [eventType,setEventType] = useState("workshop")
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
        eventType,
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

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white w-[500px] rounded-xl p-6 space-y-4">

        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Create Event</h2>
          <button onClick={close}>✕</button>
        </div>

        <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          value={capacity}
          onChange={(e)=>setCapacity(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* 🔥 REGISTRATION LINK */}
        <input
          placeholder="Registration Link (Google Form / Website)"
          value={registrationLink}
          onChange={(e)=>setRegistrationLink(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* TAGS */}
        <div className="flex gap-2">
          <input
            placeholder="Add tag"
            value={tagInput}
            onChange={(e)=>setTagInput(e.target.value)}
            className="flex-1 border p-2 rounded"
          />

          <button
            onClick={addTag}
            className="bg-gray-200 px-3 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={createEvent}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create Event
          </button>
        </div>

      </div>

    </div>
  )
}