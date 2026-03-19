export default function SearchPostCard({post}){

    const formatDate = (date)=>{
      return new Date(date).toLocaleDateString()
    }
  
    return(
  
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
  
        {/* AUTHOR */}
  
        <div className="flex items-center gap-3">
  
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
            {post.author?.name?.[0]}
          </div>
  
          <div>
  
            <p className="font-semibold">
              {post.author?.name}
            </p>
  
            <p className="text-xs text-gray-500">
              {post.author?.branch} • Year {post.author?.year}
            </p>
  
          </div>
  
        </div>
  
  
        {/* CONTENT */}
  
        <p className="text-gray-700">
          {post.content}
        </p>
  
  
        {/* IMAGE */}
  
        {post.image && (
  
          <img
            src={post.image}
            className="rounded-lg w-full"
          />
  
        )}
  
  
        {/* TAGS */}
  
        <div className="flex gap-2 flex-wrap">
  
          {post.tags?.map(tag => (
  
            <span
              key={tag}
              className="bg-gray-100 px-3 py-1 text-sm rounded-full"
            >
              #{tag}
            </span>
  
          ))}
  
        </div>
  
  
        <p className="text-sm text-gray-500">
          {formatDate(post.createdAt)}
        </p>
  
  
        {/* ACTIONS */}
  
        <div className="flex justify-between border-t pt-3 text-sm">
  
          <span>
            ❤️ {post.likeCount}
          </span>
  
          <span>
            💬 {post.commentCount}
          </span>
  
          <span className="cursor-pointer">
            Share
          </span>
  
        </div>
  
      </div>
  
    )
  
  }