import { useState } from "react"
import { createPortal } from "react-dom"
import api from "../../api/axios"
import toast from "react-hot-toast"
import { X, Plus, Upload } from "lucide-react" // Optional: for better icons

export default function EditProfileModal({ user, close, refresh }) {
  const [bio, setBio] = useState(user.bio || "")
  const [skills, setSkills] = useState(user.skills || [])
  const [file, setFile] = useState(null)
  const [skillInput, setSkillInput] = useState("")

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

  const saveProfile = async () => {
    try {
      const formData = new FormData()
      formData.append("bio", bio)
      formData.append("skills", JSON.stringify(skills))
      if (file) formData.append("image", file)

      await api.put("/users/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      toast.success("Profile updated successfully!")
      refresh()
      close()
    } catch (err) {
      console.error(err)
      toast.error("Failed to update profile")
    }
  }

  return createPortal(
    /* OVERLAY: Increased blur and darker tint */
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">

      {/* MODAL CONTAINER: Added border and solid-ish background to prevent blending */}
      <div className="bg-[#121212]/90 border border-white/10 p-6 rounded-2xl w-full max-w-[440px] shadow-2xl space-y-6 text-white overflow-hidden relative">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <button onClick={close} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Profile Picture</p>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex flex-col items-center justify-center pt-2">
              <Upload size={20} className="text-gray-400 mb-1" />
              <p className="text-xs text-gray-400">{file ? file.name : "Click to upload new image"}</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </label>
        </div>

        {/* BIO */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Bio</p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
            placeholder="Tell us about yourself..."
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none"
          />
        </div>

        {/* SKILLS */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Skills</p>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={handleSkillInput}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="React, Node, etc."
              className="flex-1 p-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-gray-200 outline-none focus:border-indigo-500"
            />
            <button
              onClick={addSkill}
              className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm font-medium transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mt-3 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
            {skills.map(skill => (
              <span
                key={skill}
                className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-[11px] font-medium text-indigo-300 flex items-center gap-2"
              >
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={close}
            className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={saveProfile}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm font-bold"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}