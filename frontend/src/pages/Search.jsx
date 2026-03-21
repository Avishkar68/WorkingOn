import { useState } from "react"
import api from "../api/axios"

import SearchPostCard from "../components/search/SearchPostCard"
import SearchUserCard from "../components/search/SearchUserCard"

export default function Search(){

  const [query,setQuery] = useState("")
  const [results,setResults] = useState(null)
  const [activeTab,setActiveTab] = useState("posts")

  const search = async (value)=>{
    setQuery(value)

    if(!value.trim()){
      setResults(null)
      return
    }

    try{
      const res = await api.get(`/search?q=${value}`)
      setResults(res.data)
    }catch(err){
      console.error(err)
    }
  }

  return(

    <div className="space-y-6">

      {/* SEARCH BAR */}
      <div className="glass rounded-2xl p-3">
        <input
          type="text"
          placeholder="Search posts, users..."
          value={query}
          onChange={(e)=>search(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-300 placeholder-gray-500"
        />
      </div>

      {/* TABS */}
      {results && (

        <div className="glass rounded-2xl p-2 flex gap-2">

          <button
            onClick={()=>setActiveTab("posts")}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              activeTab==="posts"
                ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            Posts ({results.posts?.length || 0})
          </button>

          <button
            onClick={()=>setActiveTab("users")}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              activeTab==="users"
                ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            Users ({results.users?.length || 0})
          </button>

          <button
            onClick={()=>setActiveTab("tags")}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              activeTab==="tags"
                ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            Tags
          </button>

        </div>

      )}

      {/* RESULTS */}

      {/* POSTS */}
      {results && activeTab==="posts" && (
        <div className="space-y-6">

          {results.posts?.length === 0 ? (
            <p className="text-gray-400">No posts found</p>
          ) : (
            results.posts.map(post => (
              <SearchPostCard key={post._id} post={post} />
            ))
          )}

        </div>
      )}

      {/* USERS */}
      {results && activeTab==="users" && (
        <div className="space-y-4">

          {results.users?.length === 0 ? (
            <p className="text-gray-400">No users found</p>
          ) : (
            results.users.map(user => (
              <SearchUserCard key={user._id} user={user} />
            ))
          )}

        </div>
      )}

    </div>
  )
}