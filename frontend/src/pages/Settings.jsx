import { useEffect, useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Settings as SettingsIcon } from "lucide-react"

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
    try {
      const res = await api.get("/users/me")
      setUser(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const updatePassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword
      })

      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  if (!user) return null

  return (
    /* Added responsive padding (px-4 on mobile, p-6 on desktop) */
    <div className="max-w-3xl mx-auto p-6 md:p-0 space-y-6">

      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <SettingsIcon className="text-indigo-400" size={24} /> Settings
      </h1>

      {/* ACCOUNT INFO */}
      <div className="glass p-5 md:p-6 rounded-2xl space-y-4">
        <h2 className="font-semibold text-white">
          Account Information
        </h2>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Email Address</label>
            <input
              value={user.email}
              disabled
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Full Name</label>
            <input
              value={user.name}
              disabled
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Changed gap-4 to flex-col on mobile, flex-row on desktop */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Branch</label>
              <input
                value={user.branch}
                disabled
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 cursor-not-allowed"
              />
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Academic Year</label>
              <input
                value={user.year}
                disabled
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="glass p-5 md:p-6 rounded-2xl space-y-4">
        <h2 className="font-semibold text-white">
          Change Password
        </h2>

        <form onSubmit={updatePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
          />

          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            Update Password
          </button>
        </form>
      </div>

      {/* PRIVACY */}
      <div className="glass p-5 md:p-6 rounded-2xl space-y-4">
        <h2 className="font-semibold text-white">
          Privacy
        </h2>

        <div className="space-y-3 text-gray-300">
          <label className="flex gap-3 items-center cursor-pointer select-none">
            <input type="checkbox"
              checked={privacy.anonymous}
              onChange={() => setPrivacy({ ...privacy, anonymous: !privacy.anonymous })}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm">Allow anonymous posting</span>
          </label>

          <label className="flex gap-3 items-center cursor-pointer select-none">
            <input type="checkbox"
              checked={privacy.hideProfile}
              onChange={() => setPrivacy({ ...privacy, hideProfile: !privacy.hideProfile })}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm">Hide profile details</span>
          </label>

          <label className="flex gap-3 items-center cursor-pointer select-none">
            <input type="checkbox"
              checked={privacy.showOnline}
              onChange={() => setPrivacy({ ...privacy, showOnline: !privacy.showOnline })}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm">Show online status</span>
          </label>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="glass p-5 md:p-6 rounded-2xl space-y-4">
        <h2 className="font-semibold text-white">
          Notifications
        </h2>

        <div className="space-y-3 text-gray-300">
          <label className="flex gap-3 items-center cursor-pointer select-none">
            <input type="checkbox"
              checked={notifications.email}
              onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm">Email notifications</span>
          </label>

          <label className="flex gap-3 items-center cursor-pointer select-none">
            <input type="checkbox"
              checked={notifications.posts}
              onChange={() => setNotifications({ ...notifications, posts: !notifications.posts })}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm">New post notifications</span>
          </label>

          <label className="flex gap-3 items-center cursor-pointer select-none">
            <input type="checkbox"
              checked={notifications.comments}
              onChange={() => setNotifications({ ...notifications, comments: !notifications.comments })}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-sm">Comments & likes</span>
          </label>
        </div>
      </div>

     

    </div>
  )
}