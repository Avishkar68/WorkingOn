import { useEffect, useState } from "react"
import api from "../api/axios"

import ProjectCard from "../components/project/ProjectCard"
import CreateProjectModal from "../components/project/CreateProjectModal"

export default function Projects(){

  const [projects,setProjects] = useState([])
  const [showCreate,setShowCreate] = useState(false)

  const loadProjects = async ()=>{
    try{
      const res = await api.get("/projects")
      setProjects(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    loadProjects()
  },[])

  return(

    <div className="space-y-6 px-3 sm:px-5 md:px-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex gap-2 items-center">
“Stop thinking. Start building.”          </h1>

          <p className="text-gray-400 text-sm sm:text-base">
            Collaborate on exciting projects
          </p>
        </div>

        <button
          onClick={()=>setShowCreate(true)}
          className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition"
        >
          Create Project
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-5 sm:space-y-6">

        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              refresh={loadProjects}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-10">
            No projects found
          </div>
        )}

      </div>

      {/* MODAL */}
      {showCreate &&
        <CreateProjectModal
          close={()=>setShowCreate(false)}
          refresh={loadProjects}
        />
      }

    </div>

  )
}