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
    return <div>Loading feed...</div>
  }

  return(

    <div className="space-y-6">

      {/* CREATE POST BUTTON */}

      <button
        onClick={()=>setOpenModal(true)}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow"
      >
        Create a Post
      </button>


      {/* CREATE POST MODAL */}

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