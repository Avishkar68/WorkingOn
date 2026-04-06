import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import api from "../api/axios"
import PostCard from "../components/post/PostCard"
import { fadeInUp } from "../lib/motion"

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [loadingCommunities, setLoadingCommunities] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(false)

  const loadCommunities = async () => {
    try {
      const res = await api.get("/communities")
      setCommunities(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingCommunities(false)
    }
  }

  const loadPosts = async (communityId) => {
    if (!communityId) return
    try {
      setLoadingPosts(true)
      const res = await api.get(`/posts/community/${communityId}`)
      setPosts(res.data || [])
    } catch (err) {
      console.error(err)
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }

  const handleSelectCommunity = (community) => {
    setSelectedCommunity(community)
    loadPosts(community._id)
  }

  useEffect(() => {
    loadCommunities()
  }, [])

  return (
    <div className="h-full min-h-0">
      <div className="h-full min-h-[68vh] rounded-2xl border border-white/10 bg-transparent backdrop-blur-md overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* LEFT PANEL */}
          <aside className="min-h-0 border-white/10 border-b lg:border-b-0 lg:border-r bg-transparent">
            <div className="px-4 py-4 border-b border-white/10">
              <h1 className="text-lg font-semibold text-slate-100">Communities</h1>
              <p className="text-xs text-slate-400 mt-1">Browse and switch between communities</p>
            </div>

            <div className="h-[calc(100%-73px)] min-h-0 overflow-y-auto scrollbar-hide p-2">
              {loadingCommunities ? (
                <p className="text-sm text-slate-400 px-2 py-3">Loading communities...</p>
              ) : communities.length === 0 ? (
                <p className="text-sm text-slate-400 px-2 py-3">No communities found.</p>
              ) : (
                communities.map((community) => {
                  const isActive = selectedCommunity?._id === community._id
                  return (
                    <motion.button
                      key={community._id}
                      type="button"
                      onClick={() => handleSelectCommunity(community)}
                      whileHover={{ x: 2 }}
                      className={`mb-2 w-full rounded-xl border px-3 py-3 text-left transition ${
                        isActive
                          ? "border-indigo-400/40 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.12)]"
                          : "border-white/10 bg-transparent hover:border-indigo-400/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                      }`}
                    >
                      <p className={`truncate text-sm font-medium ${isActive ? "text-indigo-100" : "text-slate-100"}`}>
                        {community.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {community.description || "No activity yet"}
                      </p>
                    </motion.button>
                  )
                })
              )}
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {!selectedCommunity ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="h-full min-h-[45vh] flex items-center justify-center p-6"
                >
                  <div className="text-center">
                    <p className="text-base font-medium text-slate-200">Select a community</p>
                    <p className="mt-1 text-sm text-slate-400">Pick one from the left panel to view posts.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedCommunity._id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.16 } }}
                  className="h-full min-h-0 overflow-y-auto scrollbar-hide p-4 sm:p-5 space-y-4"
                >
                  <div className="rounded-xl border border-white/10 bg-transparent p-4">
                    <h2 className="text-lg font-semibold text-slate-100">{selectedCommunity.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">{selectedCommunity.description || "No description provided."}</p>
                  </div>

                  {loadingPosts ? (
                    <p className="text-sm text-slate-400">Loading posts...</p>
                  ) : posts.length === 0 ? (
                    <p className="text-sm text-slate-400">No posts in this community yet.</p>
                  ) : (
                    posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        refreshFeed={() => loadPosts(selectedCommunity._id)}
                      />
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  )
}
