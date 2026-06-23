import { useState, useContext, useEffect } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../../context/AuthContext"
import { trackEvent } from "../../utils/analytics"
import { supabase } from "../../lib/supabaseClient"

export default function Login() {
  const navigate = useNavigate()
  const { getUser } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    trackEvent('page_view_component', { page: 'Login' });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email.endsWith("@spit.ac.in")) {
      toast.error("Only SPIT emails (@spit.ac.in) are allowed")
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data?.user && !data.user.email_confirmed_at) {
        toast.error("Please verify your email before logging in.")
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      // Obtain session access token
      const session = data.session
      localStorage.setItem("token", session.access_token)

      // Call backend login endpoint to sync/create profile
      const res = await api.post("/auth/login", {
        token: session.access_token
      })

      if (res.data && res.data.profileExists === false) {
        toast.success("Authenticated! Please complete your profile registration.")
        navigate("/register")
      } else {
        localStorage.setItem("userId", res.data._id)
        await getUser()
        trackEvent('login_success', { method: 'email' });
        toast.success("Logged in successfully!")
        navigate("/home")
      }

    } catch (err) {
      console.error(err)
      toast.error(err.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + "/home"
        }
      })
      if (error) throw error
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Google sign in failed")
    }
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
          className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
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

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-text-muted text-xs uppercase tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/5 text-slate-200 font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-brand-500/10 cursor-pointer text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
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