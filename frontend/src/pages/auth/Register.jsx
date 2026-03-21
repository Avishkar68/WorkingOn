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

  const [file,setFile] = useState(null)
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e)=>{
    e.preventDefault()

    try{
      setLoading(true)

      const formData = new FormData()

      formData.append("name",form.name)
      formData.append("email",form.email)
      formData.append("password",form.password)
      formData.append("branch",form.branch)
      formData.append("year",form.year)

      if(file){
        formData.append("profileImage",file)
      }

      await api.post("/auth/register",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })

      navigate("/login")

    }catch(err){
      alert(err?.response?.data?.message || "Registration failed")
    }

    setLoading(false)
  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-[#0b0b17]">

      {/* BG GLOW */}
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

        {/* PROFILE IMAGE */}
        <input
          type="file"
          accept="image/*"
          className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-gray-300"
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <input
          placeholder="Name"
          className="input"
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Email"
          className="input"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <input
          placeholder="Branch"
          className="input"
          onChange={(e)=>setForm({...form,branch:e.target.value})}
        />

        <input
          placeholder="Year"
          className="input"
          onChange={(e)=>setForm({...form,year:e.target.value})}
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-xl"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <span
            onClick={()=>navigate("/login")}
            className="text-indigo-400 cursor-pointer"
          >
            Login
          </span>
        </p>

      </form>

    </div>
  )
}