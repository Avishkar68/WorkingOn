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

        teamSize:{
          needed:teamSize
        },

        tags:techStack

      })

      refresh()
      close()

    }catch(err){
      console.error(err)
    }

  }

  return(

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white w-[500px] rounded-xl p-6 space-y-4">

        <div className="flex justify-between">

          <h2 className="font-semibold text-lg">
            Create Project
          </h2>

          <button onClick={close}>
            ✕
          </button>

        </div>


        <input
          placeholder="Project Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />


        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />


        {/* TECH STACK */}

        <div className="flex gap-2">

          <input
            placeholder="Add technology"
            value={stackInput}
            onChange={(e)=>setStackInput(e.target.value)}
            className="flex-1 border p-2 rounded"
          />

          <button
            onClick={addStack}
            className="bg-gray-200 px-3 rounded"
          >
            Add
          </button>

        </div>


        <div className="flex gap-2 flex-wrap">

          {techStack.map(t=>(
            <span
              key={t}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {t}
            </span>
          ))}

        </div>


        <input
          type="number"
          value={teamSize}
          onChange={(e)=>setTeamSize(e.target.value)}
          className="w-full border p-2 rounded"
        />


        <div className="flex justify-end gap-3">

          <button
            onClick={close}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={createProject}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create Project
          </button>

        </div>

      </div>

    </div>

  )

}