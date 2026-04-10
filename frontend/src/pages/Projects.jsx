import { useEffect, useState } from "react"
import api from "../api/axios"
import { motion } from "framer-motion"
import { staggerContainer } from "../lib/motion"

import ProjectCard from "../components/project/ProjectCard"
import CreateProjectModal from "../components/project/CreateProjectModal"
import PageShell from "../components/layout/PageShell"

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
    window.addEventListener("global-refresh", loadProjects)
    return () => window.removeEventListener("global-refresh", loadProjects)
  },[])

  return(

    <PageShell
      eyebrow="Collaboration"
      title="Projects"
      subtitle="Build products together and find teammates with matching skills."
      actions={
        <button
          onClick={()=>setShowCreate(true)}
          className="w-full sm:w-auto btn-primary px-4 py-2 rounded-xl text-sm font-medium"
        >
          Create Project
        </button>
      }
    >

      {/* LIST */}
      <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">

        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              refresh={loadProjects}
            />
          ))
        ) : (
          <div className="text-center text-slate-400 py-10">
            No projects found
          </div>
        )}

      </motion.div>

      {/* MODAL */}
      {showCreate &&
        <CreateProjectModal
          close={()=>setShowCreate(false)}
          refresh={loadProjects}
        />
      }

    </PageShell>

  )
}