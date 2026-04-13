import { useState } from "react"
import { createPortal } from "react-dom"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function EditProfileModal({user,close,refresh}){

  const [bio,setBio] = useState(user.bio || "")
  const [skills,setSkills] = useState(user.skills || [])
  const [file, setFile] = useState(null)
  const [skillInput,setSkillInput] = useState("")

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

  const removeSkill = (skill)=>{
    setSkills(skills.filter(s=>s !== skill))
  }

  const saveProfile = async () => {
    try {
      const formData = new FormData()

      formData.append("bio", bio)
      formData.append("skills", JSON.stringify(skills))

      if (file) {
        formData.append("image", file)
      }

      await api.put("/users/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
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

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="glass p-6 rounded-2xl w-[420px] space-y-5 text-white">

        <h2 className="text-xl font-bold">
          Edit Profile
        </h2>

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e)=>setFile(e.target.files[0])}
          className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
        />

        {/* BIO */}
        <div>
          <p className="text-sm text-gray-400 mb-1">
            Bio
          </p>

          <textarea
            value={bio}
            onChange={(e)=>setBio(e.target.value)}
            rows="3"
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 outline-none focus:border-indigo-500"
          />
        </div>

        {/* SKILLS */}
        <div>

          <p className="text-sm text-gray-400 mb-1">
            Skills
          </p>

          <div className="flex gap-2">

            <input
              value={skillInput}
              onChange={handleSkillInput}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add skill"
              className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 outline-none"
            />

            <button
              onClick={addSkill}
              className="px-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white"
            >
              Add
            </button>

          </div>

          {/* SKILL TAGS */}
          <div className="flex gap-2 flex-wrap mt-3">

            {skills.map(skill=>(
              <span
                key={skill}
                className="bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-1"
              >
                {skill}

                <button
                  onClick={()=>removeSkill(skill)}
                  className="text-red-400 hover:text-red-500"
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
            className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20"
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>,
    document.body
  )
}