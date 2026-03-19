import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../../api/axios"

import CreatePostModal from "../post/CreatePostModal"
import CreateProjectModal from "../project/CreateProjectModal"
import CreateEventModal from "../events/CreateEventModal"
import CreateOpportunityModal from "../opportunity/CreateOpportunityModal"

export default function Topbar() {

  const [showMenu,setShowMenu] = useState(false)
  const [type,setType] = useState(null)
  const [user,setUser] = useState(null)

  const navigate = useNavigate()

  // 🔥 LOAD USER
  const loadUser = async ()=>{
    try{

      const token = localStorage.getItem("token")
      if(!token) return

      const decoded = jwtDecode(token)
      const id = decoded.id || decoded._id

      const res = await api.get(`/users/${id}`)
      setUser(res.data)

    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{
    loadUser()
  },[])

  return (

    <div className="flex items-center justify-end bg-white border-b px-6 py-3 sticky top-0 z-10">

  
      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* CREATE */}
        <button
          onClick={()=>setShowMenu(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Create
        </button>

        {/* 🔔 NOTIFICATIONS */}
        <Bell
          className="cursor-pointer"
          onClick={()=>navigate("/notifications")}
        />

        {/* 🔥 USER AVATAR */}
        <div
          onClick={()=>navigate("/profile")}
          className="cursor-pointer"
        >

          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              {user?.name?.[0] || "A"}
            </div>
          )}

        </div>

      </div>


      {/* 🔥 CREATE MENU */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[300px] space-y-3">

            <h2 className="font-semibold text-lg">Create</h2>

            {["post","project","event","opportunity"].map(item=>(
              <button
                key={item}
                onClick={()=>{
                  setType(item)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
              >
                Create {item}
              </button>
            ))}

            <button
              onClick={()=>setShowMenu(false)}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>

          </div>

        </div>
      )}


      {/* 🔥 MODALS */}
      {type === "post" && (
        <CreatePostModal close={()=>setType(null)} refreshFeed={()=>window.location.reload()} />
      )}

      {type === "project" && (
        <CreateProjectModal close={()=>setType(null)} refresh={()=>window.location.reload()} />
      )}

      {type === "event" && (
        <CreateEventModal close={()=>setType(null)} refresh={()=>window.location.reload()} />
      )}

      {type === "opportunity" && (
        <CreateOpportunityModal close={()=>setType(null)} refresh={()=>window.location.reload()} />
      )}

    </div>
  )
}