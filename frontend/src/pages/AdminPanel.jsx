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

  // Action logs states
  const [logs, setLogs] = useState([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPages, setLogsPages] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const [logsSearch, setLogsSearch] = useState("");
  const [logsAction, setLogsAction] = useState("ALL");
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState(null);

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

  const loadLogs = async () => {
    setIsLogsLoading(true);
    try {
      const res = await api.get(`/admin/logs?page=${logsPage}&limit=15&action=${logsAction}&search=${logsSearch}`);
      setLogs(res.data.logs);
      setLogsTotal(res.data.total);
      setLogsPages(res.data.pages);
    } catch(err) { console.error(err) }
    finally { setIsLogsLoading(false) }
  };

  useEffect(() => {
    if (activeTab === "dashboard") loadStats();
    else if (activeTab === "reported") loadReports();
    else if (activeTab === "users") loadUsers();
    else if (activeTab === "content") loadContent();
    else if (activeTab === "pulses") loadPulses();
    else if (activeTab === "logs") loadLogs();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "logs") loadLogs();
  }, [logsPage, logsAction, logsSearch]);

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
      <div className="flex items-center gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
          { id: "users", icon: Users, label: "Users" },
          { id: "pulses", icon: Zap, label: "Pulse Hub" },
          { id: "content", icon: Database, label: "Resources" },
          { id: "challenges", icon: Trophy, label: "Daily Ops" },
          { id: "reported", icon: ShieldAlert, label: "Queue" },
          { id: "logs", icon: Server, label: "Action Logs" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition text-[12px] sm:text-[13px] font-bold whitespace-nowrap border-2
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

        {/* ACTION LOGS */}
        {activeTab === "logs" && (
          <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">System Action Logs</h2>
                <p className="text-xs text-text-muted">Real-time audit trail of user activities across the platform.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={logsSearch}
                    onChange={(e) => {
                      setLogsSearch(e.target.value);
                      setLogsPage(1);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                {/* Filter */}
                <select
                  value={logsAction}
                  onChange={(e) => {
                    setLogsAction(e.target.value);
                    setLogsPage(1);
                  }}
                  className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-text-muted focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                >
                  {[
                    "ALL",
                    "USER_REGISTER",
                    "USER_LOGIN",
                    "CREATE_POST",
                    "LIKE_POST",
                    "UNLIKE_POST",
                    "REPORT_POST",
                    "DELETE_POST",
                    "CREATE_COMMENT",
                    "LIKE_COMMENT",
                    "DELETE_COMMENT",
                    "FOLLOW_USER",
                    "UNFOLLOW_USER",
                    "CREATE_COMMUNITY",
                    "JOIN_COMMUNITY",
                    "LEAVE_COMMUNITY",
                    "CREATE_EVENT",
                    "REGISTER_EVENT",
                    "CANCEL_EVENT",
                    "CREATE_PROJECT",
                    "REQUEST_JOIN_PROJECT",
                    "ACCEPT_PROJECT_JOIN",
                    "REJECT_PROJECT_JOIN",
                    "LEAVE_PROJECT",
                    "CREATE_PULSE",
                    "REACT_PULSE",
                    "VOTE_PULSE_POLL",
                    "VOTE_PULSE_POST",
                    "COMPLETE_DAILY_CHALLENGE",
                    "UPDATE_PROFILE"
                  ].map((act) => (
                    <option key={act} value={act} className="bg-[#1a1b26] text-white">
                      {act.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-text-muted">
                      <th className="py-4 px-6">Timestamp</th>
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Action</th>
                      <th className="py-4 px-6">Description</th>
                      <th className="py-4 px-6">Client Info</th>
                      <th className="py-4 px-6 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[13px]">
                    {isLogsLoading ? (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-text-muted">
                          <span className="inline-block animate-pulse">Loading action logs...</span>
                        </td>
                      </tr>
                    ) : logs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-text-muted">
                          No action logs found.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log._id} className="hover:bg-white/[0.02] transition">
                          <td className="py-4 px-6 text-text-muted whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit"
                            })}
                          </td>
                          <td className="py-4 px-6 font-semibold text-white whitespace-nowrap">
                            {log.userName}
                            <span className="block text-[10px] text-text-muted font-normal">{log.userId}</span>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase
                              ${log.action.startsWith("CREATE") || log.action.startsWith("USER_REGISTER")
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : log.action.startsWith("DELETE") || log.action.includes("REJECT")
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  : log.action.includes("LOGIN") || log.action.includes("UPDATE")
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {log.action.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-text-secondary">{log.description}</td>
                          <td className="py-4 px-6 text-text-muted whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis" title={log.userAgent}>
                            <span className="font-mono block text-[11px]">{log.ipAddress}</span>
                            <span className="text-[10px] block opacity-60 truncate">{log.userAgent}</span>
                          </td>
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedMetadata(log.metadata)}
                              disabled={!log.metadata || Object.keys(log.metadata).length === 0}
                              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-bold text-white rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed border border-white/5"
                            >
                              View Meta
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {logsPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/5 py-4 px-6 bg-white/[0.01]">
                  <span className="text-xs text-text-muted">
                    Showing page {logsPage} of {logsPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLogsPage((prev) => Math.max(prev - 1, 1))}
                      disabled={logsPage === 1}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed border border-white/5"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setLogsPage((prev) => Math.min(prev + 1, logsPages))}
                      disabled={logsPage === logsPages}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed border border-white/5"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal for Metadata */}
            {selectedMetadata && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="glass w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh]">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">Action Metadata Details</h3>
                    <button
                      onClick={() => setSelectedMetadata(null)}
                      className="text-text-muted hover:text-white text-sm font-bold bg-white/5 hover:bg-white/10 px-3 py-1 rounded-xl transition border border-white/5"
                    >
                      Close
                    </button>
                  </div>
                  <div className="py-4 overflow-y-auto flex-1 font-mono text-xs text-indigo-300 bg-black/40 rounded-xl p-4 my-4">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedMetadata, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </PageShell>
  );
};

export default AdminPanel;