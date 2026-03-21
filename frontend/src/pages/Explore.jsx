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

      // FIX: safe tag extraction
      const allTags = res.data.flatMap(p => p.tags || [])
      const uniqueTags = [...new Set(allTags)].slice(0, 15) // limit for UI

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
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🧭 Explore
        </h1>
      </div>

      {/* TRENDING TAGS */}
      <div className="glass p-6 rounded-2xl">

        <h2 className="font-semibold mb-4 text-white">
          Trending Tags
        </h2>

        <div className="flex flex-wrap gap-3">

          {tags.length === 0 ? (
            <p className="text-gray-400 text-sm">No trending tags yet</p>
          ) : (
            tags.map(tag => (
              <span
                key={tag}
                className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs hover:bg-indigo-500/30 cursor-pointer transition"
              >
                #{tag}
              </span>
            ))
          )}

        </div>

      </div>

      {/* POSTS */}
      <div className="space-y-6">

        <h2 className="text-lg font-semibold text-white">
          Trending Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-400">No posts found</p>
        ) : (
          posts.map(post => (
            <ExplorePostCard
              key={post._id}
              post={post}
            />
          ))
        )}

      </div>

    </div>

  )
}