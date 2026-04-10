// import { useEffect, useState } from "react"
// import { useParams } from "react-router-dom"
// import api from "../api/axios"
// import { jwtDecode } from "jwt-decode"

// export default function UserProfile(){

//   const { id } = useParams()

//   const [user,setUser] = useState(null)
//   const [posts,setPosts] = useState([])
//   const [projects,setProjects] = useState([])
//   const [isFollowing,setIsFollowing] = useState(false)
//   const [activeTab,setActiveTab] = useState("posts")
//   const [loading,setLoading] = useState(false)

//   // ✅ GET CURRENT USER
//   const token = localStorage.getItem("token")
//   const decoded = token ? jwtDecode(token) : null
//   const currentUserId = decoded?.id || decoded?._id

//   // ✅ LOAD USER
//   const loadUser = async ()=>{
//     try{
//       const res = await api.get(`/users/${id}`)
//       setUser(res.data)

//       setIsFollowing(
//         res.data.followers?.some(
//           f => f._id.toString() === currentUserId?.toString()
//         )
//       )

//     }catch(err){
//       console.error(err)
//     }
//   }

//   // ✅ LOAD POSTS + PROJECTS
//   const loadData = async ()=>{
//     try{
//       const postRes = await api.get(`/posts/user/${id}`)
//       setPosts(postRes.data)

//       const projectRes = await api.get(`/projects/user/${id}`)
//       setProjects(projectRes.data)

//     }catch(err){
//       console.error(err)
//     }
//   }

//   useEffect(()=>{
//     loadUser()
//     loadData()
//   },[id])

//   // ✅ FOLLOW / UNFOLLOW
//   const handleFollow = async ()=>{
//     try{
//       setLoading(true)

//       if(isFollowing){
//         await api.post(`/users/${id}/unfollow`)
//       }else{
//         await api.post(`/users/${id}/follow`)
//       }

//       await loadUser() // 🔥 reload for correct state

//     }catch(err){
//       console.error(err)
//     }finally{
//       setLoading(false)
//     }
//   }

//   if(!user) return null

//   return(
//     <div className="space-y-6">

//       {/* 🔥 PROFILE CARD */}
//       <div className="bg-white p-6 rounded-xl shadow flex gap-6">

//         {/* AVATAR */}
//           {/* {user.name?.[0]} */}
//            {user.profileImage ? (
//           <img
//             src={user.profileImage}
//             alt="profile"
//             className="w-24 h-24 rounded-full object-cover"
//           />
//         ) : (
//           <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl">
//             {user.name?.[0]}
//           </div>
//         )}

//         <div className="flex-1">

//           <h2 className="text-2xl font-bold">
//             {user.name}
//           </h2>

//           <p className="text-gray-600">
//             🎓 {user.branch} - Year {user.year}
//           </p>

//           <p className="text-gray-600">
//             ✉ {user.email}
//           </p>

//           {user.bio && (
//             <p className="mt-2 text-gray-700">
//               {user.bio}
//             </p>
//           )}

//           {/* STATS */}
//           <div className="flex gap-8 mt-4">

//             <div>
//               <p className="font-bold">{user.followers?.length}</p>
//               <p className="text-sm text-gray-500">Followers</p>
//             </div>

//             <div>
//               <p className="font-bold">{user.following?.length}</p>
//               <p className="text-sm text-gray-500">Following</p>
//             </div>

//           </div>

//           {/* FOLLOW BUTTON */}
//           {currentUserId !== id && (
//             <button
//               onClick={handleFollow}
//               disabled={loading}
//               className={`mt-4 px-4 py-2 rounded-lg text-white transition
//               ${isFollowing ? "bg-gray-500" : "bg-indigo-600"}
//               ${loading ? "opacity-50" : ""}`}
//             >
//               {loading
//                 ? "Please wait..."
//                 : isFollowing
//                 ? "Unfollow"
//                 : "Follow"}
//             </button>
//           )}

//         </div>

//       </div>

//       {/* 🔥 TABS */}
//       <div className="flex gap-6 border-b pb-2 text-lg">

//         <button
//           onClick={()=>setActiveTab("posts")}
//           className={`pb-1 ${
//             activeTab === "posts"
//               ? "border-b-2 border-indigo-600 font-semibold"
//               : "text-gray-500"
//           }`}
//         >
//           Posts ({posts.length})
//         </button>

//         <button
//           onClick={()=>setActiveTab("projects")}
//           className={`pb-1 ${
//             activeTab === "projects"
//               ? "border-b-2 border-indigo-600 font-semibold"
//               : "text-gray-500"
//           }`}
//         >
//           Projects ({projects.length})
//         </button>

//       </div>

//       {/* 🔥 POSTS TAB */}
//       {activeTab === "posts" && (
//         <div className="space-y-4">

//           {posts.length === 0 ? (
//             <p className="text-gray-500">No posts</p>
//           ) : (
//             posts.map(p => (
//               <div key={p._id} className="bg-white p-4 rounded-xl shadow">

//                 {/* HEADER */}
//                 <div className="flex items-center gap-3">

//                   <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
//                     {p.author?.name?.[0]}
//                   </div>

//                   <div>
//                     <p className="font-semibold">
//                       {p.author?.name}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       {new Date(p.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>

//                 </div>

//                 {/* CONTENT */}
//                 <p className="mt-3">{p.content}</p>

//                 {/* IMAGE */}
//                 {p.image && (
//                   <img
//                     src={p.image}
//                     alt="post"
//                     className="mt-3 rounded-lg"
//                   />
//                 )}

//                 {/* STATS */}
//                 <div className="flex gap-4 mt-3 text-sm text-gray-500">
//                   ❤️ {p.likes?.length || 0}
//                   💬 {p.comments?.length || 0}
//                 </div>

