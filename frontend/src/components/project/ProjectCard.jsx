import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JoinProjectModal from "./JoinProjectModal";
import { motion } from "framer-motion";
import { buttonTap, cardHover, fadeInUp } from "../../lib/motion";
import { Users, Share2, Trash2, Calendar, Briefcase, Mail } from "lucide-react";
import toast from "react-hot-toast"
import ConfirmationModal from "../common/ConfirmationModal"
import api from "../../api/axios"
import { trackEvent } from "../../utils/analytics"

export default function ProjectCard({ project, refresh }) {
  const navigate = useNavigate();
  const [showJoin, setShowJoin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ GET CURRENT USER
  const currentUserId = localStorage.getItem("userId");

  const request = project.joinRequests?.find(
    (r) => (r.user?._id || r.user)?.toString() === currentUserId?.toString(),
  );

  const isMember = project.members?.some(
    (m) => (m._id || m)?.toString() === currentUserId?.toString(),
  );

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/projects/${project._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${project._id}`);
      toast.success("Requirement deleted!");
      refresh();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete requirement");
    }
  };

  const isOwner = (project.creator?._id || project.creator)?.toString() === currentUserId?.toString();

  return (
    <motion.div
      className="glass-card p-4 sm:p-6 space-y-4 cursor-pointer"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={cardHover}
      onClick={() => {
        trackEvent('card_click', { card_type: 'project', id: project._id, title: project.title });
        navigate(`/projects/${project._id}`);
      }}
    >
      {/* HEADER: ROLE & TYPE */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-white">
          {project.title}
        </h2>
        {project.projectType && (
          <span className="pill-badge bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-xs font-semibold">
            {project.projectType}
          </span>
        )}
      </div>

      {/* CREATOR */}
      <Link
        to={`/user/${project.creator?._id}`}
        className="flex items-center gap-3 group/creator"
        onClick={(e) => e.stopPropagation()}
      >
        {project.creator?.profileImage ? (
          <img
            src={project.creator.profileImage}
            alt="creator"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-white/5 ring-2 ring-transparent group-hover/creator:ring-indigo-500/30 transition-all font-bold"
          />
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
            {project.creator?.name?.[0]}
          </div>
        )}

        <div className="min-w-0">
          <p className="font-medium text-white text-sm sm:text-base truncate group-hover/creator:text-indigo-300 transition-colors">
            {project.creator?.name}
          </p>
          <p className="text-xs text-indigo-400/70 font-semibold uppercase tracking-wider">
            {project.creator?.branch || "Student"}
          </p>
        </div>
      </Link>

      {/* REQUIRED SKILLS */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Required Skills</p>
        <div className="flex gap-2 flex-wrap">
          {project.skillsRequired?.length > 0 ? (
            project.skillsRequired.flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean).map(tag => (
              <span
                key={tag}
                className="pill-badge"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">None specified</span>
          )}
        </div>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-400 border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-[#2DD4BF]" />
          <span>Openings: {project.teamSize?.needed || project.openings || 0}</span>
        </div>
        {project.availability ? (
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-[#2DD4BF]" />
            <span>{project.availability} hrs/week</span>
          </div>
        ) : null}
      </div>

      {/* ACTIONS */}
      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-3" onClick={(e) => e.stopPropagation()}>
        {isOwner ? (
          <button className="flex-1 bg-indigo-500/20 text-indigo-400 py-2 rounded-xl text-sm font-semibold cursor-default">
            You Own This Post
          </button>
        ) : isMember ? (
          <div className="flex-1 flex gap-2">
            <button className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-xl cursor-default text-sm font-semibold">
              Accepted
            </button>
            {project.creator?.email && (
              <a
                href={`mailto:${project.creator.email}?subject=Regarding Spitians Teammate Requirement: ${project.title}`}
                className="flex-1 bg-indigo-500 text-white text-center py-2 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition flex items-center justify-center gap-1.5"
              >
                <Mail size={14} /> Send Email
              </a>
            )}
          </div>
        ) : request?.status === "pending" ? (
          <button className="flex-1 bg-yellow-500/20 text-yellow-400 py-2 rounded-xl cursor-default text-sm font-semibold">
            Applied (Pending)
          </button>
        ) : request?.status === "rejected" ? (
          <button className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl text-sm font-semibold cursor-default">
            Application Rejected
          </button>
        ) : (project.teamSize?.current >= project.teamSize?.needed) && (project.teamSize?.needed > 0) ? (
          <button
            disabled
            className="flex-1 bg-slate-500/20 text-slate-400 py-2 rounded-xl text-sm font-semibold cursor-not-allowed border border-white/5"
          >
            Position Filled
          </button>
        ) : (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              trackEvent('button_click', { button_name: 'join_project_open', id: project._id });
              setShowJoin(true);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={buttonTap}
            className="flex-1 btn-primary py-2 rounded-xl text-sm font-semibold"
          >
            Apply
          </motion.button>
        )}

        {/* DETAILS BUTTON */}
        <motion.button
          onClick={() => navigate(`/projects/${project._id}`)}
          whileTap={buttonTap}
          className="flex-1 btn-secondary py-2 rounded-xl text-sm font-semibold"
        >
          View Details
        </motion.button>

        <motion.button
          onClick={handleShare}
          whileTap={buttonTap}
          title="Share Post"
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center shrink-0"
        >
          <Share2 size={18} />
        </motion.button>

        {isOwner && (
          <motion.button
            onClick={() => setShowDeleteConfirm(true)}
            whileTap={buttonTap}
            title="Delete Requirement"
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-red-400 hover:text-red-500 hover:bg-white/10 transition-all flex items-center justify-center shrink-0"
          >
            <Trash2 size={18} />
          </motion.button>
        )}
      </div>

      {/* MODAL */}
      {showJoin && (
        <JoinProjectModal
          projectId={project._id}
          close={() => setShowJoin(false)}
          refresh={refresh}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Requirement"
        message="Are you sure you want to delete this teammate requirement? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </motion.div>
  );
}
