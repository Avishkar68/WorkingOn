import { useState } from "react"
import { createPortal } from "react-dom"
import { X, Calendar, MapPin, Users as UsersIcon, Link as LinkIcon, Image as ImageIcon, Tag } from "lucide-react"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function CreateEventModal({ close, refresh }) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [registrationLink, setRegistrationLink] = useState("")
  const [file, setFile] = useState(null)
  const [eventType, setEventType] = useState("")
  const [loading, setLoading] = useState(false)

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
      toast.error("Please fill all required fields")
      return
    }

    if (!registrationLink) {
      toast.error("Please add registration link")
      return
    }

    const loadToast = toast.loading("Publishing event...")
    setLoading(true)
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

      toast.success("Event created successfully!", { id: loadToast })
      refresh()
      close()
    } catch (err) {
      console.error(err)
      toast.error("Failed to create event", { id: loadToast })
    } finally {
      setLoading(false)
    }
  }

  const eventTypes = ["workshop", "hackathon", "seminar", "competition"]

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="w-[540px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 text-white space-y-5
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_25px_rgba(99,102,241,0.15)] scrollbar-hide">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar size={20} className="text-indigo-400" /> Create Event
            </h2>
            <p className="text-sm text-zinc-400">
              Share events happening in your college
            </p>
          </div>

          <button
            onClick={close}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">
          <input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />

          <textarea
            placeholder="Describe the event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="input resize-none"
          />

          {/* EVENT TYPE */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white ml-1">Event Type</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setEventType(type)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition
                    ${eventType === type
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-lg"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* DATE + LOCATION */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white ml-1 flex items-center gap-1">
                <Calendar size={12} /> Date & Time
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white ml-1 flex items-center gap-1">
                <MapPin size={12} /> Location
              </label>
              <input
                placeholder="e.g. Auditorium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* CAPACITY + LINK */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white ml-1 flex items-center gap-1">
                <UsersIcon size={12} /> Capacity (Optional)
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 100"
                className="input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white ml-1 flex items-center gap-1">
                <LinkIcon size={12} /> Registration Link
              </label>
              <input
                placeholder="https://..."
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* IMAGE */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white ml-1 flex items-center gap-1">
              <ImageIcon size={12} /> Event Banner
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="input cursor-pointer file:bg-indigo-600 file:text-white file:px-3 file:py-1 file:rounded-lg file:border-none file:mr-3 file:text-[10px] file:font-bold file:uppercase file:hover:bg-indigo-500 transition"
            />
          </div>

          {/* TAGS */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white ml-1 flex items-center gap-1">
              <Tag size={12} /> Tags
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 input"
              />
              <button
                onClick={addTag}
                className="px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full text-xs border border-white/10 text-zinc-300">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="text-white hover:text-red-400">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button
            onClick={close}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={createEvent}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white 
            shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish "}
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}