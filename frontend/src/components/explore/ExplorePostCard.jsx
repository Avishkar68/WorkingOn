import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Heart, MessageCircle, Share2, ShieldAlert } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import api from "../../api/axios"
import CommentSection from "../post/CommentSection"
import toast from "react-hot-toast"
import ReportModal from "../common/ReportModal"

export default function ExplorePostCard({ post }) {

  const navigate = useNavigate()

  const [showComments,setShowComments] = useState(false)
  const [showReport, setShowReport] = useState(false)
const [expanded, setExpanded] = useState(false);
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
    }catch{
      currentUserId = null
    }
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

    const url = `${window.location.origin}/posts/${post._id}`

    try{
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }catch{
      window.open(url,"_blank")
    }
  }

  return (

    <div className="glass-card p-6 space-y-4">

      {/* HEADER */}
      <Link
        to={`/user/${post.author?._id}`}
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group/author"
      >
        {post.author?.profileImage ? (
          <img
            src={post.author.profileImage}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-white/5 ring-2 ring-transparent group-hover/author:ring-indigo-500/30 transition-all font-bold"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
            {post.author?.name?.[0]}
          </div>
        )}

        <div>
          <p className="font-semibold text-white group-hover/author:text-indigo-400 transition-colors">
            {post.author?.name}
          </p>

          <p className="text-xs text-gray-400">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </Link>

      {/* CONTENT */}
      <p
  className={`text-gray-300 text-sm leading-relaxed whitespace-pre-wrap transition-all ${
    expanded ? "" : "line-clamp-4"
  }`}
>
  {post.content}
</p>

{/* READ MORE */}
{post.content?.length > 150 && (
  <button
    onClick={() => setExpanded(!expanded)}
    className="text-indigo-400 text-xs hover:underline mt-1"
  >
    {expanded ? "Show less" : "Read more"}
  </button>
)}

      {/* IMAGE */}
      {post.image && (
        <img
          src={post.image}
          className="rounded-xl w-full border border-white/10 max-h-[400px] object-cover"
        />
      )}

      {/* TAGS */}
      <div className="flex gap-2 flex-wrap">
        {(post.tags || []).flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean).slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="pill-badge"
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

        <div className="flex gap-4">
          {/* 🔗 SHARE */}
          <button
            onClick={sharePost}
            className="flex items-center gap-1 hover:text-indigo-400 transition"
            title="Share"
          >
            <Share2 size={18} />
          </button>
          
          {/* 🚨 REPORT */}
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-1 hover:text-red-400 transition"
            title="Report"
          >
            <ShieldAlert size={18} />
          </button>
        </div>

      </div>

      {showReport && (
        <ReportModal
          entityId={post._id}
          entityModel="Post"
          reportedUserId={post.author?._id}
          snapshot={`[EXPLORE POST by ${post.author?.name}] ${post.content}`}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* 💬 COMMENTS SECTION */}
      {showComments && (
        <CommentSection postId={post._id}/>
      )}

    </div>
  )
}