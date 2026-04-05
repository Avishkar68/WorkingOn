import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { jwtDecode } from "jwt-decode"

import WelcomeModal from "../components/dialogueboxes/WelcomeModal"

export default function Home(){

  const [communities,setCommunities] = useState([])
  const [loading,setLoading] = useState(true)
  const [showWelcome,setShowWelcome] = useState(false)

  const navigate = useNavigate()

  // ✅ GET USER ID
  const token = localStorage.getItem("token")
  let userId = null

  if(token){
    try{
      const decoded = jwtDecode(token)
      userId = decoded.id || decoded._id
    }catch{}
  }

  const fetchCommunities = async () => {
    try{
      const res = await api.get("/communities")
      setCommunities(res.data)
    }catch(err){
      console.error(err)
    }
    setLoading(false)
  }

  const handleJoin = async (e, id) => {
    e.stopPropagation()
    try{
      await api.post(`/communities/${id}/join`)
      fetchCommunities()
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    fetchCommunities()

    const isFirstVisit = localStorage.getItem("firstVisit")
    if(!isFirstVisit){
      setShowWelcome(true)
      localStorage.setItem("firstVisit","true")
    }
  },[])

  if(loading){
    return <p className="text-gray-400 text-center mt-10">Loading...</p>
  }

  return(
    <div className="space-y-6">

      {showWelcome && (
        <WelcomeModal close={()=>setShowWelcome(false)} />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Explore Communities
        </h1>

        <button
          onClick={()=>navigate("/create-community")}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-white"
        >
          + Create
        </button>
      </div>

      {/* COMMUNITIES */}
      {communities.map(c => {

        const isJoined = c.members?.includes(userId)

        return (
          <div
            key={c._id}
            className="glass rounded-2xl p-5 
            hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition"
          >

            <div className="flex justify-between items-start">

              {/* LEFT */}
              <div
                onClick={()=>navigate(`/community/${c._id}`)}
                className="cursor-pointer"
              >
                <h2 className="text-lg font-semibold text-white">
                  {c.name}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {c.description}
                </p>

                <p className="text-xs text-indigo-400 mt-2">
                  {c.members?.length || 0} members
                </p>
              </div>

              {/* JOIN BUTTON */}
              <button
                onClick={(e)=>handleJoin(e, c._id)}
                className={`px-3 py-1 text-sm rounded-lg text-white ${
                  isJoined
                    ? "bg-green-500"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {isJoined ? "Joined" : "Join"}
              </button>

            </div>

          </div>
        )
      })}

    </div>
  )
}