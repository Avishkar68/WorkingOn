import { useState } from "react"
import api from "../../api/axios"
import CommentSection from "./CommentSection"
import { useNavigate, Link } from "react-router-dom"
import { Heart, MessageCircle, Share2, Trash2, ShieldAlert } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import ReportModal from "../common/ReportModal"
import { motion } from "framer-motion"
import { buttonTap, cardHover, fadeInUp } from "../../lib/motion"
import toast from "react-hot-toast"
import ConfirmationModal from "../common/ConfirmationModal"

export default function PostCard({ post, refreshFeed }) {

  const navigate = useNavigate()

  const [showComments,setShowComments] = useState(false)
  const [loading,setLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  // ✅ CHECK LIKE (handles object + string)
  const isLiked = likes.some(like => {
    if(typeof like === "object"){
      return like._id?.toString() === currentUserId?.toString()
    }
    return like?.toString() === currentUserId?.toString()
  })

  // ✅ CHECK OWNER
  const isOwner =
    (post.author?._id || post.author)?.toString() === currentUserId?.toString()

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

    const url = `${window.location.origin}/posts/${post._id}`

    try{
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }catch{
      window.open(url,"_blank")
    }
  }

  // 🗑 DELETE
  const handleDeletePost = async () => {
    try{
      await api.delete(`/posts/${post._id}`)
      toast.success("Post deleted!")
      refreshFeed()
      setShowDeleteConfirm(false)
    }catch(err){
      console.error(err)
      toast.error("Failed to delete post")
    }
  }

  return (

    <motion.div
      className="glass-card p-5 space-y-4"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      whileHover={cardHover}
    >

      {/* 👤 USER */}
      <Link
        to={`/user/${post.author?._id}`}
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition group/author"
      >
        {post.author?.profileImage ? (
          <img
            src={post.author.profileImage}
            className="w-10 h-10 rounded-full object-cover border border-white/5 ring-2 ring-transparent group-hover/author:ring-indigo-500/30 transition-all"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
            {post.author?.name?.[0]}
          </div>
        )}

        <div>
          <p className="font-semibold text-white group-hover/author:text-indigo-300 transition-colors">
            {post.author?.name}
          </p>

          <p className="text-xs text-gray-400">
            {post.author?.branch} • Year {post.author?.year}
          </p>
        </div>
      </Link>

      {/* 📝 CONTENT */}
      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
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
        {post.tags?.flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean).map(tag => (
          <span
            key={tag}
            className="pill-badge"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* ⚡ ACTION BAR */}
      <div className="flex justify-between border-t border-white/10 pt-3 text-sm text-gray-400">

        <div className="flex gap-6">

          {/* ❤️ LIKE */}
          <motion.button
            onClick={handleLike}
            disabled={loading}
            whileTap={buttonTap}
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
          </motion.button>

          {/* 💬 COMMENT */}
          <motion.button
            onClick={() => setShowComments(!showComments)}
            whileTap={buttonTap}
            className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 transition"
          >
            <MessageCircle size={18} />
            Comment
          </motion.button>

        </div>

        <div className="flex gap-4">

          {/* 🔗 SHARE */}
          <motion.button
            onClick={sharePost}
            title="Share"
            whileTap={buttonTap}
            className="hover:text-indigo-400 cursor-pointer transition"
          >
            <Share2 size={18} />
          </motion.button>

          {/* 🗑 DELETE ONLY OWNER */}
          {isOwner ? (
            <motion.button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete"
              whileTap={buttonTap}
              className="hover:text-red-400 transition"
            >
              <Trash2 size={18} />
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setShowReport(true)}
              title="Report Post"
              whileTap={buttonTap}
              className="hover:text-red-400 transition"
            >
              <ShieldAlert size={18} />
            </motion.button>
          )}

        </div>

      </div>

      {showReport && (
        <ReportModal
          entityId={post._id}
          entityModel="Post"
          reportedUserId={post.author?._id}
          snapshot={`[POST by ${post.author?.name}] ${post.content}`}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* 💬 COMMENTS */}
      {showComments && (
        <CommentSection postId={post._id}/>
      )}

      {/* 🗑 DELETE CONFIRM */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Confirm Delete"
      />
    </motion.div>
  )
}