import { useState } from "react"
import { createPortal } from "react-dom"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function CreateProjectModal({ close, refresh }) {

  const [title, setTitle] = useState("") // Role(s) required
  const [skillsRequired, setSkillsRequired] = useState([])
  const [skillInput, setSkillInput] = useState("")
  const [projectType, setProjectType] = useState("Hackathon")
  const [availability, setAvailability] = useState(10)
  const [openings, setOpenings] = useState(1)

  const handleSkillInput = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",").map(p => p.trim()).filter(p => p !== "");
      const newSkills = [...new Set([...skillsRequired, ...parts])];
      setSkillsRequired(newSkills);
      setSkillInput("");
    } else {
      setSkillInput(val);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (!skillsRequired.includes(skillInput.trim())) {
      setSkillsRequired([...skillsRequired, skillInput.trim()]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkillsRequired(skillsRequired.filter(s => s !== skill))
  }

  const createRequirement = async () => {
    if (!title.trim()) {
      toast.error("Role(s) required is required");
      return;
    }
    if (skillsRequired.length === 0) {
      toast.error("At least one required skill is required");
      return;
    }
    try {
      await api.post("/projects", {
        title, // Role(s) required
        description: `Looking for teammates for a ${projectType} project.`,
        skillsRequired,
        projectType,
        availability: Number(availability),
        openings: Number(openings)
      })

      toast.success("Requirement posted successfully!")
      refresh()
      close()

    } catch (err) {
      console.error(err)
      toast.error("Failed to post requirement")
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm p-4 md:p-0 flex items-center justify-center z-50">

      <div className="w-[520px] rounded-2xl p-6 text-white space-y-5 
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_25px_rgba(99,102,241,0.15)]">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-wide">
              Post Teammate Requirement
            </h2>
            <p className="text-sm text-gray-400">
              Find partners to work with
            </p>
          </div>

          <button
            onClick={close}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* ROLE(S) */}
        <div>
          <label className="text-sm text-gray-400">Role(s) Required</label>
          <input
            placeholder="e.g. Frontend Developer, UI Designer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input mt-1"
          />
        </div>

        {/* REQUIRED SKILLS */}
        <div className="space-y-2">

          <label className="text-sm text-gray-400">Required Skills</label>

          <div className="flex gap-2">
            <input
              placeholder="e.g. React, Python, Figma..."
              value={skillInput}
              onChange={handleSkillInput}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              className="flex-1 input"
            />

            <button
              onClick={addSkill}
              className="px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white 
              shadow-[0_0_10px_rgba(99,102,241,0.4)] transition"
            >
              Add
            </button>
          </div>

          {/* SKILLS CHIPS */}
          <div className="flex flex-wrap gap-2">
            {skillsRequired.map(s => (
              <span
                key={s}
                className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs border border-white/10"
              >
                {s}
                <button
                  onClick={() => removeSkill(s)}
                  className="text-gray-400 hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

        </div>

        {/* PROJECT TYPE */}
        <div>
          <label className="text-sm text-gray-400">Project Type</label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="input mt-1 w-full bg-[#1c1d1f] text-white border border-white/10 rounded-xl p-3 outline-none"
          >
            <option value="Hackathon">Hackathon</option>
            <option value="Startup">Startup</option>
            <option value="College Project">College Project</option>
            <option value="Open Source">Open Source</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* AVAILABILITY & OPENINGS GRID */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 font-medium">Availability (hours/week)</label>
            <input
              type="number"
              min="1"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="input mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 font-medium">Number of Openings</label>
            <input
              type="number"
              min="1"
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
              className="input mt-1"
            />
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
            onClick={createRequirement}
            className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white 
            shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 transition"
          >
            Post
          </button>

        </div>

      </div>
    </div>,
    document.body
  )
}