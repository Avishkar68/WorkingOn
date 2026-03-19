import { useEffect, useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"

export default function Settings() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [privacy, setPrivacy] = useState({
    anonymous: true,
    hideProfile: false,
    showOnline: true
  })

  const [notifications, setNotifications] = useState({
    email: true,
    posts: true,
    comments: true
  })

  const loadUser = async () => {
    const res = await api.get("/users/me")
    setUser(res.data)
  }

  useEffect(() => {
    loadUser()
  }, [])

  const updatePassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {

      await api.put("/auth/change-password", {
        currentPassword,
        newPassword
      })

      alert("Password updated")

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

    } catch (err) {
      alert(err.response?.data?.message || "Error")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (!user) return null

  return (

    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold flex items-center gap-2">
        ⚙ Settings
      </h1>

      {/* ACCOUNT INFO */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">Account Information</h2>

        <div className="space-y-3">

          <input
            value={user.email}
            disabled
            className="w-full border p-2 rounded"
          />

          <input
            value={user.name}
            disabled
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-4">

            <input
              value={user.branch}
              disabled
              className="w-full border p-2 rounded"
            />

            <input
              value={user.year}
              disabled
              className="w-full border p-2 rounded"
            />

          </div>

        </div>

      </div>

      {/* CHANGE PASSWORD */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          🔒 Change Password
        </h2>

        <form onSubmit={updatePassword} className="space-y-3">

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Update Password
          </button>

        </form>

      </div>

      {/* PRIVACY */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          👁 Privacy
        </h2>

        <div className="space-y-2">

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={privacy.anonymous}
              onChange={() => setPrivacy({ ...privacy, anonymous: !privacy.anonymous })}
            />
            Allow anonymous posting
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={privacy.hideProfile}
              onChange={() => setPrivacy({ ...privacy, hideProfile: !privacy.hideProfile })}
            />
            Hide profile details from non-followers
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={privacy.showOnline}
              onChange={() => setPrivacy({ ...privacy, showOnline: !privacy.showOnline })}
            />
            Show online status
          </label>

        </div>

      </div>

      {/* NOTIFICATIONS */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          🔔 Notifications
        </h2>

        <div className="space-y-2">

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
            />
            Email notifications
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={notifications.posts}
              onChange={() => setNotifications({ ...notifications, posts: !notifications.posts })}
            />
            Notifications for new posts
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={notifications.comments}
              onChange={() => setNotifications({ ...notifications, comments: !notifications.comments })}
            />
            Notifications for comments and likes
          </label>

        </div>

      </div>

      {/* DANGER ZONE */}

      <div className="bg-red-50 border border-red-200 p-6 rounded-xl">

        <h2 className="text-red-600 font-semibold mb-4">
          Danger Zone
        </h2>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-6 py-2 rounded w-full"
        >
          Log Out
        </button>

      </div>

    </div>

  )
}
