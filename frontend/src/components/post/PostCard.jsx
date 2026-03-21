import { useState } from "react"
import api from "../../api/axios"
import CommentSection from "./CommentSection"

export default function PostCard({ post, refreshFeed }) {

  const [showComments,setShowComments] = useState(false)

  const likePost = async () => {
    try {
      await api.post(`/posts/${post._id}/like`)
      refreshFeed()
    } catch(err){
      console.error(err)
    }
  }

  const deletePost = async () => {
    try{
      await api.delete(`/posts/${post._id}`)
      refreshFeed()
    }catch(err){
      console.error(err)
    }
  }

  return (

    <div className="glass rounded-2xl p-5 space-y-4 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition">

      {/* USER */}
      <div className="flex items-center gap-3">

        {post.author?.profileImage ? (
          <img
            src={post.author.profileImage}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
            {post.author?.name?.[0]}
          </div>
        )}

        <div>
          <p className="font-semibold text-white">
            {post.author?.name}
          </p>

          <p className="text-xs text-gray-400">
            {post.author?.branch} • Year {post.author?.year}
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <p className="text-gray-300 text-sm leading-relaxed">
        {post.content}
      </p>

      {/* IMAGE */}
      {post.image && (
        <img
          src={post.image}
          className="rounded-xl w-full border border-white/10"
        />
      )}

      {/* TAGS */}
      <div className="flex gap-2 flex-wrap">
        {post.tags?.map(tag => (
          <span
            key={tag}
            className="bg-white/10 text-xs px-3 py-1 rounded-full text-gray-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-6 text-sm border-t border-white/10 pt-3 text-gray-400">

        <button
          onClick={likePost}
          className="hover:text-indigo-400 transition"
        >
          👍 {post.likes?.length || 0}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-indigo-400 transition"
        >
          💬 Comment
        </button>

        <button
          onClick={deletePost}
          className="hover:text-red-400 transition"
        >
          🗑 Delete
        </button>

      </div>

      {/* COMMENTS */}
      {showComments && (
        <CommentSection postId={post._id}/>
      )}

    </div>
  )
}