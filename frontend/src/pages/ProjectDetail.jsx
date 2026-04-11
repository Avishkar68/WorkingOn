import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import PageShell from "../components/layout/PageShell"
import { Users, Calendar, Briefcase, Share2, MessageSquare, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, buttonTap } from "../lib/motion"
import toast from "react-hot-toast"

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/projects/${id}`)
        setProject(res.data)
      } catch (err) {
        console.error(err)
        toast.error("Project not found")
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  if (loading) {
    return (
      <PageShell title="Loading..." subtitle="Fetching project details">
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-pulse text-slate-500">Retrieving project data...</div>
        </div>
      </PageShell>
    )
  }

  if (!project) {
    return (
      <PageShell title="Not Found" subtitle="Thinking this link might be broken">
        <div className="text-center py-20">
          <p className="text-slate-400">The project you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/projects")}
            className="mt-6 btn-secondary px-6 py-2 rounded-xl"
          >
            Back to Projects
          </button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow="Project Details"
      title={project.title}
      subtitle="Explore the vision and collaborate with the team."
    >
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        
        {/* BACK BUTTON & ACTIONS */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          
          <button 
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all active:scale-95"
          >
            <Share2 size={18} />
          </button>
        </div>

        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card p-6 sm:p-10 space-y-8"
        >
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {project.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-400 font-medium">
                  {project.members?.length || 1} members active
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
               <button className="btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                  Apply to Join
               </button>
               <button className="btn-secondary px-8 py-3 rounded-xl font-bold active:scale-95 transition-all">
                  Message Team
               </button>
            </div>
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
            
            <div className="space-y-8">
              <section className="space-y-4">
                 <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Description
                 </h3>
                 <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {project.description}
                 </p>
              </section>

              <section className="space-y-4">
                 <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Technologies</h3>
                 <div className="flex flex-wrap gap-2">
                    {project.techStack?.map(tech => (
                      <span key={tech} className="pill-badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 text-sm">
                        {tech}
                      </span>
                    ))}
                 </div>
              </section>
            </div>

            {/* SIDEBAR INFO */}
            <div className="space-y-6">
               <div className="glass p-5 rounded-2xl border border-white/10 space-y-4">
                  <h4 className="text-white font-semibold text-sm">Project Info</h4>
                  
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Users size={16} className="text-indigo-400" />
                        <span>Team: {project.teamSize?.current}/{project.teamSize?.needed}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Calendar size={16} className="text-indigo-400" />
                        <span>Started {new Date(project.createdAt).toLocaleDateString()}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-400 text-sm">
                        <Briefcase size={16} className="text-indigo-400" />
                        <span>In Development</span>
                     </div>
                  </div>
               </div>

               <div className="glass p-5 rounded-2xl border border-white/10 space-y-4">
                  <h4 className="text-white font-semibold text-sm">Project Lead</h4>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                        {project.creator?.name?.[0]}
                     </div>
                     <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate">{project.creator?.name}</p>
                        <p className="text-xs text-slate-500">Founder</p>
                     </div>
                  </div>
               </div>
            </div>

          </div>

        </motion.div>
      </div>
    </PageShell>
  )
}

// ─── HELPER ICONS (for descriptive sections) ───
function FileText({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  )
}
