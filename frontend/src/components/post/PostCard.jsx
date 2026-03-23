import { useState } from "react"
import api from "../../api/axios"
import CommentSection from "./CommentSection"
import { useNavigate } from "react-router-dom"
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react"
import { jwtDecode } from "jwt-decode"

export default function PostCard({ post, refreshFeed }) {

  const navigate = useNavigate()

  const [showComments,setShowComments] = useState(false)
  const [loading,setLoading] = useState(false)

  // ✅ GET CURRENT USER
  const token = localStorage.getItem("token")

  let currentUserId = null
  if(token){
    try{
      const decoded = jwtDecode(token)
      currentUserId = decoded.id || decoded._id
    }catch{}
  }

  // ✅ LOCAL LIKE STATE
  const [likes,setLikes] = useState(post.likes || [])

  // ✅ CHECK LIKE (handles object + string)
  const isLiked = likes.some(like => {
    if(typeof like === "object"){
      return like._id?.toString() === currentUserId?.toString()
    }
    return like?.toString() === currentUserId?.toString()
  })

  // ✅ CHECK OWNER
  const isOwner =
    post.author?._id?.toString() === currentUserId?.toString()

  // ❤️ LIKE / UNLIKE
  const handleLike = async () => {

    if(!currentUserId) return

    try{
      setLoading(true)

      if(isLiked){
        // remove locally
        setLikes(prev =>
          prev.filter(like => {
            if(typeof like === "object"){
              return like._id !== currentUserId
            }
            return like !== currentUserId
          })
        )

        await api.post(`/posts/${post._id}/unlike`)

      }else{
        // add locally
        setLikes(prev => [...prev, currentUserId])

        await api.post(`/posts/${post._id}/like`)
      }

    }catch(err){
      console.error(err)
      refreshFeed()
    }finally{
      setLoading(false)
    }
  }

  // 🔗 SHARE
  const sharePost = async () => {

    const url = `${window.location.origin}/post/${post._id}`

    try{
      await navigator.clipboard.writeText(url)
      alert("Link copied!")
    }catch{
      window.open(url,"_blank")
    }
  }

  // 🗑 DELETE
  const deletePost = async () => {

    const confirmDelete = confirm("Delete this post?")

    if(!confirmDelete) return

    try{
      await api.delete(`/posts/${post._id}`)
      refreshFeed()
    }catch(err){
      console.error(err)
    }
  }

  return (

    <div className="glass rounded-2xl p-5 space-y-4 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition">

      {/* 👤 USER */}
      <div
        onClick={() => navigate(`/user/${post.author?._id}`)}
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
      >

        {post.author?.profileImage ? (
          <img
            src={post.author.profileImage}
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
            {post.author?.branch} • Year {post.author?.year}
          </p>
        </div>

      </div>

      {/* 📝 CONTENT */}
      <p className="text-gray-300 text-sm leading-relaxed">
        {post.content}
      </p>

      {/* 🖼 IMAGE */}
      {post.image && (
        <img
          src={post.image}
          className="rounded-xl w-full border border-white/10 max-h-[400px] object-cover"
        />
      )}

      {/* 🏷 TAGS */}
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

      {/* ⚡ ACTION BAR */}
      <div className="flex justify-between border-t border-white/10 pt-3 text-sm text-gray-400">

        <div className="flex gap-6">

          {/* ❤️ LIKE */}
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-1 transition transform cursor-pointer ${
              isLiked
                ? "text-red-500 scale-105"
                : "hover:text-red-400"
            }`}
          >
            <Heart
              size={18}
              fill={isLiked ? "currentColor" : "none"}
            />
            {likes.length}
          </button>

          {/* 💬 COMMENT */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 transition"
          >
            <MessageCircle size={18} />
            Comment
          </button>

        </div>

        <div className="flex gap-4">

          {/* 🔗 SHARE */}
          <button
            onClick={sharePost}
            title="Share"
            className="hover:text-indigo-400 cursor-pointer transition"
          >
            <Share2 size={18} />
          </button>

          {/* 🗑 DELETE ONLY OWNER */}
          {isOwner && (
            <button
              onClick={deletePost}
              title="Delete"
              className="hover:text-red-400 transition"
            >
              <Trash2 size={18} />
            </button>
          )}

        </div>

      </div>

      {/* 💬 COMMENTS */}
      {showComments && (
        <CommentSection postId={post._id}/>
      )}

    </div>
  )
}