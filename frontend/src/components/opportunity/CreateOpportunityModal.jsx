import { useState } from "react"
import { createPortal } from "react-dom"
import { X, Briefcase, Building2, Calendar, Link as LinkIcon, Tag } from "lucide-react"
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
  const [loading, setLoading] = useState(false)

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
      toast.error("Please fill all required fields")
      return
    }

    if (!registrationLink) {
      toast.error("Please add application link")
      return
    }

    const loadToast = toast.loading("Posting opportunity...")
    setLoading(true)
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

      toast.success("Opportunity posted successfully!", { id: loadToast })
      refresh()
      close()
    } catch (err) {
      console.error(err)
      toast.error("Failed to post opportunity", { id: loadToast })
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      <div className="w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 text-white space-y-5
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_25px_rgba(99,102,241,0.15)] scrollbar-hide">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-400" /> Post Opportunity
            </h2>
            <p className="text-sm text-zinc-400">
              Share internships, jobs, and openings 🚀
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
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Opportunity Title
            </label>
            <input
              placeholder="e.g. Software Engineer Intern"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1">
              <Building2 size={12} /> Company / Organization
            </label>
            <input
              placeholder="e.g. Google, Microsoft, Startup X"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Description
            </label>
            <textarea
              placeholder="Describe the role, requirements, and perks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1">
                <Calendar size={12} /> Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1">
                <LinkIcon size={12} /> Application Link
              </label>
              <input
                placeholder="https://..."
                value={registrationLink}
                onChange={(e) => setRegistrationLink(e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* TAGS */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1">
              <Tag size={12} /> Tags
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Add tag (React, AI...)"
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
                  <button onClick={() => removeTag(tag)} className="text-zinc-500 hover:text-red-400">
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
            onClick={createOpportunity}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white 
            shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post 🚀"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}