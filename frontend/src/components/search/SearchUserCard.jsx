import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cardHover, fadeInUp } from "../../lib/motion"

export default function SearchUserCard({ user }) {

  return (

    <Link to={`/user/${user._id}`}>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        whileHover={cardHover}
        className="glass-card p-4  mb-2 flex items-center gap-4 cursor-pointer transition-all duration-300"
      >

        {/* AVATAR */}
        {user.profileImage ? (
          <img
            src={user.profileImage}
            className="w-12 h-12 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
            {user.name?.[0]}
          </div>
        )}

        {/* USER INFO */}
        <div className="flex-1">

          <p className="text-white font-medium">
            {user.name}
          </p>

          <p className="text-sm text-gray-400">
            {user.branch}
          </p>

        </div>

        {/* OPTIONAL RIGHT ARROW (nice UX touch) */}
        <span className="text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition">
          →
        </span>

      </motion.div>
    </Link>

  )
}