//               </div>
//             ))
//           )}

//         </div>
//       )}

//       {/* 🔥 PROJECTS TAB */}
//       {activeTab === "projects" && (
//         <div className="space-y-4">

//           {projects.length === 0 ? (
//             <p className="text-gray-500">No projects</p>
//           ) : (
//             projects.map(p => (
//               <div key={p._id} className="bg-white p-4 rounded-xl shadow">

//                 <h3 className="font-semibold text-lg">
//                   {p.title}
//                 </h3>

//                 <p className="text-gray-600 mt-1">
//                   {p.description}
//                 </p>

//                 <div className="text-sm text-gray-500 mt-2">
//                   👥 {p.teamSize?.current}/{p.teamSize?.needed}
//                 </div>

//               </div>
//             ))
//           )}

//         </div>
//       )}

//     </div>
//   )
// }


import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import { jwtDecode } from "jwt-decode"
import toast from "react-hot-toast"

export default function UserProfile() {

  const { id } = useParams()

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [projects, setProjects] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("token")
  const decoded = token ? jwtDecode(token) : null
  const currentUserId = decoded?.id || decoded?._id

  const loadUser = useCallback(async () => {
    try {
      const res = await api.get(`/users/${id}`)
      setUser(res.data)

      setIsFollowing(
        res.data.followers?.some(
          f => f._id.toString() === currentUserId?.toString()
        )
      )

    } catch (err) {
      console.error(err)
    }
  }, [id, currentUserId])

  const loadData = useCallback(async () => {
    try {
      const postRes = await api.get(`/posts/user/${id}`)
      setPosts(postRes.data)

      const projectRes = await api.get(`/projects/user/${id}`)
      setProjects(projectRes.data)

    } catch (err) {
      console.error(err)
    }
  }, [id])

  useEffect(() => {
    loadUser()
    loadData()
  }, [loadUser, loadData])

  const handleFollow = async () => {
    try {
      setLoading(true)

      if (isFollowing) {
        await api.post(`/users/${id}/unfollow`)
        toast.success("Unfollowed successfully")
      } else {
        await api.post(`/users/${id}/follow`)
        toast.success("Followed successfully")
      }

      await loadUser()

    } catch (err) {
      console.error(err)
      toast.error("Action failed")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">

      {/* PROFILE CARD */}
      <div className="glass p-6 rounded-2xl flex gap-6">

        {user.profileImage ? (
          <img
            src={user.profileImage}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl">
            {user.name?.[0]}
          </div>
        )}

        <div className="flex-1">

          <h2 className="text-2xl font-bold text-white">
            {user.name}
          </h2>

          <p className="text-gray-400">
            🎓 {user.branch} - Year {user.year}
          </p>

          <p className="text-gray-400">
            ✉ {user.email}
          </p>

          {user.bio && (
            <p className="mt-3 text-gray-300">
              {user.bio}
            </p>
          )}
          {/* SKILLS */}
          {user.skills && user.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {/* STATS */}
          <div className="flex gap-8 mt-4 text-gray-300">

            <div>
              <p className="font-bold text-white">{user.followers?.length}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>

            <div>
              <p className="font-bold text-white">{user.following?.length}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>

          </div>

          {/* FOLLOW BUTTON */}
          {currentUserId !== id && (
            <button
              onClick={handleFollow}
              disabled={loading}
              className={`mt-4 px-4 py-2 rounded-xl text-white transition shadow-[0_0_15px_rgba(99,102,241,0.3)]
              ${isFollowing
                  ? "bg-white/10 text-gray-300 hover:bg-white/20"
                  : "bg-indigo-500 hover:bg-indigo-600"}
              ${loading ? "opacity-50" : ""}`}
            >
              {loading
                ? "Please wait..."
                : isFollowing
                  ? "Unfollow"
                  : "Follow"}
            </button>
          )}

        </div>

      </div>

      {/* TABS */}
      <div className="flex gap-4 glass p-2 rounded-2xl">

        {["posts", "projects"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl capitalize transition ${activeTab === tab
                ? "bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                : "text-gray-400 hover:bg-white/10"
              }`}
          >
            {tab} ({tab === "posts" ? posts.length : projects.length})
          </button>
        ))}

      </div>

      {/* POSTS */}
      {activeTab === "posts" && (
        <div className="space-y-4">

          {posts.length === 0 ? (
            <p className="text-gray-400">No posts</p>
          ) : (
            posts.map(p => (
              <div
                key={p._id}
                className="glass p-5 rounded-2xl space-y-3"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    {p.author?.name?.[0]}
                  </div>

                  <div>
                    <p className="text-white font-semibold">
                      {p.author?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                <p className="text-gray-300">
                  {p.content}
                </p>

                {p.image && (
                  <img
                    src={p.image}
                    className="rounded-xl border border-white/10"
                  />
                )}

                <div className="text-sm text-gray-400 flex gap-4">
                  ❤️ {p.likes?.length || 0}
                  💬 {p.comments?.length || 0}
                </div>

              </div>
            ))
          )}

        </div>
      )}

      {/* PROJECTS */}
      {activeTab === "projects" && (
        <div className="space-y-4">

          {projects.length === 0 ? (
            <p className="text-gray-400">No projects</p>
          ) : (
            projects.map(p => (
              <div
                key={p._id}
                className="glass p-5 rounded-2xl space-y-2"
              >

                <h3 className="text-white font-semibold text-lg">
                  {p.title}
                </h3>

                <p className="text-gray-300">
                  {p.description}
                </p>

                <div className="text-sm text-gray-400">
                  👥 {p.teamSize?.current}/{p.teamSize?.needed}
                </div>

              </div>
            ))
          )}

        </div>
      )}

    </div>
  )
}