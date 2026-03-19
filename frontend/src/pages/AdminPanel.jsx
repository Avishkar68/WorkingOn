import React, { useEffect, useState } from "react";
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
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        🛡 Admin Panel
      </h1>

      {stats && <AdminStats stats={stats} />}

      {/* Tabs */}

      <div className="flex gap-4 bg-gray-100 p-2 rounded-xl mb-6 mt-6">

        <button
          onClick={() => setActiveTab("reported")}
          className={`flex-1 p-2 rounded-lg ${activeTab==="reported" ? "bg-white shadow" : ""}`}
        >
          Reported Posts
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 p-2 rounded-lg ${activeTab==="users" ? "bg-white shadow" : ""}`}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 p-2 rounded-lg ${activeTab==="analytics" ? "bg-white shadow" : ""}`}
        >
          Analytics
        </button>

      </div>

      {/* Reported Posts */}

      {activeTab === "reported" && (
        <div className="flex flex-col gap-4">

          {reportedPosts.map((post) => (
            <ReportedPostCard
              key={post._id}
              post={post}
            />
          ))}

        </div>
      )}

      {/* Users */}

      {activeTab === "users" && (
        <div className="flex flex-col gap-3">

          {users.map((user) => (
            <UserRow key={user._id} user={user} />
          ))}

        </div>
      )}

      {/* Analytics */}

      {activeTab === "analytics" && (
        <AnalyticsPanel stats={stats} />
      )}

    </div>
  );
};

export default AdminPanel;