import { useEffect, useState, useContext } from "react"
import { useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import toast from "react-hot-toast"
import { MessageSquare, FileText, LayoutGrid, CheckCircle2, Users, Plus } from "lucide-react"
import api from "../api/axios"
import PostCard from "../components/post/PostCard"
import CommunityChat from "../components/community/CommunityChat"
import { fadeInUp } from "../lib/motion"
import { AuthContext } from "../context/AuthContext"
import CreateCommunityModal from "../components/dialogueboxes/CreateCommunityModal"
import CreatePostModal from "../components/post/CreatePostModal"

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [loadingCommunities, setLoadingCommunities] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(false)
  
  const [filter, setFilter] = useState("all") // "all" | "joined"
  const [view, setView] = useState("posts") // "posts" | "chat"
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  const { user } = useContext(AuthContext)
  const location = useLocation()

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
    setView("posts")
    loadPosts(community._id)
  }

  const handleJoin = async (id) => {
    try {
      await api.post(`/communities/${id}/join`)
      toast.success("Joined community successfully!")
      // Refresh to update membership status
      await loadCommunities()
      // Also update currently selected community object locally
      setSelectedCommunity(prev => {
        if (!prev || prev._id !== id) return prev
        return { ...prev, members: [...(prev.members || []), user?._id] }
      })
    } catch (err) {
      console.error(err)
      toast.error("Failed to join community")
    }
  }

  useEffect(() => {
    loadCommunities()
  }, [])

  // ✅ AUTO-SELECT FROM NAVIGATION STATE
  useEffect(() => {
    if (location.state?.selectedCommunityId && communities.length > 0) {
      const target = communities.find(c => c._id === location.state.selectedCommunityId)
      if (target) {
        handleSelectCommunity(target)
        // Clear state once handled
        window.history.replaceState({}, document.title)
      }
    }
  }, [location.state, communities])

  const filteredCommunities = communities.filter(c => {
    if (filter === "joined") return c.members?.includes(user?._id)
    return true
  })

  const isMember = selectedCommunity?.members?.includes(user?._id)

  return (
    <div className="h-full min-h-0">
      <div className="h-full min-h-[68vh] rounded-2xl border border-white/10 bg-transparent backdrop-blur-md overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
          
          {/* LEFT PANEL */}
          <aside className="min-h-0 border-white/10 border-b lg:border-b-0 lg:border-r bg-transparent">
            <div className="px-4 py-4 border-b border-white/10 space-y-3">
              <div>
                <h1 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                   <Users size={18} className="text-indigo-400" />
                   Communities
                </h1>
                <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-medium">Switch between spaces</p>
              </div>

              {/* FILTER TOGGLE */}
              <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
                <button
                  onClick={() => setFilter("all")}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    filter === "all" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <LayoutGrid size={13} />
                  All
                </button>
                <button
                  onClick={() => setFilter("joined")}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    filter === "joined" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <CheckCircle2 size={13} />
                  Joined
                </button>
              </div>
            </div>

            <div className="h-[calc(100%-120px)] min-h-0 overflow-y-auto scrollbar-hide p-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 group w-full flex items-center gap-3 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 px-4 py-4 text-left transition hover:border-indigo-500/60 hover:bg-indigo-500/10"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 transition group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white">
                  <Plus size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-100 uppercase tracking-tight">Create Community</p>
                  <p className="text-[10px] text-indigo-300/60 font-medium">Start your own space</p>
                </div>
              </button>

              {loadingCommunities ? (
                <p className="text-sm text-slate-400 px-2 py-3">Loading communities...</p>
              ) : filteredCommunities.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-500 italic">No {filter === "joined" ? "joined " : ""}communities found.</p>
                </div>
              ) : (
                filteredCommunities.map((community) => {
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
                      <p className={`truncate text-sm font-semibold ${isActive ? "text-indigo-100" : "text-slate-100"}`}>
                        {community.name}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-slate-500">
                        {community.members?.length || 0} members · {community.description || "Active community"}
                      </p>
                    </motion.button>
                  )
                })
              )}
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="min-h-0 overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {!selectedCommunity ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 flex items-center justify-center p-6"
                >
                  <div className="text-center group">
                    <div className="mx-auto w-16 h-16 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                       <LayoutGrid size={32} className="text-indigo-500/40" />
                    </div>
                    <p className="text-lg font-semibold text-slate-200">Select a Space</p>
                    <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">Pick a community from the left to explore posts and chat with members.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedCommunity._id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -4 }}
                  className="flex-1 min-h-0 flex flex-col overflow-hidden"
                >
                  {/* HEADER & TOGGLE */}
                  <div className="p-4 sm:p-5 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-100">{selectedCommunity.name}</h2>
                        <p className="mt-0.5 text-xs text-slate-500">{selectedCommunity.description || "Active discussion space."}</p>
                      </div>

                      {/* POSTS / CHAT TOGGLE */}
                      <div className="flex items-center gap-3 shrink-0">
                        {view === "posts" && isMember && (
                          <button
                            onClick={() => setIsPostModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all active:scale-95"
                          >
                            <Plus size={14} />
                            Create Post
                          </button>
                        )}

                        {!isMember && (
                          <button
                            onClick={() => handleJoin(selectedCommunity._id)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all active:scale-95 ring-1 ring-emerald-400/20"
                          >
                            <Users size={14} />
                            Join Community
                          </button>
                        )}
                        
                        <div className="flex p-1 bg-slate-900/60 rounded-xl border border-white/10">
                          <button
                            onClick={() => setView("posts")}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                              view === "posts" ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <FileText size={14} />
                            Posts
                          </button>
                          <button
                            onClick={() => {
                              if (isMember) {
                                setView("chat")
                              }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                              !isMember ? "opacity-50 cursor-not-allowed" : ""
                            } ${
                              view === "chat" ? "bg-white text-black shadow-lg" : "text-slate-400 hover:text-slate-200"
                            }`}
                            title={!isMember ? "Join the community to chat" : ""}
                          >
                            <MessageSquare size={14} />
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CONTENT AREA */}
                  <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-4 sm:p-5">
                    {view === "posts" ? (
                      <div className="space-y-4 max-w-4xl mx-auto">
                        {loadingPosts ? (
                          <p className="text-sm text-slate-400">Loading posts...</p>
                        ) : posts.length === 0 ? (
                          <div className="py-20 text-center">
                            <p className="text-sm text-slate-500 italic">No posts in this community yet.</p>
                          </div>
                        ) : (
                          posts.map((post) => (
                            <PostCard
                              key={post._id}
                              post={post}
                              refreshFeed={() => loadPosts(selectedCommunity._id)}
                            />
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col max-w-4xl mx-auto">
                        <CommunityChat communityId={selectedCommunity._id} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>

      <CreateCommunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadCommunities}
      />

      {isPostModalOpen && (
        <CreatePostModal
          close={() => setIsPostModalOpen(false)}
          refreshFeed={() => loadPosts(selectedCommunity?._id)}
          communityId={selectedCommunity?._id}
        />
      )}
    </div>
  )
}
