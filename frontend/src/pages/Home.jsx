import { useEffect, useState } from "react"
import api from "../api/axios"

import PostCard from "../components/post/PostCard"
import CreatePostModal from "../components/post/CreatePostModal"

export default function Home(){

  const [posts,setPosts] = useState([])
  const [loading,setLoading] = useState(true)
  const [openModal,setOpenModal] = useState(false)

  const fetchFeed = async () => {
    try{
      const res = await api.get("/posts/feed")
      setPosts(res.data)
    }catch(err){
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchFeed()
  },[])

  if(loading){
    return (
      <div className="text-gray-400 text-center mt-10">
        Loading feed...
      </div>
    )
  }

  return(
    <div className="space-y-6">

      {/* CREATE POST INPUT STYLE */}
      <div
        onClick={()=>setOpenModal(true)}
        className="glass rounded-2xl p-4 cursor-pointer hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition"
      >
        <p className="text-gray-400">
          What’s happening?
        </p>
      </div>

      {/* MODAL */}
      {openModal &&
        <CreatePostModal
          close={()=>setOpenModal(false)}
          refreshFeed={fetchFeed}
        />
      }

      {/* POSTS */}
      {posts.map(post=>(
        <PostCard
          key={post._id}
          post={post}
          refreshFeed={fetchFeed}
        />
      ))}

    </div>
  )
}