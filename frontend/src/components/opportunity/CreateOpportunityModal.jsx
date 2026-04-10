import { useState } from "react"
import { createPortal } from "react-dom"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function CreateOpportunityModal({ close, refresh }) {

  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [registrationLink, setRegistrationLink] = useState("")

  const addTag = () => {
    if (!tagInput.trim()) return
    setTags([...tags, tagInput])
    setTagInput("")
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const createOpportunity = async () => {
    if (!title || !company || !description || !deadline) {
      toast.error("Please fill all fields")
      return
    }

    if (!registrationLink) {
      toast.error("Please add application link")
      return
    }

    try {
      await api.post("/opportunities", {
        title,
        company,
        description,
        deadline,
        tags,
        type: "internship",
        stipend: "",
        duration: "",
        registrationLink
      })

      toast.success("Opportunity posted successfully!")
      refresh()
      close()

    } catch (err) {
      console.error(err)
      toast.error("Failed to post opportunity")
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-[520px] rounded-2xl p-6 text-white space-y-5 
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_25px_rgba(99,102,241,0.15)]">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-wide">
            🚀 Post Opportunity
          </h2>
          <button
            onClick={close}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* TITLE */}
        <input
          placeholder="Opportunity Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-200 placeholder-gray-500 
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
        />

        {/* COMPANY */}
        <input
          placeholder="Company / Organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-200 placeholder-gray-500 
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Describe the opportunity..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-500 
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
        />

        {/* DEADLINE */}
        <div>
          <label className="text-sm text-gray-400">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
          />
        </div>

        {/* LINK */}
        <input
          placeholder="Application Link"
          value={registrationLink}
          onChange={(e) => setRegistrationLink(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-200 placeholder-gray-500 
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
        />

        {/* TAGS */}
        <div className="space-y-2">

          <label className="text-sm text-gray-400">Tags</label>

          <div className="flex gap-2">
            <input
              placeholder="Add tag (React, AI...)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 placeholder-gray-500 
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
            />

            <button
              onClick={addTag}
              className="px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white 
              shadow-[0_0_10px_rgba(99,102,241,0.4)] transition"
            >
              Add
            </button>
          </div>

          {/* TAG CHIPS */}
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
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={createOpportunity}
            className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white 
            shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 transition"
          >
            Post 🚀
          </button>

        </div>

      </div>

    </div>,
    document.body
  )
}