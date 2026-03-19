import { useEffect, useState } from "react"
import api from "../../api/axios"

export default function CommentSection({ postId }) {

  const [comments,setComments] = useState([])
  const [content,setContent] = useState("")
  const [loading,setLoading] = useState(true)

  const loadComments = async () => {

    try {

      const res = await api.get(`/comments/${postId}`)
      setComments(res.data)

    } catch (err) {

      console.error("Failed to load comments", err)

    }

    setLoading(false)
  }

  const addComment = async () => {

    if (!content.trim()) return

    try {

      await api.post("/comments", {
        postId,
        content
      })

      setContent("")
      loadComments()

    } catch (err) {

      console.error(err)

    }

  }

  useEffect(() => {
    loadComments()
  }, [])

  if (loading) {
    return <div className="text-sm text-gray-500">Loading comments...</div>
  }

  return (

    <div className="border-t pt-3 mt-3 space-y-2">

      {comments.map((c) => (

        <div key={c._id} className="flex items-start gap-2 text-sm">

          <img
            src={c.author?.profileImage}
            className="w-6 h-6 rounded-full"
          />

          <div>

            <span className="font-semibold">
              {c.author?.name}
            </span>

            <span className="ml-2 text-gray-700">
              {c.content}
            </span>

          </div>

        </div>

      ))}

      <div className="flex gap-2 mt-3">

        <input
          value={content}
          onChange={(e)=>setContent(e.target.value)}
          className="flex-1 border rounded p-2 text-sm"
          placeholder="Write a comment..."
        />

        <button
          onClick={addComment}
          className="bg-indigo-600 text-white px-3 rounded"
        >
          Post
        </button>

      </div>

    </div>
  )
}