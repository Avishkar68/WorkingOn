import { useState } from "react"
import { createPortal } from "react-dom"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function JoinProjectModal({ projectId, close, refresh }) {
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState("")
  const [interests, setInterests] = useState("")
  const [availability, setAvailability] = useState(10)
  const [github, setGithub] = useState("")
  const [portfolio, setPortfolio] = useState("")
  const [message, setMessage] = useState("")

  const handleSkillInput = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",").map(p => p.trim()).filter(p => p !== "");
      const newSkills = [...new Set([...skills, ...parts])];
      setSkills(newSkills);
      setSkillInput("");
    } else {
      setSkillInput(val);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const sendRequest = async () => {
    if (skills.length === 0) {
      toast.error("Please add at least one of your skills")
      return
    }
    if (!interests.trim()) {
      toast.error("Please describe your interests")
      return
    }
    if (!message.trim()) {
      toast.error("Please add a short introduction / message")
      return
    }

    try {
      await api.post(`/projects/${projectId}/join`, {
        skills,
        interests,
        availability: Number(availability),
        github,
        portfolio,
        message
      })
      toast.success("Application submitted successfully!")
      refresh()
      close()
    } catch (err) {
      console.error(err)
      toast.error("Failed to submit application")
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#121212]/90 border border-white/10 backdrop-blur-md w-full max-w-[550px] rounded-2xl p-6 sm:p-8 space-y-5 text-white shadow-2xl my-8">

        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-xl tracking-tight">Apply for Role</h2>
            <p className="text-gray-400 text-sm mt-1">Provide your details to apply for this teammate requirement</p>
          </div>
          <button onClick={close} className="text-gray-500 hover:text-white transition-colors text-xl">
            ✕
          </button>
        </div>

        {/* SKILLS */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400 font-medium">Your Skills</label>
          <div className="flex gap-2">
            <input
              placeholder="e.g. React, Python, Figma..."
              value={skillInput}
              onChange={handleSkillInput}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              className="flex-1 input bg-[#1e1e1e] border border-white/5 rounded-lg p-2 text-sm focus:outline-none focus:border-[#22d3ee]/50"
            />
            <button
              onClick={addSkill}
              className="px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition animate-fade-in"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span
                key={s}
                className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs border border-white/10"
              >
                {s}
                <button
                  onClick={() => removeSkill(s)}
                  className="text-gray-400 hover:text-red-400 ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* INTERESTS */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400 font-medium">Interests</label>
          <textarea
            placeholder="Tell us about your interests in this project type..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            rows="2"
            className="w-full bg-[#1e1e1e] border border-white/5 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22d3ee]/50 resize-none placeholder:text-gray-600"
          />
        </div>

        {/* AVAILABILITY */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400 font-medium">Availability (hours/week)</label>
          <input
            type="number"
            min="1"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-white/5 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22d3ee]/50 placeholder:text-gray-600"
          />
        </div>

        {/* GITHUB & PORTFOLIO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-400 font-medium">GitHub Link (optional)</label>
            <input
              placeholder="https://github.com/..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/5 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22d3ee]/50 placeholder:text-gray-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-400 font-medium">Portfolio Link (optional)</label>
            <input
              placeholder="https://..."
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/5 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22d3ee]/50 placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* INTRODUCTION / MESSAGE */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400 font-medium">Short Introduction / Message</label>
          <textarea
            placeholder="Introduce yourself to the requirement owner..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            className="w-full bg-[#1e1e1e] border border-white/5 rounded-lg p-3 text-sm focus:outline-none focus:border-[#22d3ee]/50 resize-none placeholder:text-gray-600"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={close}
            className="px-5 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg text-gray-300 transition-all font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={sendRequest}
            className="btn-primary text-[#083344] px-6 py-2 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm"
          >
            Submit Application
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}