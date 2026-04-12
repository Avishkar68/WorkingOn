import { Users, FileText, FolderKanban, ShieldAlert } from "lucide-react";

const AdminStats = ({ stats }) => {
  const statItems = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-brand-400", bg: "bg-brand-500/10" },
    { label: "Platform Posts", value: stats.totalPosts, icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Active Projects", value: stats.totalProjects, icon: FolderKanban, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Reported Content", value: stats.reportedPosts, icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="glass p-6 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-1 opacity-70">
                {item.label}
              </p>
              <p className={`text-3xl font-bold ${item.color} tracking-tight`}>
                {item.value || 0}
              </p>
            </div>
            <div className={`p-3 rounded-2xl ${item.bg} ${item.color} transition-transform group-hover:scale-110 duration-300`}>
              <item.icon size={24} />
            </div>
          </div>
          
          {/* Subtle background glow */}
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${item.bg} rounded-full blur-3xl opacity-50`} />
        </div>
      ))}
    </div>
  );
};

export default AdminStats;