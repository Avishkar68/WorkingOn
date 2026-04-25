import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle2, Flame, Trash2 } from "lucide-react";
import { trackEvent } from "../utils/analytics";

import EditProfileModal from "../components/profile/EditProfileModal";
import PostCard from "../components/post/PostCard";
import ProjectCard from "../components/project/ProjectCard";
import EventCard from "../components/events/EventCard";
import UserListModal from "../components/dialogueboxes/UserListModal";
import ConfirmationModal from "../components/common/ConfirmationModal";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState({ type: null, id: null });
  const [streakStatus, setStreakStatus] = useState(null);

  const loadStreak = async () => {
    try {
      const res = await api.get("/streak/status");
      setStreakStatus(res.data);
    } catch (err) {
      console.error("Streak fetch error:", err);
    }
  };

  useEffect(() => {
    loadStreak();
    // Listen for the same event your desktop card uses
    window.addEventListener("streak-status-updated", loadStreak);
    return () => window.removeEventListener("streak-status-updated", loadStreak);
  }, []);

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
        api.get(`/opportunities/user/${id}`),
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
    trackEvent('page_view_component', { page: 'Profile' });
    loadAll();
    window.addEventListener("global-refresh", loadAll);
    return () => window.removeEventListener("global-refresh", loadAll);
  }, []);

  const logout = () => {
    trackEvent('button_click', { button_name: 'logout' });
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleDelete = (type, id) => {
    setDeleteData({ type, id });
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    const { type, id } = deleteData;
    if (!type || !id) return;

    try {
      await api.delete(`/${type}/${id}`);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1, -1)} deleted successfully!`,
      );
      loadAll();
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6 p-2 md:p-0 md:px-0">
      {/* PROFILE CARD - Responsive stack */}
      <div className="glass p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-start gap-4 md:gap-6 text-left md:text-left">
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-indigo-500/20"
          />
        ) : (
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl shrink-0">
            {profile.name?.[0]}
          </div>
        )}

        <div className="flex-1 w-full">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {profile.name}
          </h2>

          <p className="text-gray-400 text-sm md:text-base">
            🎓 {profile.branch} - Year {profile.year}
          </p>

          <p className="text-gray-400 text-sm">✉ {profile.email}</p>

          {profile.bio && (
            <p className="mt-3 text-gray-300 whitespace-pre-wrap text-sm md:text-base line-clamp-3 md:line-clamp-none">
              {profile.bio}
            </p>
          )}

          {/* SKILLS */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-start md:justify-start">
              {profile.skills
                ?.flatMap((s) => s.split(","))
                .map((s) => s.trim())
                .filter(Boolean)
                .map((skill, index) => (
                  <span key={index} className="pill-badge text-xs">
                    {skill}
                  </span>
                ))}
            </div>
          )}

          {/* STATS */}
          <div className="flex justify-around md:justify-start gap-4 md:gap-8 mt-6 md:mt-4 text-gray-300 border-t border-white/5 pt-4 md:border-none md:pt-0">
            <div>
              <p className="font-bold text-white">{posts.length}</p>
              <p className="text-xs md:text-sm text-gray-500">Posts</p>
            </div>
            <div
              onClick={() => setShowFollowers(true)}
              className="cursor-pointer"
            >
              <p className="font-bold text-white">
                {profile.followers?.length}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Followers</p>
            </div>
            <div
              onClick={() => setShowFollowing(true)}
              className="cursor-pointer"
            >
              <p className="font-bold text-white">
                {profile.following?.length}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Following</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-4">

  {/* EDIT PROFILE */}
  <button
    onClick={() => {
      trackEvent('edit_profile_open');
      setShowEdit(true);
    }}
    className="flex-1 md:flex-none bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/30"
  >
    Edit Profile
  </button>

  {/* LOGOUT */}
  <button
    onClick={logout}
    className="flex-1 md:flex-none border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
  >
    Log Out
  </button>

</div>
        </div>
      </div>
      {/* Streak and Daily Tasks Section */}
      <div className="flex gap-3 mt-[-16px] mb-[10px] md:hidden">
        {/* Left: Streak Count */}
        <div className="flex-1 glass p-4 rounded-2xl flex flex-col items-center justify-center border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-white">
              {streakStatus?.streakCount || 0}
            </span>
            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <Flame size={18} className="text-white fill-current" />
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tighter text-orange-400 mt-1">
            Day Streak
          </p>
        </div>

        {/* Right: Daily Challenges */}
        <div className="flex-[1.5] glass p-3 rounded-2xl flex flex-col justify-center gap-2 border border-white/5">
          {[
            { label: "Daily Challenge", done: streakStatus?.dailyTasksCompleted?.quizCompleted },
            { label: "Community Post", done: streakStatus?.dailyTasksCompleted?.postCreated }
          ].map((task, i) => (
            <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5">
              <span className={`text-[11px] font-medium ${task.done ? "text-slate-200" : "text-slate-500"}`}>
                {task.label}
              </span>
              <div className={`
          h-4 w-4 rounded-md flex items-center justify-center border
          ${task.done
                  ? "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "border-white/10 bg-white/5"}
        `}>
                {task.done && <CheckCircle2 size={10} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* TABS - Horizontal scroll on mobile */}
      <div className="flex gap-2 md:gap-4 glass p-2 rounded-2xl overflow-x-auto scrollbar-hide">
        {["posts", "projects", "events", "opportunities"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[100px] md:min-w-0 py-2 rounded-xl capitalize transition text-sm md:text-base whitespace-nowrap ${
              activeTab === tab
                ? "bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="space-y-4 md:space-y-6">
        {activeTab === "posts" &&
          (posts.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No posts yet</p>
          ) : (
            posts.map((p) => (
              <div key={p._id} className="relative group">
                <PostCard post={p} refreshFeed={loadAll} />
              </div>
            ))
          ))}

        {activeTab === "projects" &&
          (projects.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No projects yet</p>
          ) : (
            projects.map((p) => (
              <div key={p._id} className="relative group">
                <ProjectCard project={p} refresh={loadAll} />
              </div>
            ))
          ))}

        {activeTab === "events" &&
          (events.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No events yet</p>
          ) : (
            events.map((e) => (
              <div key={e._id} className="relative group">
                <EventCard event={e} refresh={loadAll} />
              </div>
            ))
          ))}

        {activeTab === "opportunities" &&
          (opportunities.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              No opportunities yet
            </p>
          ) : (
            opportunities.map((op) => (
              <div
                key={op._id}
                className="glass p-5 md:p-6 rounded-2xl space-y-4 relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-white truncate max-w-[200px] md:max-w-none">
                      {op.title}
                    </h2>
                    <p className="text-indigo-400 text-sm">{op.company}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-4 md:line-clamp-none">
                  {op.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {op.tags
                    ?.flatMap((t) => t.split(","))
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="pill-badge text-[10px] md:text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href={op.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    Apply Now
                  </a>
                  {op.postedBy === userId && (
                    <button
                      onClick={() => {
                        setDeleteData({ type: "opportunities", id: op._id });
                        setShowConfirm(true);
                      }}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-red-400 hover:text-red-500 hover:bg-white/10 transition-all flex items-center justify-center shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ))}
      </div>

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
        <EditProfileModal
          user={profile}
          close={() => setShowEdit(false)}
          refresh={loadAll}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete this ${deleteData.type?.slice(0, -1)}? This action is permanent.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
}
