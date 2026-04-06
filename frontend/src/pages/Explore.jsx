import { useEffect, useState } from "react"
import api from "../api/axios"
import { motion } from "framer-motion"
import { staggerContainer } from "../lib/motion"

import ExplorePostCard from "../components/explore/ExplorePostCard"
import PageShell from "../components/layout/PageShell"

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

    <PageShell
      eyebrow="Discovery"
      title="Explore"
      subtitle="Trending topics and posts from across the platform."
    >

      {/* TRENDING TAGS */}
      <div className="glass p-6 rounded-2xl border border-white/10">

        <h2 className="font-semibold mb-4 text-slate-100">
          Trending Tags
        </h2>

        <div className="flex flex-wrap gap-3">

          {tags.length === 0 ? (
            <p className="text-slate-400 text-sm">No trending tags yet</p>
          ) : (
            tags.map(tag => (
              <span
                key={tag}
                className="bg-indigo-500/14 text-indigo-300 border border-indigo-400/20 px-3 py-1 rounded-full text-xs hover:bg-indigo-500/20 cursor-pointer transition"
              >
                #{tag}
              </span>
            ))
          )}

        </div>

      </div>

      {/* POSTS */}
      <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">

        <h2 className="text-lg font-semibold text-slate-100">
          Trending Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-slate-400">No posts found</p>
        ) : (
          posts.map(post => (
            <ExplorePostCard
              key={post._id}
              post={post}
            />
          ))
        )}

      </motion.div>

    </PageShell>

  )
}