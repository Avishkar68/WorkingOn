import { useState, useEffect } from "react"
import { Bell, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../../api/axios"

import CreatePostModal from "../post/CreatePostModal"
import CreateProjectModal from "../project/CreateProjectModal"
import CreateEventModal from "../events/CreateEventModal"
import CreateOpportunityModal from "../opportunity/CreateOpportunityModal"

export default function Topbar({ openSidebar }) {

  const [showMenu,setShowMenu] = useState(false)
  const [type,setType] = useState(null)
  const [user,setUser] = useState(null)

  const navigate = useNavigate()

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
    <>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sticky top-0 z-10 glass">

        {/* LEFT - MOBILE MENU */}
        <div className="flex items-center gap-3">
          <Menu 
            className="text-white cursor-pointer lg:hidden"
            onClick={openSidebar}
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* CREATE BUTTON */}
          <button
            onClick={()=>setShowMenu(true)}
            className="bg-indigo-500/80 hover:bg-indigo-500 text-white px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            + Create
          </button>

          {/* NOTIFICATION */}
          <Bell
            className="cursor-pointer text-gray-300"
            onClick={()=>navigate("/notifications")}
          />

          {/* PROFILE */}
          <div
            onClick={()=>navigate("/profile")}
            className="cursor-pointer"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-full">
                {user?.name?.[0] || "A"}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* CREATE MENU MODAL */}
      {showMenu && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">

          {/* MODAL BOX */}
          <div className="glass p-6 rounded-2xl w-[90%] max-w-[320px] text-white space-y-3 shadow-2xl animate-scaleIn">

            <h2 className="font-semibold text-lg text-center">Create</h2>

            {["post","project","event","opportunity"].map(item=>(
              <button
                key={item}
                onClick={()=>{
                  setType(item)
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition"
              >
                Create {item}
              </button>
            ))}

            <button
              onClick={()=>setShowMenu(false)}
              className="w-full text-sm text-gray-400 mt-2"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* MODALS */}
      {type === "post" && <CreatePostModal close={()=>setType(null)} refreshFeed={()=>window.location.reload()} />}
      {type === "project" && <CreateProjectModal close={()=>setType(null)} refresh={()=>window.location.reload()} />}
      {type === "event" && <CreateEventModal close={()=>setType(null)} refresh={()=>window.location.reload()} />}
      {type === "opportunity" && <CreateOpportunityModal close={()=>setType(null)} refresh={()=>window.location.reload()} />}
    </>
  )
}