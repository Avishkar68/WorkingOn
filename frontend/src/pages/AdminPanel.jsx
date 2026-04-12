import { useEffect, useState } from "react";
import api from "../api/axios";

import AdminStats from "../components/admin/AdminStats";
import UniversalReportCard from "../components/admin/UniversalReportCard";
import UserRow from "../components/admin/UserRow";
import AnalyticsPanel from "../components/admin/AnalyticsPanel";
import ContentTable from "../components/admin/ContentTable";
import ChallengesManager from "../components/admin/ChallengesManager";
import PulseModerationCard from "../components/admin/PulseModerationCard";
import { Server, Users, Search, ShieldAlert, LayoutDashboard, Database, Trophy, Zap } from "lucide-react";
import PageShell from "../components/layout/PageShell";

const AdminPanel = () => {

  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, users, content, pulses, reported
  const [pulses, setPulses] = useState([]);
  const [pulseFilter, setPulseFilter] = useState("all");
  // Content states
  const [contentTab, setContentTab] = useState("community");
  const [contentData, setContentData] = useState([]);

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch(err) { console.error(err) }
  };

  const loadReports = async () => {
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data);
    } catch(err) { console.error(err) }
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

  const loadPulses = async () => {
    try {
      const res = await api.get(`/admin/pulses?filter=${pulseFilter}`);
      setPulses(res.data);
    } catch(err) { console.error(err) }
  };

  useEffect(() => {
    if (activeTab === "dashboard") loadStats();
    else if (activeTab === "reported") loadReports();
    else if (activeTab === "users") loadUsers();
    else if (activeTab === "content") loadContent();
    else if (activeTab === "pulses") loadPulses();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "pulses") loadPulses();
  }, [pulseFilter]);

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
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
          { id: "users", icon: Users, label: "Users" },
          { id: "pulses", icon: Zap, label: "Pulse Hub" },
          { id: "content", icon: Database, label: "Resources" },
          { id: "challenges", icon: Trophy, label: "Daily Ops" },
          { id: "reported", icon: ShieldAlert, label: "Queue" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition text-[13px] font-bold whitespace-nowrap border-2
              ${activeTab === tab.id 
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
                : "bg-white/5 text-text-muted border-transparent hover:bg-white/10 hover:text-white"
              }`}
          >
            <tab.icon size={18} />
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

        {/* CHALLENGES MANAGER */}
        {activeTab === "challenges" && (
          <ChallengesManager />
        )}

        {/* PULSE MODERATION */}
        {activeTab === "pulses" && (
          <div className="space-y-6 fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Pulse Moderation Hub</h2>
                <p className="text-xs text-text-muted">Review, restore, or remove community-flagged pulses.</p>
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                {["all", "reported", "hidden", "downvoted"].map(f => (
                  <button
                    key={f}
                    onClick={() => setPulseFilter(f)}
                    className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${pulseFilter === f ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-text-muted hover:text-white"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="columns-1 md:columns-2 xl:columns-3 2xl:columns-4 gap-6">
               {pulses.map(pulse => (
                 <PulseModerationCard 
                   key={pulse._id} 
                   pulse={pulse} 
                   onRefresh={loadPulses} 
                 />
               ))}
               {pulses.length === 0 && (
                 <p className="col-span-full text-center py-20 text-gray-500 glass rounded-2xl border border-white/5">
                   No pulses found in this category.
                 </p>
               )}
            </div>
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
              <ShieldAlert /> Priority Report Queue
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <UniversalReportCard key={report._id} report={report} onRefresh={loadReports} />
              ))}
              {reports.length === 0 && (
                <p className="text-gray-400 py-10 text-center glass rounded-2xl border border-white/5">
                   No active reports. The campus is peaceful. 🕊
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
};

export default AdminPanel;