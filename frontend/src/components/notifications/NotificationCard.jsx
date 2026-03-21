import React from "react"

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
    <div
      className={`glass p-4 rounded-2xl flex items-center justify-between transition hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]
      ${!notification.read ? "border border-indigo-500/30" : ""}`}
    >

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <img
          src={notification.sender?.profileImage || "https://ui-avatars.com/api/?name=User"}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>

          <p className="font-semibold text-white">
            {notification.sender?.name}
          </p>

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

              <button
                disabled={loading}
                onClick={() => onAccept(notification)}
                className="px-3 py-1 rounded-lg bg-green-500/80 hover:bg-green-500 text-white text-sm disabled:opacity-50"
              >
                Accept
              </button>

              <button
                disabled={loading}
                onClick={() => onReject(notification)}
                className="px-3 py-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm disabled:opacity-50"
              >
                Reject
              </button>

            </div>
          )}

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-2">

        {!notification.read && (
          <button
            onClick={() => onRead(notification._id)}
            className="text-indigo-400 text-sm hover:underline"
          >
            Mark read
          </button>
        )}

        <button
          onClick={() => onDelete(notification._id)}
          className="text-red-400 hover:text-red-500 text-lg"
        >
          🗑
        </button>

      </div>

    </div>
  )
}

export default NotificationCard