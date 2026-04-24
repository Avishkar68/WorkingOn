import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function CreateCommunity(){

  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!name || !description) {
      toast.error("Please fill all fields")
      return
    }
    
    try{
      await api.post("/communities", { name, description })
      toast.success("Community created successfully!")
      navigate("/home")
    }catch(err){
      console.error(err)
      toast.error("Failed to create community")
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">

      <h1 className="text-2xl text-white font-bold">
        Create Community
      </h1>

      <input
        placeholder="Community Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
      />

      <button
        onClick={handleCreate}
        className="bg-indigo-500 px-5 py-2 rounded-lg text-white hover:bg-indigo-600"
      >
        Create 
      </button>

    </div>
  )
}