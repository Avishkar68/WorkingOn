import { useState, useContext } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../../context/AuthContext"

export default function Login() {

  const navigate = useNavigate()
  const { getUser } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await api.post("/auth/login", {
        email,
        password
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data._id)

      // Update AuthContext immediately
      await getUser()

      navigate("/")

    } catch {
      toast.error("Invalid credentials")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* BACKGROUND GLOWS */}
      <div className="absolute w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full -top-48 -left-48"></div>
      <div className="absolute w-[500px] h-[500px] bg-brand-400/10 blur-[120px] rounded-full -bottom-48 -right-48"></div>

      <form
        onSubmit={handleLogin}
        className="glass-pro relative z-10 p-10 rounded-2xl w-[400px] space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">
            Welcome Back
          </h2>
          <p className="text-text-secondary text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="label">Email Address</label>
            <input
              type="email"
              placeholder="name@spit.ac.in"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </div>
          ) : (
            "Login to Account"
          )}
        </button>

        <p className="text-sm text-text-muted text-center pt-2">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-brand-400 font-medium cursor-pointer hover:underline underline-offset-4"
          >
            Register now
          </span>
        </p>
      </form>
    </div>
  )
}