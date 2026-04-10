import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

import PostCard from "../components/post/PostCard"
import CreatePostModal from "../components/post/CreatePostModal"
import Skeleton from "../components/ui/Skeleton"

export default function CommunityPage() {

  const { id } = useParams()

  const [posts, setPosts] = useState([])
  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [postsRes, communityRes] = await Promise.all([
        api.get(`/posts/community/${id}`),
        api.get(`/communities/${id}`)
      ])

      setPosts(postsRes.data)
      setCommunity(communityRes.data)

    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchData()
    window.addEventListener("global-refresh", fetchData)
    return () => window.removeEventListener("global-refresh", fetchData)
  }, [fetchData])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass p-6 rounded-2xl space-y-3">
          <Skeleton className="w-1/3 h-8" />
          <Skeleton className="w-2/3 h-4" />
        </div>
        <Skeleton className="w-full h-16 rounded-2xl" />
        {[1, 2, 3].map(i => (
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
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* COMMUNITY HEADER */}
      <div className="glass p-6 rounded-2xl space-y-2">
        <h1 className="text-2xl font-bold text-white">
          {community?.name}
        </h1>
        <p className="text-gray-400 text-sm">
          {community?.description}
        </p>
      </div>

      {/* CREATE POST */}
      <div
        onClick={() => setOpenModal(true)}
        className="glass rounded-2xl p-4 cursor-pointer"
      >
        <p className="text-gray-400">
          Post something in this community...
        </p>
      </div>

      {openModal && (
        <CreatePostModal
          close={() => setOpenModal(false)}
          refreshFeed={fetchData}
          communityId={id || "normal"}   // ✅ fallback here
        />
      )}

      {/* POSTS */}
      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          refreshFeed={fetchData}
        />
      ))}

    </div>
  )
}