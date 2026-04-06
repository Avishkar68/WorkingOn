const AdminStats = ({ stats }) => {

  return (
    <div className="grid grid-cols-3 gap-4">

      <div className="glass p-6 rounded-2xl text-center">
        <p className="text-3xl font-bold text-indigo-400">
          {stats.totalUsers}
        </p>
        <p className="text-gray-400 text-sm">Active Users</p>
      </div>

      <div className="glass p-6 rounded-2xl text-center">
        <p className="text-3xl font-bold text-blue-400">
          {stats.totalPosts}
        </p>
        <p className="text-gray-400 text-sm">Total Posts</p>
      </div>

      <div className="glass p-6 rounded-2xl text-center">
        <p className="text-3xl font-bold text-red-400">
          {stats.reportedPosts}
        </p>
        <p className="text-gray-400 text-sm">Reported Posts</p>
      </div>

    </div>
  );
};

export default AdminStats;