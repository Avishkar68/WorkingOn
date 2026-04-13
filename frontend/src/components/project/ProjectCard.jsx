import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import JoinProjectModal from "./JoinProjectModal";
import { motion } from "framer-motion";
import { buttonTap, cardHover, fadeInUp } from "../../lib/motion";
import { Users, Share2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationModal from "../common/ConfirmationModal";
import api from "../../api/axios";

export default function ProjectCard({ project, refresh }) {
  const [showJoin, setShowJoin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ GET CURRENT USER
  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.id || decoded._id;
    } catch {
      currentUserId = null;
    }
  }

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
      toast.success("Project deleted!");
      refresh();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  return (
    <motion.div
      className="glass-card p-4 sm:p-6 space-y-4"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={cardHover}
    >
      {/* TITLE */}
      <h2 className="text-base sm:text-lg font-semibold text-white">
        {project.title}
      </h2>

      {/* CREATOR */}
      <Link
        to={`/user/${project.creator?._id}`}
        className="flex items-center gap-3 group/creator"
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

      {/* DESCRIPTION */}
      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
        {project.description}
      </p>

      {/* TECH STACK */}
      <div className="flex gap-2 flex-wrap">
        {project.techStack?.flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean).map(tag => (
          <span
            key={tag}
            className="pill-badge"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-slate-400 font-medium">
        <span className="flex items-center gap-2">
          <Users size={14} className="text-[#2DD4BF]" />
          {project.teamSize.current}/{project.teamSize.needed}
        </span>

        <span
          className="pill-badge bg-indigo-500/10 text-indigo-200 border-indigo-500/20"
          style={{ backgroundColor: "#2DD4BF05", color: "#2DD4BF" }}
        >
          in-progress
        </span>
      </div>

      {/* ACTIONS */}
      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-3">
        {isMember ? (
          <button className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-xl">
            Joined
          </button>
        ) : request?.status === "pending" ? (
          <button className="flex-1 bg-yellow-500/20 text-yellow-400 py-2 rounded-xl">
            Pending
          </button>
        ) : request?.status === "accepted" ? (
          <button className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-xl">
            Accepted
          </button>
        ) : request?.status === "rejected" ? (
          <button className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl text-sm font-semibold">
            Rejected
          </button>
        ) : (
          <motion.button
            onClick={() => setShowJoin(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={buttonTap}
            className="flex-1 btn-primary py-2 rounded-xl text-sm font-semibold"
          >
            Join Project
          </motion.button>
        )}

        <motion.button
          whileTap={buttonTap}
          className="flex-1 btn-secondary py-2 rounded-xl text-sm font-semibold"
        >
          Message
        </motion.button>

        <motion.button
          onClick={handleShare}
          whileTap={buttonTap}
          title="Share Project"
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center shrink-0"
        >
          <Share2 size={18} />
        </motion.button>

        {(project.creator?._id || project.creator)?.toString() === currentUserId?.toString() && (
          <motion.button
            onClick={() => setShowDeleteConfirm(true)}
            whileTap={buttonTap}
            title="Delete Project"
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
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </motion.div>
  );
}
