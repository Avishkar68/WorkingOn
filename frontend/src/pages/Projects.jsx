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

          <h1 className="text-2xl font-bold flex gap-2 items-center">
            {"</>"} Projects
          </h1>

          <p className="text-gray-500">
            Collaborate on exciting projects
          </p>

        </div>

        <button
          onClick={()=>setShowCreate(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg"
        >
          Create Project
        </button>

      </div>


      {/* PROJECT LIST */}

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