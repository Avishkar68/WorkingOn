import React from "react";

const AnalyticsPanel = ({ stats }) => {

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Platform Overview
      </h2>

      <div className="space-y-2">

        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Posts: {stats.totalPosts}</p>
        <p>Projects: {stats.totalProjects}</p>
        <p>Events: {stats.totalEvents}</p>
        <p>Opportunities: {stats.totalOpportunities}</p>

        <p className="text-red-600">
          Reported Posts: {stats.reportedPosts}
        </p>

      </div>

    </div>
  );
};

export default AnalyticsPanel;