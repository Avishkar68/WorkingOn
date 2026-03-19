import React from "react";

const AdminStats = ({ stats }) => {

  return (
    <div className="grid grid-cols-3 gap-4">

      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="text-3xl font-bold text-purple-600">
          {stats.totalUsers}
        </p>
        <p className="text-gray-500 text-sm">Active Users</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="text-3xl font-bold text-blue-600">
          {stats.totalPosts}
        </p>
        <p className="text-gray-500 text-sm">Total Posts</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow text-center">
        <p className="text-3xl font-bold text-red-600">
          {stats.reportedPosts}
        </p>
        <p className="text-gray-500 text-sm">Reported Posts</p>
      </div>

    </div>
  );
};

export default AdminStats;