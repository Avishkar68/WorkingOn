import { useState } from "react"
import api from "../../api/axios"

export default function CreatePostModal({ close, refreshFeed }) {

  const [content, setContent] = useState("")
  const [file, setFile] = useState(null)
  const [tags, setTags] = useState("")

  const submitPost = async () => {
    try {
      const formData = new FormData()

      formData.append("content", content)
      formData.append("tags", tags)
      formData.append("image", file)
      formData.append("isAnonymous", false)

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      refreshFeed()
      close()

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

      {/* GLASS MODAL */}
      <div className="w-[500px] rounded-2xl p-6 text-white space-y-5 
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_25px_rgba(99,102,241,0.15)]">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-wide">
            Create a Post
          </h2>
          <button
            onClick={close}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* TEXTAREA */}
        <textarea
          placeholder="What's on your mind?"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none text-gray-200 placeholder-gray-500 
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
        />

        {/* FILE UPLOAD */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Add Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-2 text-gray-300 
            file:bg-indigo-500 file:text-white file:px-4 file:py-1 file:rounded-lg file:border-none file:cursor-pointer"
          />

          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="rounded-xl mt-2 max-h-40 object-cover border border-white/10"
            />
          )}
        </div>

        {/* TAGS */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Tags</label>

          <input
            placeholder="React, Node, AI"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none text-gray-300 placeholder-gray-500 
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
          />

          {/* TAG CHIPS */}
          <div className="flex flex-wrap gap-2">
            {tags.split(",").map(tag => tag.trim()).filter(Boolean).map(tag => (
              <span
                key={tag}
                className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs border border-white/10"
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
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={submitPost}
            className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white 
            shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 transition"
          >
            Post 🚀
          </button>

        </div>

      </div>
    </div>
  )
}