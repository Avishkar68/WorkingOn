import React from "react";
import api from "../../api/axios";

const UserRow = ({ user }) => {

  const toggleBan = async () => {

    if(user.isBanned){
      await api.post(`/admin/unban-user/${user._id}`);
    }else{
      await api.post(`/admin/ban-user/${user._id}`);
    }

    window.location.reload();
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

      </div>

      <div className="flex items-center gap-3">

        <span className={`text-xs px-2 py-1 rounded 
        ${user.isBanned ? "bg-red-500 text-white" : "bg-gray-200"}`}>
          {user.isBanned ? "flagged" : "active"}
        </span>

        <button
          onClick={toggleBan}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          {user.isBanned ? "Unban" : "Ban"}
        </button>

      </div>

    </div>
  );
};

export default UserRow;