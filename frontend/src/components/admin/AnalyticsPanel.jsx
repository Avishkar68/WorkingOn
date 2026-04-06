const AnalyticsPanel = ({ stats }) => {

  return (
    <div className="glass p-6 rounded-2xl space-y-4">

      <h2 className="font-semibold text-white">
        Platform Overview
      </h2>

      <div className="space-y-2 text-gray-300 text-sm">

        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Posts: {stats.totalPosts}</p>
        <p>Projects: {stats.totalProjects}</p>
        <p>Events: {stats.totalEvents}</p>
        <p>Opportunities: {stats.totalOpportunities}</p>

        <p className="text-red-400">
          Reported Posts: {stats.reportedPosts}
        </p>

      </div>

    </div>
  );
};

export default AnalyticsPanel;