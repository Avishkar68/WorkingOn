import { useState } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function Register(){

  const navigate = useNavigate()

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    branch:"Computer Engineering",
    year:1
  })

  const [file,setFile] = useState(null)
  const [preview,setPreview] = useState(null)
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (e)=>{
    e.preventDefault()

    try{
      setLoading(true)

      const formData = new FormData()

      Object.entries(form).forEach(([key,value])=>{
        formData.append(key,value)
      })

      if(file){
        formData.append("profileImage",file)
      }

      const res = await api.post("/auth/register",formData,{
        headers:{ "Content-Type":"multipart/form-data" }
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("showWelcomeModal", "true")

      navigate("/")

    }catch(err){
      toast.error(err?.response?.data?.message || "Registration failed")
    }

    setLoading(false)
  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-[#0b0b17] relative overflow-hidden">

      {/* BG GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[140px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <form
        onSubmit={handleSubmit}
        className="glass relative z-10 p-8 rounded-2xl w-[420px] space-y-6 text-white border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.15)]"
      >

        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold">
            Create Account 🚀
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Join your campus network
          </p>
        </div>

        <div className="space-y-2">

<label className="label">Profile Image</label>

{/* CLICKABLE CONTAINER */}
<div
  onClick={() => document.getElementById("fileInput").click()}
  className="w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition"
>
  {preview ? (
    <img src={preview} className="w-full h-full object-cover"/>
  ) : (
    <span className="text-gray-400 text-sm">
      Click to upload image
    </span>
  )}
</div>

{/* HIDDEN INPUT */}
<input
  id="fileInput"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(e)=>{
    const f = e.target.files[0]
    setFile(f)
    if(f){
      setPreview(URL.createObjectURL(f))
    }
  }}
/>

</div>

        {/* INPUTS */}
        <div className="space-y-4">

          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="input"
              onChange={(e)=>setForm({...form,name:e.target.value})}
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="you@spit.ac.in"
              className="input"
              onChange={(e)=>setForm({...form,email:e.target.value})}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              className="input"
              onChange={(e)=>setForm({...form,password:e.target.value})}
            />
          </div>

          {/* DROPDOWNS */}
          <div className="grid grid-cols-2 gap-4">

            {/* <div>
              <label className="label">Branch</label>
              <select
                className="input"
                value={form.branch}
                onChange={(e)=>setForm({...form,branch:e.target.value})}
              >
                <option>Computer Engineering</option>
                <option>Computer Science and Engineering</option>
                <option>Electronics Engineering</option>
              </select>
            </div> */}

            <div>
  <label className="text-sm text-zinc-400 mb-1 block">Branch</label>

  <select
    className="w-full bg-zinc-900 text-white border border-zinc-700 
               px-4 py-2 rounded-xl outline-none 
               focus:ring-2 focus:ring-blue-500 
               hover:bg-zinc-800 transition-all duration-200"
    value={form.branch}
    onChange={(e) =>
      setForm({ ...form, branch: e.target.value })
    }
  >
    <option className="bg-zinc-900">Computer Engineering</option>
    <option className="bg-zinc-900">Computer Science and Engineering</option>
    <option className="bg-zinc-900">Electronics Engineering</option>
  </select>
</div>

            {/* <div>
              <label className="label">Year</label>
              <select
                className="input"
                value={form.year}
                onChange={(e)=>setForm({...form,year:e.target.value})}
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div> */}
<div>
  <label className="text-sm text-zinc-400 mb-1 block">Year</label>

  <select
    className="w-full bg-zinc-900 text-white border border-zinc-700 
               px-4 py-2 rounded-xl outline-none 
               focus:ring-2 focus:ring-blue-500 
               hover:bg-zinc-800 transition-all duration-200"
    value={form.year}
    onChange={(e) =>
      setForm({ ...form, year: Number(e.target.value) })
    }
  >
    <option className="bg-zinc-900" value={1}>1st Year</option>
    <option className="bg-zinc-900" value={2}>2nd Year</option>
    <option className="bg-zinc-900" value={3}>3rd Year</option>
    <option className="bg-zinc-900" value={4}>4th Year</option>
  </select>
</div>
          </div>

        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-xl font-medium transition shadow-[0_0_25px_rgba(99,102,241,0.4)] active:scale-[0.98]"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        {/* FOOTER */}
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