import { useEffect, useState } from "react"
import api from "../api/axios"
import { motion } from "framer-motion"
import { staggerContainer } from "../lib/motion"
import { trackEvent } from "../utils/analytics"

import ProjectCard from "../components/project/ProjectCard"
import CreateProjectModal from "../components/project/CreateProjectModal"
import PageShell from "../components/layout/PageShell"
import Skeleton from "../components/ui/Skeleton"

export default function Projects(){

  const [projects,setProjects] = useState([])
  const [showCreate,setShowCreate] = useState(false)
  const [loading,setLoading] = useState(true)

  const loadProjects = async ()=>{
    try{
      const res = await api.get("/projects")
      setProjects(res.data)
    }catch(err){
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(()=>{
    trackEvent('page_view_component', { page: 'Projects' });
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
          onClick={()=>{
            trackEvent('button_click', { button_name: 'create_project_open' });
            setShowCreate(true);
          }}
          className="w-full sm:w-auto btn-primary px-4 py-2 rounded-xl text-sm font-medium"
        >
          Create Project
        </button>
      }
    >

      {/* LIST */}
      <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">

        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1 space-y-3 w-full">
                <Skeleton className="w-1/2 h-6" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                </div>
              </div>
              <Skeleton className="w-full md:w-24 h-10 rounded-xl md:mt-0" />
            </div>
          ))
        ) : projects.length > 0 ? (
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