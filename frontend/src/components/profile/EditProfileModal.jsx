import { useState } from "react"
import api from "../../api/axios"

export default function EditProfileModal({user,close,refresh}){

  const [bio,setBio] = useState(user.bio || "")
  const [skills,setSkills] = useState(user.skills || [])

  const [skillInput,setSkillInput] = useState("")

  const addSkill = ()=>{

    if(skillInput.trim() === "") return

    setSkills([...skills,skillInput])
    setSkillInput("")

  }

  const removeSkill = (skill)=>{

    setSkills(skills.filter(s=>s !== skill))

  }

  const saveProfile = async ()=>{

    await api.put("/users/update",{
      bio,
      skills
    })

    refresh()
    close()

  }

  return(

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

        <h2 className="text-xl font-bold">
          Edit Profile
        </h2>

        <div>

          <p className="text-sm">Bio</p>

          <textarea
            value={bio}
            onChange={(e)=>setBio(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

        </div>

        <div>

          <p className="text-sm">Skills</p>

          <div className="flex gap-2">

            <input
              value={skillInput}
              onChange={(e)=>setSkillInput(e.target.value)}
              className="border p-2 rounded-lg flex-1"
              placeholder="Add skill"
            />

            <button
              onClick={addSkill}
              className="bg-gray-200 px-3 rounded-lg"
            >
              Add
            </button>

          </div>

          <div className="flex gap-2 flex-wrap mt-2">

            {skills.map(skill=>(
              <span
                key={skill}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm"
              >
                {skill}

                <button
                  onClick={()=>removeSkill(skill)}
                  className="ml-1"
                >
                  ✕
                </button>

              </span>
            ))}

          </div>

        </div>

        <div className="flex justify-end gap-2">

          <button
            onClick={close}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>

  )

}