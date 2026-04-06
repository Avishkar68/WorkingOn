import { Heart, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { cardHover, fadeInUp } from "../../lib/motion"

export default function SearchPostCard({post}){

  const formatDate = (date)=>{
    return new Date(date).toLocaleDateString()
  }

  return(

    <motion.div
      className="card-hover glass rounded-2xl p-6 space-y-4"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={cardHover}
    >

      {/* AUTHOR */}
      <div className="flex items-center gap-3">

        <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center">
          {post.author?.name?.[0]}
        </div>

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
      <p className="text-gray-300 text-sm break-words">
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
        {post.tags?.slice(0,6).map(tag => (
          <span
            key={tag}
            className="bg-white/10 px-3 py-1 text-xs rounded-full text-gray-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* DATE */}
      <p className="text-xs text-gray-500">
        {formatDate(post.createdAt)}
      </p>

      {/* ACTIONS */}
      <div className="flex justify-between border-t border-white/10 pt-3 text-sm text-gray-400">

        <span className="hover:text-indigo-400 transition flex gap-2">
          <Heart
              size={18}
            /> {post.likeCount || 0}
        </span>

        <span className="hover:text-indigo-400 transition flex gap-2">
          
            <MessageCircle size={18} />Comment {post.commentCount || 0}
        </span>

        <span className="hover:text-indigo-400 cursor-pointer transition">
          Share
        </span>

      </div>

    </motion.div>
  )
}