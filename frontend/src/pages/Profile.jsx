import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import EditProfileModal from "../components/profile/EditProfileModal";
import PostCard from "../components/post/PostCard";
import ProjectCard from "../components/project/ProjectCard";
import EventCard from "../components/events/EventCard";
import UserListModal from "../components/dialogueboxes/UserListModal";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);

  const [activeTab, setActiveTab] = useState("posts");

  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  const [showEdit, setShowEdit] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const loadAll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const id = decoded.id || decoded._id;
      setUserId(id);

      const [u, p1, p2, p3, p4] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/posts/user/${id}`),
        api.get(`/projects/user/${id}`),
        api.get(`/events/user/${id}`),
        api.get(`/opportunities/user/${id}`)
      ]);

      setProfile(u.data);
      setPosts(p1.data);
      setProjects(p2.data);
      setEvents(p3.data);
      setOpportunities(p4.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAll();
    window.addEventListener("global-refresh", loadAll)
    return () => window.removeEventListener("global-refresh", loadAll)
  }, []);

  const handleDelete = async (type, id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api.delete(`/${type}/${id}`);
      toast.success("Item deleted successfully!");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">

      {/* PROFILE CARD */}
      <div className="glass p-6 rounded-2xl flex gap-6">

        {profile.profileImage ? (
          <img src={profile.profileImage} className="w-24 h-24 rounded-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl">
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
            <p className="mt-3 text-gray-300">
              {profile.bio}
            </p>
          )}
          {/* SKILLS */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30"
                >
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

            <div onClick={() => setShowFollowers(true)} className="cursor-pointer">
              <p className="font-bold text-white">{profile.followers?.length}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>

            <div onClick={() => setShowFollowing(true)} className="cursor-pointer">
              <p className="font-bold text-white">{profile.following?.length}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>

          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            Edit Profile
          </button>

        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 glass p-2 rounded-2xl">
        {["posts", "projects", "events", "opportunities"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl capitalize transition ${activeTab === tab
                ? "bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                : "text-gray-400 hover:bg-white/10"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="space-y-6">

        {/* POSTS */}
        {activeTab === "posts" && (
          posts.length === 0
            ? <p className="text-gray-400">No posts</p>
            : posts.map(p => (
              <div key={p._id} className="relative group">
                <PostCard post={p} refreshFeed={loadAll} />

                <button
                  onClick={() => handleDelete("posts", p._id)}
                  className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"
                >
                  🗑
                </button>
              </div>
            ))
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          projects.length === 0
            ? <p className="text-gray-400">No projects</p>
            : projects.map(p => (
              <div key={p._id} className="relative group">
                <ProjectCard project={p} refresh={loadAll} />

                {p.creator === userId && (
                  <button
                    onClick={() => handleDelete("projects", p._id)}
                    className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    🗑
                  </button>
                )}
              </div>
            ))
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          events.length === 0
            ? <p className="text-gray-400">No events</p>
            : events.map(e => (
              <div key={e._id} className="relative group">
                <EventCard event={e} />

                {e.organizer === userId && (
                  <button
                    onClick={() => handleDelete("events", e._id)}
                    className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    🗑
                  </button>
                )}
              </div>
            ))
        )}

        {/* OPPORTUNITIES */}
        {activeTab === "opportunities" && (
          opportunities.length === 0
            ? <p className="text-gray-400">No opportunities</p>
            : opportunities.map(op => (
              <div
                key={op._id}
                className="glass p-6 rounded-2xl space-y-4 relative group"
              >

                {op.postedBy === userId && (
                  <button
                    onClick={() => handleDelete("opportunities", op._id)}
                    className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    🗑
                  </button>
                )}

                <h2 className="text-lg font-semibold text-white">
                  {op.title}
                </h2>

                <p className="text-indigo-400 text-sm">
                  {op.company}
                </p>

                <p className="text-gray-300 text-sm">
                  {op.description}
                </p>

                <a
                  href={op.registrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl"
                >
                  Apply Now
                </a>

              </div>
            ))
        )}

      </div>

      {/* FOLLOWERS MODAL */}
      <UserListModal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="Followers"
        users={profile.followers}
        navigate={navigate}
      />

      {/* FOLLOWING MODAL */}
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
  );
}