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

    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold text-white flex gap-2 items-center">
            {"</>"} Projects
          </h1>

          <p className="text-gray-400">
            Collaborate on exciting projects
          </p>
        </div>

        <button
          onClick={()=>setShowCreate(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          Create Project
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-6">

        {projects.map(project => (
          <ProjectCard
            key={project._id}
            project={project}
            refresh={loadProjects}
          />
        ))}

      </div>

      {showCreate &&
        <CreateProjectModal
          close={()=>setShowCreate(false)}
          refresh={loadProjects}
        />
      }

    </div>

  )
}