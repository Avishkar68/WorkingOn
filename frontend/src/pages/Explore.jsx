import { useEffect, useState } from "react"
import api from "../api/axios"
import { motion } from "framer-motion"
import { staggerContainer } from "../lib/motion"

import ExplorePostCard from "../components/explore/ExplorePostCard"
import PageShell from "../components/layout/PageShell"
import Skeleton from "../components/ui/Skeleton"

export default function Explore() {

  const [posts, setPosts] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPosts = async () => {
    try {
      const res = await api.get("/explore/posts")

      // ✅ FILTER ONLY GLOBAL POSTS
      const globalPosts = res.data.filter(post => !post.community)

      setPosts(globalPosts)

      // tags from filtered posts only
      const allTags = globalPosts.flatMap(p => (p.tags || []).flatMap(t => t.split(",")).map(t => t.trim()).filter(Boolean))
      const uniqueTags = [...new Set(allTags)].slice(0, 15)

      setTags(uniqueTags)

    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
    window.addEventListener("global-refresh", loadPosts)
    return () => window.removeEventListener("global-refresh", loadPosts)
  }, [])

  return (

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

          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-6 rounded-full" />
            ))
          ) : tags.length === 0 ? (
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

        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))
        ) : posts.length === 0 ? (
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