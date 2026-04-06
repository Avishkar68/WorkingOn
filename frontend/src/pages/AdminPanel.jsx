import { useEffect, useState } from "react";
import api from "../api/axios";

import AdminStats from "../components/admin/AdminStats";
import ReportedPostCard from "../components/admin/ReportedPostCard";
import UserRow from "../components/admin/UserRow";
import AnalyticsPanel from "../components/admin/AnalyticsPanel";

const AdminPanel = () => {

  const [stats, setStats] = useState(null);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("reported");

  const loadStats = async () => {
    const res = await api.get("/admin/stats");
    setStats(res.data);
  };

  const loadReportedPosts = async () => {
    const res = await api.get("/admin/reported-posts");
    setReportedPosts(res.data);
  };

  const loadUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadStats();
    loadReportedPosts();
    loadUsers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold text-white">
        🛡 Admin Panel
      </h1>

      {stats && <AdminStats stats={stats} />}

      {/* TABS */}
      <div className="flex gap-4 glass p-2 rounded-2xl">

        {["reported","users","analytics"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 p-2 rounded-xl transition ${
              activeTab===tab
                ? "bg-indigo-500/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            {tab === "reported" && "Reported Posts"}
            {tab === "users" && "Users"}
            {tab === "analytics" && "Analytics"}
          </button>
        ))}

      </div>

      {/* CONTENT */}

      {activeTab === "reported" && (
        <div className="flex flex-col gap-4">
          {reportedPosts.map(post => (
            <ReportedPostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {activeTab === "users" && (
        <div className="flex flex-col gap-3">
          {users.map(user => (
            <UserRow key={user._id} user={user} />
          ))}
        </div>
      )}

      {activeTab === "analytics" && (
        <AnalyticsPanel stats={stats} />
      )}

    </div>
  );
};

export default AdminPanel;