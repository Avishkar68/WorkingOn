export default function ExplorePostCard({ post }) {

  const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString()
  }

  const sharePost = () => {
    const url = `${window.location.origin}/post/${post._id}`
    navigator.clipboard.writeText(url)
    alert("Post link copied!")
  }

  return (

    <div className="glass rounded-2xl p-6 space-y-4 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          {post.author?.profileImage ? (
            <img
              src={post.author.profileImage}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              {post.author?.name?.[0]}
            </div>
          )}

          <div>
            <p className="font-semibold text-white">
              {post.author?.name}
            </p>

            <p className="text-xs text-gray-400">
              {formatDate(post.createdAt)}
            </p>
          </div>

        </div>

      </div>

      {/* CONTENT */}
      <p className="text-gray-300 text-sm leading-relaxed break-words">
        {post.content}
      </p>

      {/* IMAGE */}
      {post.image && (
        <img
          src={post.image}
          className="rounded-xl w-full border border-white/10 max-h-[400px] object-cover"
        />
      )}

      {/* TAGS */}
      <div className="flex gap-2 flex-wrap">
        {post.tags?.slice(0,6).map((tag) => (
          <span
            key={tag}
            className="bg-white/10 text-xs px-3 py-1 rounded-full text-gray-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* ACTION BAR */}
      <div className="border-t border-white/10 pt-4 flex justify-between items-center text-sm text-gray-400">

        <div className="flex gap-6">
          <span className="hover:text-indigo-400 transition">
            ❤️ {post.likeCount || 0}
          </span>

          <span className="hover:text-indigo-400 transition">
            💬 {post.commentCount || 0}
          </span>
        </div>

        <button
          onClick={sharePost}
          className="hover:text-indigo-400 transition"
        >
          Share
        </button>

      </div>

    </div>
  )
}