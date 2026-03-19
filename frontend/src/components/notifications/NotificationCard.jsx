import React from "react"

const NotificationCard = ({ notification, onRead, onDelete, onAccept, onReject, loading }) => {

  const isJoinRequest = notification.type === "joinRequest"

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border 
      ${notification.read ? "bg-white" : "bg-blue-50 border-blue-400"}`}>

      <div className="flex items-center gap-4">

        <img
          src={notification.sender?.profileImage || "https://ui-avatars.com/api/?name=User"}
          alt="avatar"
          className="w-12 h-12 rounded-full"
        />

        <div>
          <p className="font-semibold text-gray-800">
            {notification.sender?.name}
          </p>

          <p className="text-gray-600 text-sm">
            {notification.type === "joinAccepted" && (
              <>
                ✅ Accepted in <span className="font-semibold">
                  {notification.relatedId?.title}
                </span>
                <br />
                {notification.message}
              </>
            )}

            {notification.type === "joinRejected" && (
              <>
                ❌ Rejected from <span className="font-semibold">
                  {notification.relatedId?.title}
                </span>
              </>
            )}

            {notification.type === "joinRequest" && (
              <>
                requested to join your project{" "}
                <span className="font-semibold">
                  {notification.relatedId?.title}
                </span>
              </>
            )}

            {!["joinAccepted", "joinRejected", "joinRequest"].includes(notification.type) && (
              notification.message
            )}
          </p>

          <p className="text-xs text-gray-400">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>

          {/* 🔥 ACTION BUTTONS */}
          {isJoinRequest && !notification.read && (
            <div className="flex gap-2 mt-2">

              <button
                disabled={loading}
                onClick={() => onAccept(notification)}
                className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Accept
              </button>

              <button
                disabled={loading}
                onClick={() => onReject(notification)}
                className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Reject
              </button>

            </div>
          )}

        </div>
      </div>

      <div className="flex gap-3">

        {!notification.read && (
          <button
            onClick={() => onRead(notification._id)}
            className="text-blue-600 text-sm"
          >
            Mark read
          </button>
        )}

        <button
          onClick={() => onDelete(notification._id)}
          className="text-red-400"
        >
          🗑
        </button>

      </div>

    </div>
  )
}

export default NotificationCard