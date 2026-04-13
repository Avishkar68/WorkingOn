import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api/axios"
import toast from "react-hot-toast"

import PostCard from "../components/post/PostCard"
import ProjectCard from "../components/project/ProjectCard"
import EventCard from "../components/events/EventCard"
import UserListModal from "../components/dialogueboxes/UserListModal"
import EditProfileModal from "../components/profile/EditProfileModal"

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState("posts")

  const [posts, setPosts] = useState([])
  const [projects, setProjects] = useState([])
  const [events, setEvents] = useState([])
  const [opportunities, setOpportunities] = useState([])

  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const token = localStorage.getItem("token")
  const decoded = token ? jwtDecode(token) : null
  const currentUserId = decoded?.id || decoded?._id

  const loadAll = useCallback(async () => {
    try {
      const [u, p1, p2, p3, p4] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/posts/user/${id}`),
        api.get(`/projects/user/${id}`),
        api.get(`/events/user/${id}`),
        api.get(`/opportunities/user/${id}`)
      ])

      setProfile(u.data)
      setPosts(p1.data)
      setProjects(p2.data)
      setEvents(p3.data)
      setOpportunities(p4.data)

      setIsFollowing(
        u.data.followers?.some(
          f => (f._id || f).toString() === currentUserId?.toString()
        )
      )
    } catch (err) {
      console.error(err)
      toast.error("Failed to load profile")
    }
  }, [id, currentUserId])

  useEffect(() => {
    loadAll()
    window.addEventListener("global-refresh", loadAll)
    return () => window.removeEventListener("global-refresh", loadAll)
  }, [loadAll])

  const handleFollow = async () => {
    if (!currentUserId) {
      toast.error("Please login to follow")
      return
    }
    try {
      setLoading(true)
      if (isFollowing) {
        await api.post(`/users/${id}/unfollow`)
        toast.success("Unfollowed successfully")
      } else {
        await api.post(`/users/${id}/follow`)
        toast.success("Followed successfully")
      }
      loadAll()
    } catch (err) {
      console.error(err)
      toast.error("Action failed")
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return null

  return (
    <div className="space-y-6">
      {/* PROFILE CARD */}
      <div className="glass p-6 rounded-2xl flex gap-6">
        {profile.profileImage ? (
          <img src={profile.profileImage} className="w-24 h-24 rounded-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold">
            {profile.name?.[0]}
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">
            {profile.name}
          </h2>

          <p className="text-gray-400">
            🎓 {profile.branch} - Year {profile.year}
          </p>

          <p className="text-gray-400">
            ✉ {profile.email}
          </p>

          {profile.bio && (
            <p className="mt-3 text-gray-300 whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {/* SKILLS */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.skills?.flatMap(s => s.split(",")).map(s => s.trim()).filter(Boolean).map((skill, index) => (
                <span key={index} className="pill-badge">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* STATS */}
          <div className="flex gap-8 mt-4 text-gray-300">
            <div>
              <p className="font-bold text-white">{posts.length}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>

            <div onClick={() => setShowFollowers(true)} className="cursor-pointer hover:opacity-80 transition">
              <p className="font-bold text-white">{profile.followers?.length || 0}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>

            <div onClick={() => setShowFollowing(true)} className="cursor-pointer hover:opacity-80 transition">
              <p className="font-bold text-white">{profile.following?.length || 0}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>

          {/* ACTION BUTTON */}
          {currentUserId === id ? (
            <button
              onClick={() => setShowEdit(true)}
              className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all font-semibold"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              disabled={loading}
              className={`mt-4 px-6 py-2 rounded-xl text-white transition-all font-semibold shadow-[0_0_15px_rgba(99,102,241,0.3)]
              ${isFollowing
                  ? "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10"
                  : "bg-indigo-500 hover:bg-indigo-600"}
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 glass p-2 rounded-2xl">
        {["posts", "projects", "events", "opportunities"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl capitalize transition-all duration-300 ${activeTab === tab
              ? "bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-500/30"
              : "text-gray-400 hover:bg-white/10"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="space-y-6">
        {activeTab === "posts" && (
          posts.length === 0
            ? <p className="text-gray-400 text-center py-8 glass rounded-2xl">No posts yet</p>
            : posts.map(p => (
              <PostCard key={p._id} post={p} refreshFeed={loadAll} />
            ))
        )}

        {activeTab === "projects" && (
          projects.length === 0
            ? <p className="text-gray-400 text-center py-8 glass rounded-2xl">No projects yet</p>
            : projects.map(p => (
              <ProjectCard key={p._id} project={p} refresh={loadAll} />
            ))
        )}

        {activeTab === "events" && (
          events.length === 0
            ? <p className="text-gray-400 text-center py-8 glass rounded-2xl">No events yet</p>
            : events.map(e => (
              <EventCard key={e._id} event={e} refresh={loadAll} />
            ))
        )}

        {activeTab === "opportunities" && (
          opportunities.length === 0
            ? <p className="text-gray-400 text-center py-8 glass rounded-2xl">No opportunities yet</p>
            : opportunities.map(op => (
              <div
                key={op._id}
                className="glass p-6 rounded-2xl space-y-4 relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {op.title}
                    </h2>
                    <p className="text-indigo-400 text-sm">
                      {op.company}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {op.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {op.tags?.flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean).map(tag => (
                    <span key={tag} className="pill-badge">#{tag}</span>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href={op.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))
        )}
      </div>

      {/* MODALS */}
      <UserListModal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="Followers"
        users={profile.followers}
        navigate={navigate}
      />
      <UserListModal
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        title="Following"
        users={profile.following}
        navigate={navigate}
      />
      {showEdit && (
        <EditProfileModal user={profile} close={() => setShowEdit(false)} refresh={loadAll} />
      )}
    </div>
  )
}