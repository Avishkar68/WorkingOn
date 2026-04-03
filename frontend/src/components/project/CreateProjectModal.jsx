import { useState } from "react"
import api from "../../api/axios"

export default function CreateProjectModal({ close, refresh }) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [techStack, setTechStack] = useState([])
  const [stackInput, setStackInput] = useState("")
  const [teamSize, setTeamSize] = useState(2)

  const addStack = () => {
    if (!stackInput.trim()) return
    setTechStack([...techStack, stackInput])
    setStackInput("")
  }

  const removeStack = (tech) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const createProject = async () => {
    try {
      await api.post("/projects", {
        title,
        description,
        techStack,
        skillsRequired: techStack,
        teamSize: { needed: teamSize },
        tags: techStack
      })

      refresh()
      close()

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-[520px] rounded-2xl p-6 text-white space-y-5 
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_25px_rgba(99,102,241,0.15)]">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-wide">
              💻 Create Project
            </h2>
            <p className="text-sm text-gray-400">
              Build something and find teammates 🚀
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
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-200 placeholder-gray-500 
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Describe your project idea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-500 
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
        />

        {/* TECH STACK */}
        <div className="space-y-2">

          <label className="text-sm text-gray-400">Tech Stack</label>

          <div className="flex gap-2">
            <input
              placeholder="React, Node, AI..."
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 placeholder-gray-500 
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
            />

            <button
              onClick={addStack}
              className="px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white 
              shadow-[0_0_10px_rgba(99,102,241,0.4)] transition"
            >
              Add
            </button>
          </div>

          {/* STACK CHIPS */}
          <div className="flex flex-wrap gap-2">
            {techStack.map(t => (
              <span
                key={t}
                className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs border border-white/10"
              >
                {t}
                <button
                  onClick={() => removeStack(t)}
                  className="text-gray-400 hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

        </div>

        {/* TEAM SIZE */}
        <div>
          <label className="text-sm text-gray-400">Team Size Needed</label>

          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
          />
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
            onClick={createProject}
            className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white 
            shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 transition"
          >
            Create 🚀
          </button>

        </div>

      </div>
    </div>
  )
}