import { useState } from "react"
import api from "../../api/axios"

export default function CreateProjectModal({close,refresh}){

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [techStack,setTechStack] = useState([])
  const [stackInput,setStackInput] = useState("")
  const [teamSize,setTeamSize] = useState(2)

  const addStack = ()=>{
    if(!stackInput.trim()) return
    setTechStack([...techStack,stackInput])
    setStackInput("")
  }

  const createProject = async ()=>{
    try{
      await api.post("/projects",{
        title,
        description,
        techStack,
        skillsRequired: techStack,
        teamSize:{ needed:teamSize },
        tags:techStack
      })

      refresh()
      close()

    }catch(err){
      console.error(err)
    }
  }

  return(

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="glass w-[500px] rounded-2xl p-6 space-y-4 text-white">

        <div className="flex justify-between">
          <h2 className="font-semibold text-lg">Create Project</h2>
          <button onClick={close} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <input
          placeholder="Project Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        {/* STACK */}
        <div className="flex gap-2">
          <input
            placeholder="Add technology"
            value={stackInput}
            onChange={(e)=>setStackInput(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 p-2 rounded text-gray-300"
          />

          <button
            onClick={addStack}
            className="bg-indigo-500 px-3 rounded text-white"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {techStack.map(t=>(
            <span key={t} className="bg-white/10 px-3 py-1 rounded-full text-xs">
              {t}
            </span>
          ))}
        </div>

        <input
          type="number"
          value={teamSize}
          onChange={(e)=>setTeamSize(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-2 rounded text-gray-300"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="px-4 py-2 bg-white/10 rounded text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={createProject}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            Create Project
          </button>
        </div>

      </div>

    </div>

  )
}