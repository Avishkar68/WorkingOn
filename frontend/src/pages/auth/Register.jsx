import { useState, useContext } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../../context/AuthContext"

export default function Register() {

  const navigate = useNavigate()
  const { getUser } = useContext(AuthContext)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "Computer Engineering",
    year: 1
  })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const formData = new FormData()

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value)
      })

      if (file) {
        formData.append("profileImage", file)
      }

      const res = await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("showWelcomeModal", "true")

      navigate("/")

    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* BACKGROUND GLOWS */}
      <div className="absolute w-[600px] h-[600px] bg-brand-500/10 blur-[140px] rounded-full -top-48 -left-48" />
      <div className="absolute w-[500px] h-[500px] bg-brand-400/10 blur-[120px] rounded-full -bottom-48 -right-48" />

      <form
        onSubmit={handleSubmit}
        className="glass-pro relative z-10 p-10 rounded-2xl w-[480px] space-y-8"
      >
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">
            Create Account
          </h2>
          <p className="text-text-secondary text-sm">
            Join your campus network and start connecting
          </p>
        </div>

        <div className="space-y-0">
          {/* PROFILE IMAGE UPLOAD */}
          <div className="space-y-2.5">
            <label className="label">Profile Image</label>
            <div
              onClick={() => document.getElementById("fileInput").click()}
              className="group relative w-full h-30 rounded-2xl overflow-hidden glass border-dashed border-2 border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 transition-all duration-300"
            >
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white text-xs font-semibold">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted group-hover:text-brand-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium">Click to upload photo</span>
                </div>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0]
                setFile(f)
                if (f) {
                  setPreview(URL.createObjectURL(f))
                }
              }}
            />
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="label">Full Name</label>
              <input
                type="text"
                placeholder="Spitian User"
                className="input"
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="label">Email Address</label>
              <input
                type="email"
                placeholder="you@spit.ac.in"
                className="input"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-15">
              <div className="space-y-1.5 md:w-[220px]">
                <label className="label">Branch</label>
                <select
                  className="input appearance-none bg-no-repeat bg-[right_1rem_center]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",        // ✅ FIX
                    backgroundPosition: "right 1rem center", // ✅ FIX
                    backgroundSize: "1.25rem"
                  }}
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                >
                  <option className="bg-[#0b1012]">Computer Engineering</option>
                  <option className="bg-[#0b1012]">CSE</option>
                  <option className="bg-[#0b1012]">Electronics</option>
                  <option className="bg-[#0b1012]">AIDS</option>
                </select>
              </div>

              <div className="space-y-1.5 md:w-[164px]">
                <label className="label">Graduation Year</label>
                <select
                  className="input appearance-none bg-no-repeat bg-[right_1rem_center]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",        // ✅ FIX
                    backgroundPosition: "right 1rem center", // ✅ FIX
                    backgroundSize: "1.25rem"
                  }}
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                >
                  <option className="bg-[#0b1012]" value={1}>1st Year</option>
                  <option className="bg-[#0b1012]" value={2}>2nd Year</option>
                  <option className="bg-[#0b1012]" value={3}>3rd Year</option>
                  <option className="bg-[#0b1012]" value={4}>4th Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="btn-primary w-full py-4 rounded-xl font-bold text-sm tracking-wide"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating your profile...</span>
            </div>
          ) : (
            "Create Spitian Account"
          )}
        </button>

        <p className="text-sm text-text-muted text-center pt-2">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-brand-400 font-medium cursor-pointer hover:underline underline-offset-4"
          >
            Sign in instead
          </span>
        </p>
      </form>
    </div>
  )
}