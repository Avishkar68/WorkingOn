import { useEffect, useState } from "react"
import api from "../api/axios"

import ExplorePostCard from "../components/explore/ExplorePostCard"

export default function Explore(){

  const [posts,setPosts] = useState([])
  const [tags,setTags] = useState([])

  const loadPosts = async ()=>{

    try{

      const res = await api.get("/explore/posts")

      setPosts(res.data)

      // extract trending tags
      const allTags = res.data.flatMap(p => p.tags || [])

      const uniqueTags = [...new Set(allTags)]

      setTags(uniqueTags)

    }catch(err){
      console.error(err)
    }

  }

  useEffect(()=>{
    loadPosts()
  },[])

  return(

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          🧭 Explore
        </h1>

      </div>


      {/* TRENDING TAGS */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          Trending Tags
        </h2>

        <div className="flex flex-wrap gap-3">

          {tags.map(tag => (

            <span
              key={tag}
              className="bg-black text-white px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>

          ))}

        </div>

      </div>


      {/* TRENDING POSTS */}

      <div className="space-y-6">

        <h2 className="text-lg font-semibold">
          Trending Posts
        </h2>

        {posts.map(post => (

          <ExplorePostCard
            key={post._id}
            post={post}
          />

        ))}

      </div>

    </div>

  )

}