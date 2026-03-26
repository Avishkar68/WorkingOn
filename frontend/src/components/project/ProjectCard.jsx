import { useState } from "react"
import JoinProjectModal from "./JoinProjectModal"

export default function ProjectCard({ project, refresh }) {

  const [showJoin, setShowJoin] = useState(false)

  const currentUserId = localStorage.getItem("userId")

  const request = project.joinRequests?.find(
    r => r.user?._id === currentUserId
  )

  const isMember = project.members?.some(
    m => m._id === currentUserId
  )

  return (
    <div className="glass p-6 rounded-2xl space-y-4 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition">

      {/* TITLE */}
      <h2 className="text-lg font-semibold text-white">
        {project.title}
      </h2>

      {/* CREATOR */}
      <div className="flex items-center gap-3">

        {/* <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
          {project.creator?.name?.[0]}
        </div> */}
        {project.creator?.profileImage ? (
  <img
    src={project.creator.profileImage}
    alt="creator"
    className="w-10 h-10 rounded-full object-cover"
  />
) : (
  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
    {project.creator?.name?.[0]}
  </div>
)}

        <div>
          <p className="font-medium text-white">{project.creator?.name}</p>
          <p className="text-xs text-gray-400">CSE</p>
        </div>

      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-300 text-sm">
        {project.description}
      </p>

      {/* TECH STACK */}
      <div className="flex gap-2 flex-wrap">
        {project.techStack?.map(tag => (
          <span
            key={tag}
            className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* TEAM INFO */}
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>👥 {project.teamSize.current}/{project.teamSize.needed}</span>

        <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs">
          in-progress
        </span>
      </div>

      {/* ACTIONS */}
      <div className="border-t border-white/10 pt-4 flex gap-4">

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
          <button className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl">
            Rejected
          </button>

        ) : (
          <button
            onClick={() => setShowJoin(true)}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            Join Project
          </button>
        )}

        <button className="flex-1 bg-white/10 text-gray-300 py-2 rounded-xl hover:bg-white/20">
          Message
        </button>

      </div>

      {/* MODAL */}
      {showJoin && (
        <JoinProjectModal
          projectId={project._id}
          close={() => setShowJoin(false)}
          refresh={refresh}
        />
      )}

    </div>
  )
}