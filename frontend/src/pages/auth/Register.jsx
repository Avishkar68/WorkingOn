import { useState } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"

export default function Register(){

  const navigate = useNavigate()

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    branch:"",
    year:""
  })

  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e)=>{

    e.preventDefault()

    try{
      setLoading(true)

      await api.post("/auth/register",form)

      navigate("/login")

    }catch(err){
      alert("Registration failed")
    }

    setLoading(false)
  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-[#0b0b17]">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full"></div>

      <form
        onSubmit={handleSubmit}
        className="glass relative z-10 p-8 rounded-2xl w-[350px] space-y-4 text-white"
      >

        <div>
          <h2 className="text-2xl font-semibold">
            Create Account 🚀
          </h2>
          <p className="text-gray-400 text-sm">
            Join your campus network
          </p>
        </div>

        <input
          placeholder="Name"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-gray-300 placeholder-gray-500"
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Email"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-gray-300 placeholder-gray-500"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-gray-300 placeholder-gray-500"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <input
          placeholder="Branch"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-gray-300 placeholder-gray-500"
          onChange={(e)=>setForm({...form,branch:e.target.value})}
        />

        <input
          placeholder="Year"
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-gray-300 placeholder-gray-500"
          onChange={(e)=>setForm({...form,year:e.target.value})}
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <span
            onClick={()=>navigate("/login")}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>

    </div>
  )
}