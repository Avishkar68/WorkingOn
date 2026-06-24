import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import PostCard from "../components/post/PostCard"
import Skeleton from "../components/ui/Skeleton"

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
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-0">
        <div className="glass p-4 sm:p-5 rounded-2xl space-y-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4 rounded-lg" />
                <Skeleton className="w-20 h-3 rounded-lg" />
              </div>
            </div>
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-full h-5 rounded-lg" />
            <Skeleton className="w-5/6 h-5 rounded-lg" />
            <Skeleton className="w-2/3 h-5 rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="w-14 h-6 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
            <div className="flex items-center gap-6">
              <Skeleton className="w-12 h-6 rounded-lg" />
              <Skeleton className="w-12 h-6 rounded-lg" />
            </div>
            <Skeleton className="w-16 h-6 rounded-lg" />
          </div>
        </div>
      </div>
    )
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
