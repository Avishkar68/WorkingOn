import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import PageShell from "../components/layout/PageShell"
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Share2, 
  ChevronLeft, 
  Mail, 
  Github, 
  Globe, 
  Check, 
  X, 
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, buttonTap } from "../lib/motion"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"
import JoinProjectModal from "../components/project/JoinProjectModal"

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useContext(AuthContext)
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const currentUserId = localStorage.getItem("userId")

  const loadProject = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/projects/${id}`)
      setProject(res.data)
    } catch (err) {
      console.error(err)
      toast.error("Hiring requirement not found")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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

  const handleAccept = async (applicantId) => {
    try {
      setActionLoadingId(applicantId)
      const ownerEmail = currentUser?.email || ""
      await api.post(`/projects/${project._id}/accept/${applicantId}`, { contact: ownerEmail })
      toast.success("Application accepted successfully!")
      loadProject()
    } catch (err) {
      console.error(err)
      toast.error("Failed to accept application")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (applicantId) => {
    try {
      setActionLoadingId(applicantId)
      await api.post(`/projects/${project._id}/reject/${applicantId}`)
      toast.success("Application rejected")
      loadProject()
    } catch (err) {
      console.error(err)
      toast.error("Failed to reject application")
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return (
      <PageShell title="Loading..." subtitle="Fetching details">
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-pulse text-slate-500 font-medium">Retrieving requirements...</div>
        </div>
      </PageShell>
    )
  }

  if (!project) {
    return (
      <PageShell title="Not Found" subtitle="Broken or removed requirement">
        <div className="text-center py-20">
          <p className="text-slate-400">The requirement you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate("/projects")}
            className="mt-6 btn-secondary px-6 py-2 rounded-xl text-sm font-semibold"
          >
            Back to Teammates Board
          </button>
        </div>
      </PageShell>
    )
  }

  const isOwner = (project.creator?._id || project.creator)?.toString() === currentUserId?.toString()
  
  const myApplication = project.joinRequests?.find(
    (r) => (r.user?._id || r.user)?.toString() === currentUserId?.toString()
  )

  const isMember = project.members?.some(
    (m) => (m._id || m)?.toString() === currentUserId?.toString()
  )

  return (
    <PageShell
      eyebrow="Teammate Hiring"
      title={project.title}
      subtitle="Detailed look at this role requirement and application status."
    >
      <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 sm:px-0">
        
        {/* BACK BUTTON & ACTIONS */}
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ChevronLeft size={16} />
            Back to Board
          </button>
          
          <button 
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all active:scale-95 flex items-center justify-center"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* DETAILS CARD */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card p-6 sm:p-10 space-y-8"
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="pill-badge bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-xs font-semibold">
                  {project.projectType || "Requirement"}
                </span>
                {project.availability && (
                  <span className="pill-badge bg-teal-500/10 text-teal-300 border-teal-500/20 text-xs font-semibold">
                    {project.availability} hrs/week
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                {project.title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-400 font-semibold">
                  <Users size={16} className="text-[#2DD4BF]" />
                  <span>Openings: {project.teamSize?.needed || project.openings || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400 font-semibold">
                  <Clock size={16} className="text-[#2DD4BF]" />
                  <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* ACTION SECTION */}
            <div className="flex flex-col gap-3 shrink-0 sm:w-48">
              {isOwner ? (
                <div className="text-center py-2 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  Your Posting
                </div>
              ) : isMember ? (
                <div className="space-y-2">
                  <div className="text-center py-2 px-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={14} /> Accepted
                  </div>
                  {project.creator?.email && (
                    <a
                      href={`mailto:${project.creator.email}?subject=Regarding Spitians Teammate Requirement: ${project.title}`}
                      className="w-full btn-primary text-center py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Mail size={16} /> Send Email
                    </a>
                  )}
                </div>
              ) : myApplication?.status === "pending" ? (
                <div className="text-center py-3 px-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold">
                  Application Pending
                </div>
              ) : myApplication?.status === "rejected" ? (
                <div className="text-center py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
                  Application Rejected
                </div>
              ) : (project.teamSize?.current >= project.teamSize?.needed) && (project.teamSize?.needed > 0) ? (
                <button
                  disabled
                  className="w-full bg-slate-500/20 text-slate-400 py-3 rounded-xl text-sm font-semibold cursor-not-allowed border border-white/5"
                >
                  Position Filled
                </button>
              ) : (
                <button 
                  onClick={() => setShowApplyModal(true)}
                  className="btn-primary w-full py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Apply to Join
                </button>
              )}
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            
            <div className="space-y-6">
              {/* DESCRIPTION / CONTEXT */}
              <section className="space-y-3">
                 <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
                    Role Description
                 </h3>
                 <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                    {project.description}
                 </p>
              </section>

              {/* REQUIRED SKILLS */}
              <section className="space-y-3">
                 <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                   Required Skills
                 </h3>
                 <div className="flex flex-wrap gap-2">
                     {project.skillsRequired?.length > 0 ? (
                       project.skillsRequired.flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean).map(skill => (
                         <span key={skill} className="pill-badge">
                           {skill}
                         </span>
                       ))
                     ) : (
                       <span className="text-xs text-slate-500 italic">None specified</span>
                     )}
                 </div>
              </section>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
               {/* POST OWNER DETAILS */}
               <div className="glass p-5 rounded-2xl border border-white/10 space-y-4">
                  <h4 className="text-white font-semibold text-sm">Post Owner</h4>
                  
                  <Link to={`/user/${project.creator?._id}`} className="flex items-center gap-3 group">
                     {project.creator?.profileImage ? (
                       <img
                         src={project.creator.profileImage}
                         alt="owner"
                         className="w-10 h-10 rounded-full object-cover border border-white/10 ring-2 ring-transparent group-hover/creator:ring-indigo-500/30 transition-all"
                       />
                     ) : (
                       <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                         {project.creator?.name?.[0]}
                       </div>
                     )}
                     <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                          {project.creator?.name}
                        </p>
                        <p className="text-xs text-slate-500">{project.creator?.branch || "Student"}</p>
                     </div>
                  </Link>
               </div>
            </div>
          </div>

          {/* OWNER PANEL: APPLICATIONS RECEIVED */}
          {isOwner && (
            <div className="border-t border-white/10 pt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Applications Received</span>
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {project.joinRequests?.length || 0}
                  </span>
                </h3>
              </div>

              {project.joinRequests && project.joinRequests.length > 0 ? (
                <div className="space-y-4">
                  {project.joinRequests.map((req) => {
                    const applicant = req.user;
                    if (!applicant) return null;
                    return (
                      <div 
                        key={req._id || applicant._id} 
                        className={`p-5 rounded-xl border transition-all ${
                          req.status === "accepted" 
                            ? "bg-green-500/5 border-green-500/20" 
                            : req.status === "rejected"
                              ? "bg-red-500/5 border-red-500/20"
                              : "bg-white/2 border-white/5 hover:border-white/10"
                        }`}
                      >
                        {/* APPLICANT CARD HEADER */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                          <Link 
                            to={`/user/${applicant._id}`} 
                            className="flex items-center gap-3 group"
                          >
                            <img
                              src={applicant.profileImage || "https://ui-avatars.com/api/?name=User"}
                              alt="applicant"
                              className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />
                            <div>
                              <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">
                                {applicant.name}
                              </h4>
                              <p className="text-xs text-gray-400">
                                {applicant.branch || "Student"} • Year {applicant.year || 1}
                              </p>
                            </div>
                          </Link>

                          {/* APPLICATION STATUS & CONTROLS */}
                          <div className="flex items-center gap-2">
                            {req.status === "pending" ? (
                              <>
                                <button
                                  disabled={actionLoadingId !== null}
                                  onClick={() => handleReject(applicant._id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1 transition"
                                >
                                  <X size={14} /> Reject
                                </button>
                                <button
                                  disabled={actionLoadingId !== null}
                                  onClick={() => handleAccept(applicant._id)}
                                  className="px-4 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-[#0f2d1e] text-xs font-bold flex items-center gap-1 transition shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                                >
                                  <Check size={14} /> Accept
                                </button>
                              </>
                            ) : req.status === "accepted" ? (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="text-green-400 bg-green-500/10 border border-green-500/20 text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Accepted
                                </div>
                                {applicant.email && (
                                  <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 p-1 px-2.5 rounded-lg">
                                    <span className="text-xs text-indigo-300 font-medium select-all">
                                      {applicant.email}
                                    </span>
                                    <a
                                      href={`mailto:${applicant.email}?subject=Spitians Teammate Application Accepted: ${project.title}`}
                                      className="bg-indigo-500 hover:bg-indigo-600 text-white p-1.5 rounded-md transition flex items-center justify-center"
                                      title="Send Email"
                                    >
                                      <Mail size={14} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-red-400 bg-red-500/10 border border-red-500/20 text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                                <XCircle size={12} /> Rejected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* APPLICANT SUBMISSION DETAILS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3">
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase">Skills</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {req.skills && req.skills.length > 0 ? (
                                  req.skills.map(sk => (
                                    <span key={sk} className="pill-badge text-[11px] px-2 py-0.5">
                                      {sk}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-500">None declared</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase">Interests</p>
                              <p className="text-slate-300 text-xs mt-1 leading-relaxed bg-white/2 p-2 rounded-lg border border-white/5">
                                {req.interests || "None provided"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-slate-500 font-bold uppercase">Availability</p>
                                <p className="text-slate-300 font-semibold mt-0.5">
                                  {req.availability ? `${req.availability} hrs/week` : "Not specified"}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <p className="text-slate-500 font-bold uppercase">Links</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {req.github && (
                                    <a 
                                      href={req.github} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-slate-400 hover:text-white transition-colors"
                                      title="GitHub"
                                    >
                                      <Github size={16} />
                                    </a>
                                  )}
                                  {req.portfolio && (
                                    <a 
                                      href={req.portfolio} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-slate-400 hover:text-white transition-colors"
                                      title="Portfolio"
                                    >
                                      <Globe size={16} />
                                    </a>
                                  )}
                                  {!req.github && !req.portfolio && (
                                    <span className="text-slate-500">No links</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase">Introduction / Message</p>
                              <p className="text-slate-300 text-xs mt-1 leading-relaxed bg-white/2 p-2 rounded-lg border border-white/5 whitespace-pre-wrap">
                                {req.message || "No introduction message"}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-6 border border-dashed border-white/5 rounded-xl bg-white/1">
                  No applications received yet.
                </div>
              )}
            </div>
          )}

        </motion.div>
      </div>

      {/* APPLY MODAL */}
      {showApplyModal && (
        <JoinProjectModal
          projectId={project._id}
          close={() => setShowApplyModal(false)}
          refresh={loadProject}
        />
      )}
    </PageShell>
  )
}
