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

      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        ⚙ Settings
      </h1>

      {/* ACCOUNT INFO */}
      <div className="glass p-6 rounded-2xl space-y-4">

        <h2 className="font-semibold text-white">
          Account Information
        </h2>

        <div className="space-y-3">

          <input
            value={user.email}
            disabled
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          />

          <input
            value={user.name}
            disabled
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          />

          <div className="flex gap-4">

            <input
              value={user.branch}
              disabled
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
            />

            <input
              value={user.year}
              disabled
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300"
            />

          </div>

        </div>

      </div>

      {/* CHANGE PASSWORD */}
      <div className="glass p-6 rounded-2xl space-y-4">

        <h2 className="font-semibold text-white">
          🔒 Change Password
        </h2>

        <form onSubmit={updatePassword} className="space-y-3">

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500"
          />

          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            Update Password
          </button>

        </form>

      </div>

      {/* PRIVACY */}
      <div className="glass p-6 rounded-2xl space-y-4">

        <h2 className="font-semibold text-white">
          👁 Privacy
        </h2>

        <div className="space-y-2 text-gray-300">

          <label className="flex gap-2 items-center">
            <input type="checkbox"
              checked={privacy.anonymous}
              onChange={() => setPrivacy({ ...privacy, anonymous: !privacy.anonymous })}
              className="accent-indigo-500"
            />
            Allow anonymous posting
          </label>

          <label className="flex gap-2 items-center">
            <input type="checkbox"
              checked={privacy.hideProfile}
              onChange={() => setPrivacy({ ...privacy, hideProfile: !privacy.hideProfile })}
              className="accent-indigo-500"
            />
            Hide profile details
          </label>

          <label className="flex gap-2 items-center">
            <input type="checkbox"
              checked={privacy.showOnline}
              onChange={() => setPrivacy({ ...privacy, showOnline: !privacy.showOnline })}
              className="accent-indigo-500"
            />
            Show online status
          </label>

        </div>

      </div>

      {/* NOTIFICATIONS */}
      <div className="glass p-6 rounded-2xl space-y-4">

        <h2 className="font-semibold text-white">
          🔔 Notifications
        </h2>

        <div className="space-y-2 text-gray-300">

          <label className="flex gap-2 items-center">
            <input type="checkbox"
              checked={notifications.email}
              onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
              className="accent-indigo-500"
            />
            Email notifications
          </label>

          <label className="flex gap-2 items-center">
            <input type="checkbox"
              checked={notifications.posts}
              onChange={() => setNotifications({ ...notifications, posts: !notifications.posts })}
              className="accent-indigo-500"
            />
            New post notifications
          </label>

          <label className="flex gap-2 items-center">
            <input type="checkbox"
              checked={notifications.comments}
              onChange={() => setNotifications({ ...notifications, comments: !notifications.comments })}
              className="accent-indigo-500"
            />
            Comments & likes
          </label>

        </div>

      </div>

      {/* DANGER ZONE */}
      <div className="glass p-6 rounded-2xl border border-red-500/30 space-y-4">

        <h2 className="text-red-400 font-semibold">
          Danger Zone
        </h2>

        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
        >
          Log Out
        </button>

      </div>

    </div>

  )
}