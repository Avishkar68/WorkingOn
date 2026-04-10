import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

import PostCard from "../components/post/PostCard"
import CreatePostModal from "../components/post/CreatePostModal"

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
  }, [fetchData])

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Loading...</p>
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