// const AnalyticsPanel = ({ stats }) => {

//   return (
//     <div className="glass p-6 rounded-2xl space-y-4">

//       <h2 className="font-semibold text-white">
//         Platform Overview
//       </h2>

//       <div className="space-y-2 text-gray-300 text-sm">

//         <p>Total Users: {stats.totalUsers}</p>
//         <p>Total Posts: {stats.totalPosts}</p>
//         <p>Projects: {stats.totalProjects}</p>
//         <p>Events: {stats.totalEvents}</p>
//         <p>Opportunities: {stats.totalOpportunities}</p>

//         <p className="text-red-400">
//           Reported Posts: {stats.reportedPosts}
//         </p>

//       </div>

//     </div>
//   );
// };

// export default AnalyticsPanel;


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

const COLORS = ["#2DD4BF", "#6366F1", "#F43F5E"];

const AnalyticsPanel = ({ stats }) => {
  if (!stats) return null;

  // fallback dummy data if backend doesn't provide
  const userGrowth = stats.userGrowth || [
    { day: "Mon", users: 20 },
    { day: "Tue", users: 40 },
    { day: "Wed", users: 35 },
    { day: "Thu", users: 60 },
    { day: "Fri", users: 80 },
  ];

  const postData = [
    { name: "Posts", value: stats.totalPosts || 0 },
    { name: "Reports", value: stats.reportedPosts || 0 },
  ];

  const activityData = [
    { name: "Users", value: stats.totalUsers || 0 },
    { name: "Posts", value: stats.totalPosts || 0 },
    { name: "Reports", value: stats.reportedPosts || 0 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* USER GROWTH */}
      <div className="glass p-4 rounded-2xl">
        <h2 className="text-white mb-3 text-lg font-semibold">
          User Growth
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#2DD4BF"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* POSTS VS REPORTS */}
      <div className="glass p-4 rounded-2xl">
        <h2 className="text-white mb-3 text-lg font-semibold">
          Posts vs Reports
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={postData}>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ACTIVITY PIE */}
      <div className="glass p-4 rounded-2xl md:col-span-2">
        <h2 className="text-white mb-3 text-lg font-semibold">
          Platform Activity
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={activityData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {activityData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default AnalyticsPanel;