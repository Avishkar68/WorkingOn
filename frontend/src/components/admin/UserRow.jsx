import api from "../../api/axios";
import toast from "react-hot-toast";

const UserRow = ({ user, onRefresh }) => {

  const toggleBan = async () => {

    try {
      if(user.isBanned){
        await api.post(`/admin/unban-user/${user._id}`);
        toast.success("User unbanned");
      }else{
        await api.post(`/admin/ban-user/${user._id}`);
        toast.success("User banned");
      }

      if (onRefresh) onRefresh();
    } catch(err) {
      toast.error("Action failed");
    }
  };

  const deleteUser = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ${user.name}? This cannot be undone.`)) return;

    try {
      await api.delete(`/admin/user/${user._id}`);
      toast.success("User permanently deleted!");
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="glass p-4 rounded-2xl flex items-center justify-between">

      <div className="flex items-center gap-3">

        {user.profileImage ? (
          <img
            src={user.profileImage}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center">
            {user.name?.[0]}
          </div>
        )}

        <div>
          <p className="text-white font-semibold">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>

      </div>

      <div className="flex items-center gap-3">

        <span className={`text-xs px-2 py-1 rounded-full ${
          user.isBanned
            ? "bg-red-500/80 text-white"
            : "bg-white/10 text-gray-300"
        }`}>
          {user.isBanned ? "flagged" : "active"}
        </span>

        <button
          onClick={toggleBan}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-gray-300"
        >
          {user.isBanned ? "Unban" : "Ban"}
        </button>

        <button
          onClick={deleteUser}
          className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition"
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default UserRow;