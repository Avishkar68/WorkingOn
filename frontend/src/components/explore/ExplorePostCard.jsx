export default function ExplorePostCard({ post }) {
  const formatDate = (date) => {
    const d = new Date(date);

    return d.toLocaleDateString();
  };

  const sharePost = () => {
    const url = `${window.location.origin}/post/${post._id}`;

    navigator.clipboard.writeText(url);

    alert("Post link copied!");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      {/* AUTHOR */}

      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
  
              {post.author?.name?.[0]}
  
            </div> */}

          {post.author?.profileImage ? (
            <img
              src={post.author.profileImage}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              {post.author?.name?.[0]}
            </div>
          )}

          <div>
            <p className="font-semibold">{post.author?.name}</p>

            <p className="text-xs text-gray-500">CSE • Year 3</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <p className="text-gray-700">{post.content}</p>

      {/* IMAGE */}

      {post.image && <img src={post.image} className="rounded-lg w-full" />}

      {/* TAGS */}

      <div className="flex gap-2 flex-wrap">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-sm px-3 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* DATE */}

      <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>

      <div className="border-t pt-4 flex justify-between">
        <div className="flex gap-6 text-sm text-gray-600">
          <span>❤️ {post.likeCount}</span>

          <span>💬 {post.commentCount}</span>
        </div>

        <button onClick={sharePost} className="text-sm text-gray-600">
          Share
        </button>
      </div>
    </div>
  );
}
