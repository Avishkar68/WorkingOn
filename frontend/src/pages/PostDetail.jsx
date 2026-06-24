import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import PostCard from "../components/post/PostCard"

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadPost = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${id}`)
      setPost(res.data || null)
    } catch (err) {
      console.error(err)
      setPost(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  if (loading) {
    return <p className="text-gray-400 text-center mt-8">Loading post...</p>
  }

  if (!post) {
    return <p className="text-gray-400 text-center mt-8">Post not found</p>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PostCard post={post} refreshFeed={loadPost} />
    </div>
  )
}
