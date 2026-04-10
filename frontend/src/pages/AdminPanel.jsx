import { useEffect, useState } from "react";
import api from "../api/axios";

import AdminStats from "../components/admin/AdminStats";
import ReportedPostCard from "../components/admin/ReportedPostCard";
import UserRow from "../components/admin/UserRow";
import AnalyticsPanel from "../components/admin/AnalyticsPanel";
import ContentTable from "../components/admin/ContentTable";
import { Server, Users, Search, ShieldAlert, LayoutDashboard, Database } from "lucide-react";
import PageShell from "../components/layout/PageShell";

const AdminPanel = () => {

  const [stats, setStats] = useState(null);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, users, content, reported
  
  // Content states
  const [contentTab, setContentTab] = useState("community");
  const [contentData, setContentData] = useState([]);

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch(err) { console.error(err) }
  };

  const loadReportedPosts = async () => {
    const res = await api.get("/admin/reported-posts");
    setReportedPosts(res.data);
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch(err) { console.error(err) }
  };

  const loadContent = async () => {
    try {
      let endpoint = "";
      if (contentTab === "community") endpoint = "/communities";
      else if (contentTab === "project") endpoint = "/projects";
      else if (contentTab === "event") endpoint = "/events";
      else if (contentTab === "opportunity") endpoint = "/opportunities";

      const res = await api.get(endpoint);
      setContentData(res.data);
    } catch(err) { console.error(err) }
  };

  useEffect(() => {
    if (activeTab === "dashboard") loadStats();
    else if (activeTab === "reported") loadReportedPosts();
    else if (activeTab === "users") loadUsers();
    else if (activeTab === "content") loadContent();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "content") loadContent();
  }, [contentTab]);

  return (
    <PageShell
      eyebrow="Administration"
      title="Command Center"
      subtitle="Manage users, content, and platform analytics."
    >
      
      {/* TOP SCROLLABLE TABS */}
      <div className="glass p-2 rounded-2xl flex gap-2 overflow-x-auto border border-white/10 no-scrollbar">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { id: "users", icon: Users, label: "Users" },
          { id: "content", icon: Database, label: "Content" },
          { id: "reported", icon: ShieldAlert, label: "Reports" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition text-sm font-semibold whitespace-nowrap
              ${activeTab === tab.id 
                ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="space-y-6 mt-6">
        
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 fade-in">
            {stats && <AdminStats stats={stats} />}
            <AnalyticsPanel stats={stats} />
          </div>
        )}

        {/* CONTENT MANAGER */}
        {activeTab === "content" && (
          <div className="space-y-6 fade-in">
            <div className="glass p-2 rounded-2xl flex gap-2 overflow-x-auto border border-white/10">
              {["community", "project", "event", "opportunity"].map(type => (
                <button
                  key={type}
                  onClick={() => setContentTab(type)}
                  className={`px-4 py-2 capitalize text-sm rounded-xl font-medium transition whitespace-nowrap
                    ${contentTab === type ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  {type}s
                </button>
              ))}
            </div>
            <ContentTable type={contentTab} data={contentData} onRefresh={loadContent} />
          </div>
        )}

        {/* USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-xl font-semibold text-white">Platform Users</h2>
            <div className="grid grid-cols-1 gap-4">
              {users.map(user => (
                <UserRow key={user._id} user={user} onRefresh={loadUsers} />
              ))}
            </div>
          </div>
        )}

        {/* REPORTED */}
        {activeTab === "reported" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2">
              <ShieldAlert /> High Priority Review
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {reportedPosts.map(post => (
                <ReportedPostCard key={post._id} post={post} onRefresh={loadReportedPosts} />
              ))}
              {reportedPosts.length === 0 && (
                <p className="text-gray-400">No active reports. The campus is peaceful.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
};

export default AdminPanel;