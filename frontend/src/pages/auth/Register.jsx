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

  const handleSubmit = async (e)=>{

    e.preventDefault()

    await api.post("/auth/register",form)

    navigate("/login")
  }

  return(

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-[350px]"
      >

        <h2 className="text-xl font-semibold mb-6">
          Register
        </h2>

        <input placeholder="Name" className="input" onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" className="input" onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Password" type="password" className="input" onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <input placeholder="Branch" className="input" onChange={(e)=>setForm({...form,branch:e.target.value})}/>
        <input placeholder="Year" className="input" onChange={(e)=>setForm({...form,year:e.target.value})}/>

        <button className="w-full bg-indigo-600 text-white py-2 rounded mt-3">
          Register
        </button>

      </form>

    </div>
  )
}