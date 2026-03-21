import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import api from "../../api/axios"
import CommentSection from "../post/CommentSection"

export default function ExplorePostCard({ post }) {

  const navigate = useNavigate()

  const [showComments,setShowComments] = useState(false)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

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

  const isLiked = likes.some(like => {
    if(typeof like === "object"){
      return like._id?.toString() === currentUserId?.toString()
    }
    return like?.toString() === currentUserId?.toString()
  })

  // ❤️ LIKE / UNLIKE
  const handleLike = async (e) => {
    e.stopPropagation() // ✅ prevent card click conflict

    if(!currentUserId) return

    try{
      if(isLiked){
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
        setLikes(prev => [...prev, currentUserId])
        await api.post(`/posts/${post._id}/like`)
      }
    }catch(err){
      console.error(err)
    }
  }

  // 💬 TOGGLE COMMENTS
  const toggleComments = (e) => {
    e.stopPropagation()
    setShowComments(prev => !prev)
  }

  // 🔗 SHARE
  const sharePost = async (e) => {
    e.stopPropagation()

    const url = `${window.location.origin}/post/${post._id}`

    try{
      await navigator.clipboard.writeText(url)
      alert("Link copied!")
    }catch{
      window.open(url,"_blank")
    }
  }

  return (

    <div className="glass rounded-2xl p-6 space-y-4 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition">

      {/* HEADER */}
      <div
        onClick={() => navigate(`/user/${post.author?._id}`)}
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
      >

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

          {/* ❤️ LIKE */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition ${
              isLiked ? "text-red-500 scale-105" : "hover:text-red-400"
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            {likes.length}
          </button>

          {/* 💬 COMMENT */}
          <button
            onClick={toggleComments}
            className="flex items-center gap-1 hover:text-indigo-400 transition"
          >
            <MessageCircle size={18} />
            {post.commentCount || 0}
          </button>

        </div>

        {/* 🔗 SHARE */}
        <button
          onClick={sharePost}
          className="flex items-center gap-1 hover:text-indigo-400 transition"
        >
          <Share2 size={18} />
        </button>

      </div>

      {/* 💬 COMMENTS SECTION */}
      {showComments && (
        <CommentSection postId={post._id}/>
      )}

    </div>
  )
}