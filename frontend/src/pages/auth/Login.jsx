import { useState, useContext } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../../context/AuthContext"

export default function Login() {

  const navigate = useNavigate()
  const { getUser } = useContext(AuthContext)

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    try{
      setLoading(true)

      const res = await api.post("/auth/login",{
        email,
        password
      })

      localStorage.setItem("token",res.data.token)
      
      // Update AuthContext immediately
      await getUser()

      navigate("/")

    }catch{
      toast.error("Invalid credentials")
    }

    setLoading(false)
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0b0b17]">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full"></div>

      <form
        onSubmit={handleLogin}
        className="glass relative z-10 p-8 rounded-2xl w-[350px] space-y-5 text-white"
      >

        <div>
          <h2 className="text-2xl font-semibold">
            Welcome Back 👋
          </h2>
          <p className="text-gray-400 text-sm">
            Login to your account
          </p>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-gray-300 placeholder-gray-500"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-gray-300 placeholder-gray-500"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <span
            onClick={()=>navigate("/register")}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </form>

    </div>
  )
}