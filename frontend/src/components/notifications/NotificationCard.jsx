import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { buttonTap, cardHover, fadeInUp } from "../../lib/motion"
import { Trash2 } from "lucide-react";

const NotificationCard = ({
  notification,
  onRead,
  onDelete,
  onAccept,
  onReject,
  loading
}) => {

  const isJoinRequest = notification.type === "joinRequest"

  return (
    <motion.div
      className={`glass-card p-4 flex items-center justify-between transition
      ${!notification.read ? "border-indigo-500/30" : ""}`}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={cardHover}
    >

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Link to={`/user/${notification.sender?._id}`}>
          <img
            src={notification.sender?.profileImage || "https://ui-avatars.com/api/?name=User"}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition"
          />
        </Link>

        <div>
           <Link to={`/user/${notification.sender?._id}`} className="hover:text-indigo-400 transition-colors">
              <p className="font-semibold text-white">
                {notification.sender?.name}
              </p>
           </Link>

          <p className="text-gray-300 text-sm">

            {notification.type === "joinAccepted" && (
              <>
                ✅ Accepted in{" "}
                <span className="font-semibold text-indigo-400">
                  {notification.relatedId?.title}
                </span>
                <br />
                {notification.message}
              </>
            )}

            {notification.type === "joinRejected" && (
              <>
                ❌ Rejected from{" "}
                <span className="font-semibold text-indigo-400">
                  {notification.relatedId?.title}
                </span>
              </>
            )}

            {notification.type === "joinRequest" && (
              <>
                requested to join your project{" "}
                <span className="font-semibold text-indigo-400">
                  {notification.relatedId?.title}
                </span>
              </>
            )}

            {!["joinAccepted", "joinRejected", "joinRequest"].includes(notification.type) &&
              notification.message}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>

          {/* ACTION BUTTONS */}
          {isJoinRequest && !notification.read && (
            <div className="flex gap-2 mt-3">

              <motion.button
                disabled={loading}
                onClick={() => onAccept(notification)}
                whileTap={buttonTap}
                className="px-3 py-1 rounded-lg bg-green-500/80 hover:bg-green-500 text-white text-sm disabled:opacity-50"
              >
                Accept
              </motion.button>

              <motion.button
                disabled={loading}
                onClick={() => onReject(notification)}
                whileTap={buttonTap}
                className="px-3 py-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm disabled:opacity-50"
              >
                Reject
              </motion.button>

            </div>
          )}

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-2">

        {!notification.read && (
          <motion.button
            onClick={() => onRead(notification._id)}
            whileTap={buttonTap}
            className="text-indigo-400 text-sm hover:underline"
          >
            Mark read
          </motion.button>
        )}

        <motion.button
          onClick={() => onDelete(notification._id)}
          whileTap={buttonTap}
          className="text-red-400 hover:text-red-500 text-lg"
        >
            <Trash2 size={18} />

        </motion.button>

      </div>

    </motion.div>
  )
}

export default NotificationCard