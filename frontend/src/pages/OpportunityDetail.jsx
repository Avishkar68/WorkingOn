import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import PageShell from "../components/layout/PageShell"
import { CalendarDays, Hourglass, Briefcase, Share2, ChevronLeft, ExternalLink, IndianRupee } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, buttonTap } from "../lib/motion"
import toast from "react-hot-toast"

export default function OpportunityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [op, setOp] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/opportunities/${id}`)
        setOp(res.data)
      } catch (err) {
        console.error(err)
        toast.error("Opportunity not found")
      } finally {
        setLoading(false)
      }
    }
    load()
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

  const daysLeft = (deadline) => {
    if (!deadline) return "No deadline"
    const diff = new Date(deadline) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days left` : "Expired"
  }

  if (loading) {
    return (
      <PageShell title="Loading..." subtitle="Fetching opportunity details">
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-pulse text-slate-500">Retrieving data...</div>
        </div>
      </PageShell>
    )
  }

  if (!op) {
    return (
      <PageShell title="Not Found" subtitle="This opportunity might have expired">
        <div className="text-center py-20">
          <p className="text-slate-400">The opportunity you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/opportunities")}
            className="mt-6 btn-secondary px-6 py-2 rounded-xl"
          >
            Back to Opportunities
          </button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow="Career Opportunity"
      title={op.title}
      subtitle={op.company}
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
              <div className="flex items-center gap-3">
                 <span className="pill-badge bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1">
                    {op.postedBy?._id === "000000000000000000000001" ? "External" : "Student Post"}
                 </span>
                 <span className="text-slate-500 text-xs">•</span>
                 <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                    Posted {new Date(op.createdAt).toLocaleDateString()}
                 </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {op.title}
              </h1>
              <p className="text-xl text-indigo-300 font-medium">
                {op.company}
              </p>
            </div>

            <a
              href={op.registrationLink || op.link}
              target="_blank"
              rel="noreferrer"
              className="btn-primary px-10 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              Apply Now
              <ExternalLink size={18} />
            </a>
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
            
            <div className="space-y-8">
              <section className="space-y-4">
                 <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    About this Role
                 </h3>
                 <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {op.description}
                 </p>
              </section>

              <section className="space-y-4">
                 <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Target Skills</h3>
                 <div className="flex flex-wrap gap-2">
                    {op.tags?.map(tag => (
                      <span key={tag} className="pill-badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 text-sm">
                        {tag}
                      </span>
                    ))}
                 </div>
              </section>
            </div>

            {/* SIDEBAR INFO */}
            <div className="space-y-6">
               <div className="glass p-6 rounded-2xl border border-white/10 space-y-5">
                  <h4 className="text-white font-semibold text-sm">Role Details</h4>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-slate-300 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                           <IndianRupee size={16} className="text-emerald-400" />
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Stipend</p>
                           <p className="font-medium">{op.stipend || "Unpaid / N/A"}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3 text-slate-300 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                           <Hourglass size={16} className="text-amber-400" />
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Duration</p>
                           <p className="font-medium">{op.duration || "Flexible"}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 text-slate-300 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                           <CalendarDays size={16} className="text-indigo-400" />
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Deadline</p>
                           <p className="font-medium">{daysLeft(op.deadline)}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                  <p className="text-[10px] text-indigo-300 block mb-2 font-bold uppercase tracking-tighter">Pro Tip</p>
                  <p className="text-xs text-slate-400 leading-normal">
                    Make sure your profile is complete before applying to increase your chances of selection.
                  </p>
               </div>
            </div>

          </div>

        </motion.div>
      </div>
    </PageShell>
  )
}