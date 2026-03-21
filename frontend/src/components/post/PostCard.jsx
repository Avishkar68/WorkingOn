import { useState } from "react"
import api from "../../api/axios"
import CommentSection from "./CommentSection"

export default function PostCard({ post, refreshFeed }) {

  const [showComments,setShowComments] = useState(false)

  const likePost = async () => {
    try {
      await api.post(`/posts/${post._id}/like`)
      refreshFeed()
    } catch(err){
      console.error(err)
    }
  }

  const unlikePost = async () => {
    try{
      await api.post(`/posts/${post._id}/unlike`)
      refreshFeed()
    }catch(err){
      console.error(err)
    }
  }

  const deletePost = async () => {
    try{
      await api.delete(`/posts/${post._id}`)
      refreshFeed()
    }catch(err){
      console.error(err)
    }
  }

  return (

    <div className="bg-white rounded-xl shadow p-5 space-y-4">

      {/* USER HEADER */}

      <div className="flex items-center gap-3">

        {/* <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
          {post.author?.name?.[0]}
        </div> */}

{post.author?.profileImage ? (
  <img
    src={post.author.profileImage}
    alt="avatar"
    className="w-10 h-10 rounded-full object-cover"
  />
) : (
  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
    {post.author?.name?.[0]}
  </div>
)}
        <div>

          <p className="font-semibold">
            {post.author?.name}
          </p>

          <p className="text-xs text-gray-500">
            {post.author?.branch} • Year {post.author?.year}
          </p>

        </div>

      </div>


      {/* POST CONTENT */}

      <p className="text-gray-700">
        {post.content}
      </p>


      {/* POST IMAGE */}

      {post.image && (

        <img
          src={post.image}
          alt="post"
          className="rounded-lg w-full"
        />

      )}


      {/* TAGS */}

      <div className="flex gap-2 flex-wrap">

        {post.tags?.map(tag => (

          <span
            key={tag}
            className="bg-gray-100 text-xs px-3 py-1 rounded-full"
          >
            #{tag}
          </span>

        ))}

      </div>


      {/* ACTION BUTTONS */}

      <div className="flex gap-6 text-sm border-t pt-3">

        {/* LIKE */}

        <button
          onClick={likePost}
          className="text-indigo-600 flex items-center gap-1 hover:underline"
        >
          👍 Like
          <span className="text-gray-500">
            ({post.likes?.length || 0})
          </span>
        </button>


        {/* COMMENT */}

        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:underline"
        >
          💬 Comment
        </button>


        {/* DELETE */}

        <button
          onClick={deletePost}
          className="text-red-500 hover:underline"
        >
          🗑 Delete
        </button>

      </div>


      {/* COMMENTS */}

      {showComments && (

        <CommentSection postId={post._id}/>

      )}

    </div>

  )

}