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
    <div className="bg-white p-6 rounded-xl shadow space-y-4">

      <h2 className="text-lg font-semibold">
        {project.title}
      </h2>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
          {project.creator?.name?.[0]}
        </div>

        <div>
          <p className="font-medium">{project.creator?.name}</p>
          <p className="text-xs text-gray-500">CSE</p>
        </div>
      </div>

      <p className="text-gray-600">{project.description}</p>

      <div className="flex gap-2 flex-wrap">
        {project.techStack?.map(tag => (
          <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span>👥 {project.teamSize.current}/{project.teamSize.needed}</span>
        <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
          in-progress
        </span>
      </div>

      <div className="border-t pt-4 flex gap-4">

        {isMember ? (
          <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
            Joined
          </button>

        ) : request?.status === "pending" ? (
          <button className="flex-1 bg-yellow-500 text-white py-2 rounded-lg">
            Pending
          </button>

        ) : request?.status === "accepted" ? (
          <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
            Accepted
          </button>

        ) : request?.status === "rejected" ? (
          <button className="flex-1 bg-red-500 text-white py-2 rounded-lg">
            Rejected
          </button>

        ) : (
          <button
            onClick={() => setShowJoin(true)}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg"
          >
            Join Project
          </button>
        )}

        <button className="flex-1 border py-2 rounded-lg">
          Message
        </button>

      </div>

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