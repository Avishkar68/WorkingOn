import { useCallback, useEffect, useState } from "react"
import api from "../../api/axios"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"

export default function CommentSection({ postId }) {

  const [comments,setComments] = useState([])
  const [content,setContent] = useState("")
  const [loading,setLoading] = useState(true)

  const navigate = useNavigate()

  const loadComments = useCallback(async () => {
    try {
      const res = await api.get(`/comments/${postId}`)
      setComments(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }, [postId])

  const addComment = async () => {
    if (!content.trim()) return

    try {
      await api.post("/comments",{ postId, content })
      toast.success("Comment added!")
      setContent("")
      loadComments()
    } catch (err) {
      console.error(err)
      toast.error("Failed to add comment")
    }
  }

  useEffect(()=>{
    loadComments()
  },[loadComments])

  if (loading){
    return <p className="text-sm text-gray-400">Loading...</p>
  }

  return (

    <div className="border-t border-white/10 pt-4 space-y-3">

      {comments.map((c) => (

        <div key={c._id} className="flex items-start gap-3">

          <Link to={`/user/${c.author?._id}`}>
            <img
              src={c.author?.profileImage}
              className="w-7 h-7 rounded-full cursor-pointer hover:opacity-80 transition"
              alt={c.author?.name}
            />
          </Link>

          <div className="bg-white/5 px-3 py-2 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">

            <Link
              to={`/user/${c.author?._id}`}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mr-1"
            >
              {c.author?.name}
            </Link>

            {c.content}

          </div>

        </div>

      ))}

      {/* INPUT */}
      <div className="flex gap-2 mt-3">

        <textarea
          value={content}
          onChange={(e)=>setContent(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-300 resize-none min-h-[40px] focus:min-h-[80px] transition-all scrollbar-hide"
          placeholder="Write a comment... (Shift+Enter for new line)"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addComment();
            }
          }}
        />

        <button
          onClick={addComment}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 rounded-lg text-white"
        >
          Post
        </button>

      </div>

    </div>
  )
}