import { useState } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const handleLogin = async (e) => {

    e.preventDefault()

    const res = await api.post("/auth/login",{
      email,
      password
    })

    localStorage.setItem("token",res.data.token)

    navigate("/")
  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-[350px]"
      >

        <h2 className="text-xl font-semibold mb-6">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Login
        </button>

      </form>

    </div>
  )
}