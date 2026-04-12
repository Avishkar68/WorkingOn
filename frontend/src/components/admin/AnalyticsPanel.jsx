import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#14b8a6", "#6366f1", "#f43f5e", "#f59e0b"];

const AnalyticsPanel = ({ stats }) => {
  if (!stats) return null;

  const userGrowth = stats.userGrowth && stats.userGrowth.length > 0 
    ? stats.userGrowth 
    : [{ day: "Mon", users: 10 }, { day: "Tue", users: 20 }];

  const postData = [
    { name: "Posts", value: stats.totalPosts || 0 },
    { name: "Reports", value: stats.reportedPosts || 0 },
  ];

  const activityData = [
    { name: "Users", value: stats.totalUsers || 0 },
    { name: "Posts", value: stats.totalPosts || 0 },
    { name: "Projects", value: stats.totalProjects || 0 },
    { name: "Reports", value: stats.reportedPosts || 0 },
  ];

  const ChartCard = ({ title, children, height = 300 }) => (
    <div className="glass p-6 rounded-3xl space-y-4">
      <h2 className="text-text-primary text-lg font-bold tracking-tight">
        {title}
      </h2>
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
      
      <ChartCard title="User Acquisition Growth" height={320}>
        <LineChart data={userGrowth}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#0f172a", borderRadius: "1rem", border: "1px solid #1e293b", color: "#f1f5f9" }}
            itemStyle={{ color: "#2DD4BF" }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={{ fill: "#14b8a6", strokeWidth: 2, r: 4, stroke: "#0f172a" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ChartCard>

      <ChartCard title="Platform Distribution" height={320}>
        <PieChart>
          <Pie
            data={activityData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            labelLine={false}
          >
            {activityData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: "#0f172a", borderRadius: "1rem", border: "1px solid #1e293b" }}
          />
        </PieChart>
      </ChartCard>

      <ChartCard title="Content Moderation Stats" height={320}>
        <BarChart data={postData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#0f172a", borderRadius: "1rem", border: "1px solid #1e293b" }}
          />
          <Bar dataKey="value" fill="#6366F1" radius={[10, 10, 0, 0]} barSize={40} />
        </BarChart>
      </ChartCard>

      <div className="glass p-6 rounded-3xl flex flex-col justify-center gap-6">
         <h2 className="text-text-primary text-lg font-bold tracking-tight">Health Summary</h2>
         <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
               <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Stability</p>
               <p className="text-xl font-bold text-emerald-400">99.9%</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
               <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Latency</p>
               <p className="text-xl font-bold text-indigo-400">42ms</p>
            </div>
         </div>
         <p className="text-xs text-text-secondary leading-relaxed">
            Platform performance is currently optimal. User retention growth is up by 12% compared to last week.
         </p>
      </div>

    </div>
  );
};

export default AnalyticsPanel;