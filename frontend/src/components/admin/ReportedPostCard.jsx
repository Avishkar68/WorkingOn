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
    <div className="border border-red-400 p-4 rounded-xl">

      <div className="flex items-center gap-3 mb-3">

        <img
          src={post.author.profileImage}
          className="w-10 h-10 rounded-full"
        />

        <p className="font-semibold">
          {post.author.name}
        </p>

        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
          Reported
        </span>

      </div>

      <p className="text-gray-700 mb-3">
        {post.content}
      </p>

      <div className="flex gap-3">

        <button
          onClick={pinPost}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          📌 Pin Post
        </button>

        <button
          className="px-3 py-1 bg-yellow-200 rounded"
        >
          ⚠ Warn User
        </button>

        <button
          onClick={deletePost}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          🗑 Delete Post
        </button>

      </div>

    </div>
  );
};

export default ReportedPostCard;