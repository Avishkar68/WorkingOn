import { useState } from "react"
import { createPortal } from "react-dom"
import { X, Image as ImageIcon, Hash } from "lucide-react"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function CreatePostModal({ close, refreshFeed, communityId }) {

  const [content, setContent] = useState("")
  const [file, setFile] = useState(null)
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)

  const submitPost = async () => {
    if (!content.trim()) return

    const loadToast = toast.loading("Publishing post...")
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("content", content)
      formData.append("tags", tags)
      formData.append("image", file)
      formData.append("isAnonymous", false)

      if (communityId && communityId !== "normal") {
        formData.append("communityId", communityId)
      }

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      toast.success("Post published successfully!", { id: loadToast })
      refreshFeed()
      close()

    } catch (err) {
      console.error(err)
      toast.error("Failed to publish post", { id: loadToast })
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
              Create a Post
            </h2>
            <p className="text-sm text-zinc-400">
              Share your thoughts with the campus 
            </p>
          </div>

          <button
            onClick={close}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* TEXTAREA */}
        <div className="space-y-2">
           <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1.5">
            Content
          </label>
          <textarea
            placeholder="What's on your mind?"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input resize-none min-h-[120px]"
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1.5">
            <ImageIcon size={14} /> Add Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="input cursor-pointer file:bg-indigo-500 file:text-white file:px-3 file:py-1 file:rounded-lg file:border-none file:mr-3 file:text-xs file:font-bold file:uppercase file:hover:bg-indigo-400 Transition"
          />

          {file && (
            <div className="relative group rounded-xl overflow-hidden border border-white/10 mt-2">
               <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full max-h-40 object-cover"
              />
              <button 
                onClick={() => setFile(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* TAGS */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-1.5">
            <Hash size={14} /> Tags
          </label>

          <input
            placeholder="React, Node, AI"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input"
          />

          <div className="flex flex-wrap gap-2">
            {tags.split(",").map(tag => tag.trim()).filter(Boolean).map(tag => (
              <span
                key={tag}
                className="bg-white/10 text-zinc-300 px-3 py-1 rounded-full text-xs border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={close}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={submitPost}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white 
            shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post "}
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}