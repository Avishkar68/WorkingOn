// import { useState } from "react"
// import api from "../../api/axios"

// export default function CreateEventModal({close,refresh}){

//   const [title,setTitle] = useState("")
//   const [description,setDescription] = useState("")
//   const [date,setDate] = useState("")
//   const [location,setLocation] = useState("")
//   const [capacity,setCapacity] = useState(100)
//   const [tags,setTags] = useState([])
//   const [tagInput,setTagInput] = useState("")
//   const [registrationLink,setRegistrationLink] = useState("")
// const [file, setFile] = useState(null)
//   const addTag = ()=>{
//     if(!tagInput.trim()) return
//     setTags([...tags,tagInput])
//     setTagInput("")
//   }

//   // const createEvent = async ()=>{

//   //   if(!title || !description || !date || !location){
//   //     alert("Please fill all required fields")
//   //     return
//   //   }

//   //   if(!registrationLink){
//   //     alert("Please add registration link")
//   //     return
//   //   }

//   //   try{
//   //     await api.post("/events",{
//   //       title,
//   //       description,
//   //       date,
//   //       location,
//   //       capacity,
//   //       tags,
//   //       registrationLink
//   //     })

//   //     refresh()
//   //     close()

//   //   }catch(err){
//   //     console.error(err)
//   //   }
//   // }

//   const createEvent = async () => {

//   if(!title || !description || !date || !location){
//     alert("Please fill all required fields")
//     return
//   }

//   if(!registrationLink){
//     alert("Please add registration link")
//     return
//   }

//   try{

//     const formData = new FormData()

//     formData.append("title", title)
//     formData.append("description", description)
//     formData.append("date", date)
//     formData.append("location", location)
//     formData.append("capacity", capacity)
//     formData.append("registrationLink", registrationLink)

//     // tags as string
//     formData.append("tags", JSON.stringify(tags))

//     // image
//     if(file){
//       formData.append("image", file)
//     }

//     await api.post("/events", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data"
//       }
//     })

//     refresh()
//     close()

//   }catch(err){
//     console.error(err)
//   }
// }

//   return(

//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

//       <div className="glass w-[500px] rounded-2xl p-6 space-y-4 text-white">

//         <div className="flex justify-between">
//           <h2 className="text-lg font-semibold">Create Event</h2>
//           <button onClick={close} className="text-gray-400 hover:text-white">✕</button>
//         </div>

//         <input
//           placeholder="Title"
//           value={title}
//           onChange={(e)=>setTitle(e.target.value)}
//           className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
//         />

//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e)=>setDescription(e.target.value)}
//           className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
//         />

//         <input
//           type="datetime-local"
//           value={date}
//           onChange={(e)=>setDate(e.target.value)}
//           className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
//         />

//         <input
//           placeholder="Location"
//           value={location}
//           onChange={(e)=>setLocation(e.target.value)}
//           className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
//         />

//         <input
//           type="number"
//           value={capacity}
//           onChange={(e)=>setCapacity(e.target.value)}
//           className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
//         />

//         <input
//           placeholder="Registration Link"
//           value={registrationLink}
//           onChange={(e)=>setRegistrationLink(e.target.value)}
//           className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
//         />
// <input
//   type="file"
//   accept="image/*"
//   onChange={(e) => setFile(e.target.files[0])}
//   className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
// />
//         {/* TAGS */}
//         <div className="flex gap-2">
//           <input
//             placeholder="Add tag"
//             value={tagInput}
//             onChange={(e)=>setTagInput(e.target.value)}
//             className="flex-1 bg-white/5 border border-white/10 p-2 rounded text-gray-300"
//           />

//           <button
//             onClick={addTag}
//             className="bg-indigo-500 px-3 rounded text-white"
//           >
//             Add
//           </button>
//         </div>

//         <div className="flex gap-2 flex-wrap">
//           {tags.map(tag => (
//             <span key={tag} className="bg-white/10 px-3 py-1 rounded-full text-xs">
//               {tag}
//             </span>
//           ))}
//         </div>

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={close}
//             className="px-4 py-2 bg-white/10 rounded text-gray-300"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={createEvent}
//             className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow-[0_0_15px_rgba(99,102,241,0.4)]"
//           >
//             Create Event
//           </button>
//         </div>

//       </div>

//     </div>
//   )
// }

import { useState } from "react"
import api from "../../api/axios"

export default function CreateEventModal({ close, refresh }) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState(100)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [registrationLink, setRegistrationLink] = useState("")
  const [file, setFile] = useState(null)
  const [eventType, setEventType] = useState("")

  const addTag = () => {
    if (!tagInput.trim()) return
    setTags([...tags, tagInput])
    setTagInput("")
  }

  const removeTag = (t) => {
    setTags(tags.filter(tag => tag !== t))
  }

  const createEvent = async () => {

    if (!title || !description || !date || !location || !eventType) {
      alert("Please fill all required fields")
      return
    }

    if (!registrationLink) {
      alert("Please add registration link")
      return
    }

    try {

      const formData = new FormData()

      formData.append("title", title)
      formData.append("description", description)
      formData.append("date", date)
      formData.append("location", location)
      formData.append("capacity", capacity)
      formData.append("registrationLink", registrationLink)
      formData.append("eventType", eventType)
      formData.append("tags", JSON.stringify(tags))

      if (file) formData.append("image", file)

      await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      refresh()
      close()

    } catch (err) {
      console.error(err)
    }
  }

  const eventTypes = ["workshop", "hackathon", "seminar", "competition"]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-[540px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 text-white space-y-5
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_25px_rgba(99,102,241,0.15)]">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">📅 Create Event</h2>
            <p className="text-sm text-gray-400">
              Share events happening in your college
            </p>
          </div>

          <button
            onClick={close}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* TITLE */}
        <input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Describe the event..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="input"
        />

        {/* EVENT TYPE (BUTTONS 🔥) */}
        <div>
          <label className="text-sm text-gray-400">Event Type</label>

          <div className="flex gap-2 flex-wrap mt-2">
            {eventTypes.map(type => (
              <button
                key={type}
                onClick={() => setEventType(type)}
                className={`px-3 py-1 rounded-full text-xs border transition
                  ${eventType === type
                    ? "bg-indigo-500 text-white border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                    : "bg-white/10 text-gray-300 border-white/10 hover:bg-white/20"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* DATE + LOCATION */}
        <div className="grid grid-cols-2 gap-3">

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input"
          />

        </div>

        {/* CAPACITY */}
        <div>
          <label className="text-sm text-gray-400">Capacity</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="input mt-1"
          />
        </div>

        {/* LINK */}
        <input
          placeholder="Registration Link"
          value={registrationLink}
          onChange={(e) => setRegistrationLink(e.target.value)}
          className="input"
        />

        {/* IMAGE */}
        <div>
          <label className="text-sm text-gray-400">Event Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="input mt-1"
          />
        </div>

        {/* TAGS */}
        <div className="space-y-2">

          <label className="text-sm text-gray-400">Tags</label>

          <div className="flex gap-2">
            <input
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 input"
            />

            <button
              onClick={addTag}
              className="px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white 
              shadow-[0_0_10px_rgba(99,102,241,0.4)]"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs border border-white/10"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-gray-400 hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">

          <button
            onClick={close}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={createEvent}
            className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white 
            shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 transition"
          >
            Publish 🚀
          </button>

        </div>

      </div>
    </div>
  )
}