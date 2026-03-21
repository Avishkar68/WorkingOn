import React from "react";
import api from "../../api/axios";

const ReportedPostCard = ({ post }) => {

  const deletePost = async () => {
    await api.delete(`/admin/post/${post._id}`);
    window.location.reload();
  };

  const pinPost = async () => {
    await api.post(`/admin/pin-post/${post._id}`);
    alert("Post pinned");
  };

  return (
    <div className="glass p-5 rounded-2xl space-y-4 border border-red-500/30">

      <div className="flex items-center gap-3">

        <img
          src={post.author.profileImage}
          className="w-10 h-10 rounded-full object-cover"
        />

        <p className="font-semibold text-white">
          {post.author.name}
        </p>

        <span className="text-xs bg-red-500/80 text-white px-2 py-1 rounded-full">
          Reported
        </span>

      </div>

      <p className="text-gray-300 text-sm">
        {post.content}
      </p>

      <div className="flex gap-3">

        <button
          onClick={pinPost}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-gray-300"
        >
          📌 Pin
        </button>

        <button className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded">
          ⚠ Warn
        </button>

        <button
          onClick={deletePost}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🗑 Delete
        </button>

      </div>

    </div>
  );
};

export default ReportedPostCard;