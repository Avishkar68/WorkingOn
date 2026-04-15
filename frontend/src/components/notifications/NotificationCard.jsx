import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { buttonTap, cardHover, fadeInUp } from "../../lib/motion"
import { Trash2, CheckCircle2, XCircle } from "lucide-react";

const NotificationCard = ({
  notification,
  onRead,
  onDelete,
  onAccept,
  onReject,
  loading
}) => {
  const isJoinRequest = notification.type === "joinRequest";

  return (
    <motion.div
      className={`glass-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all
      ${!notification.read ? "border-l-4 border-l-indigo-500 bg-indigo-500/5" : "border-white/5"}`}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      whileHover={cardHover}
    >
      {/* LEFT: CONTENT AREA */}
      <div className="flex items-start gap-4">
        <Link to={`/user/${notification.sender?._id}`} className="shrink-0">
          <img
            src={notification.sender?.profileImage || "https://ui-avatars.com/api/?name=User"}
            alt="avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/10"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/user/${notification.sender?._id}`} className="hover:text-indigo-400 transition-colors inline-block">
            <p className="font-bold text-white text-sm sm:text-base truncate">
              {notification.sender?.name || "Unknown User"}
            </p>
          </Link>

          <div className="text-gray-300 text-sm leading-relaxed mt-0.5">
            {notification.type === "joinAccepted" && (
              <p>
                <span className="text-green-400 font-medium">Accepted</span> in{" "}
                <span className="font-semibold text-indigo-400">{notification.relatedId?.title}</span>
                <span className="block mt-1 text-xs italic text-gray-400">"{notification.message}"</span>
              </p>
            )}

            {notification.type === "joinRejected" && (
              <p>
                <span className="text-red-400 font-medium">Rejected</span> from{" "}
                <span className="font-semibold text-indigo-400">{notification.relatedId?.title}</span>
              </p>
            )}

            {notification.type === "joinRequest" && (
              <p>
                requested to join <span className="font-semibold text-indigo-400">{notification.relatedId?.title}</span>
              </p>
            )}

            {!["joinAccepted", "joinRejected", "joinRequest"].includes(notification.type) &&
              <p className="break-words">{notification.message}</p>}
          </div>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">
            {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>

          {/* MOBILE ACTIONS (Only for Requests) */}
          {isJoinRequest && !notification.read && (
            <div className="flex gap-2 mt-4 sm:hidden">
              <button
                disabled={loading}
                onClick={() => onAccept(notification)}
                className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold"
              >
                Accept
              </button>
              <button
                disabled={loading}
                onClick={() => onReject(notification)}
                className="flex-1 py-2 rounded-lg bg-white/10 text-white text-xs font-bold"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: DESKTOP ACTIONS & UTILS */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0">

        {/* Desktop Join Buttons */}
        {isJoinRequest && !notification.read && (
          <div className="hidden sm:flex gap-2">
            <motion.button
              disabled={loading}
              onClick={() => onAccept(notification)}
              whileTap={buttonTap}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white text-xs font-semibold transition"
            >
              Accept
            </motion.button>
            <motion.button
              disabled={loading}
              onClick={() => onReject(notification)}
              whileTap={buttonTap}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition"
            >
              Reject
            </motion.button>
          </div>
        )}

        <div className="flex items-center gap-4 ml-auto sm:ml-0">
          {!notification.read && (
            <motion.button
              onClick={() => onRead(notification._id)}
              whileTap={buttonTap}
              className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition"
            >
              Mark Read
            </motion.button>
          )}

          <motion.button
            onClick={() => onDelete(notification._id)}
            whileTap={buttonTap}
            className="p-2 -mr-2 text-gray-500 hover:text-red-400 transition"
            title="Delete"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default NotificationCard