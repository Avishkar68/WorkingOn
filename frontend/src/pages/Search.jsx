import { useState } from "react"
import api from "../api/axios"
import PageShell from "../components/layout/PageShell"

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

    <PageShell
      eyebrow="Lookup"
      title="Search"
      subtitle="Find people, posts, and topics quickly."
    >

      {/* SEARCH BAR */}
      <div className="glass rounded-2xl p-3 border border-white/10">
        <input
          type="text"
          placeholder="Search posts, users..."
          value={query}
          onChange={(e)=>search(e.target.value)}
          className="input bg-transparent border-0 shadow-none px-2"
        />
      </div>

      {/* TABS */}
      {results && (

        <div className="glass rounded-2xl p-2 flex gap-2 border border-white/10">

          <button
            onClick={()=>setActiveTab("posts")}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              activeTab==="posts"
                ? "bg-indigo-500/90 text-white border border-indigo-400/40"
                : "text-slate-400 hover:bg-white/8"
            }`}
          >
            Posts ({results.posts?.length || 0})
          </button>

          <button
            onClick={()=>setActiveTab("users")}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              activeTab==="users"
                ? "bg-indigo-500/90 text-white border border-indigo-400/40"
                : "text-slate-400 hover:bg-white/8"
            }`}
          >
            Users ({results.users?.length || 0})
          </button>

          <button
            onClick={()=>setActiveTab("tags")}
            className={`px-4 py-2 rounded-xl text-sm transition ${
              activeTab==="tags"
                ? "bg-indigo-500/90 text-white border border-indigo-400/40"
                : "text-slate-400 hover:bg-white/8"
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
            <p className="text-slate-400">No posts found</p>
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
            <p className="text-slate-400">No users found</p>
          ) : (
            results.users.map(user => (
              <SearchUserCard key={user._id} user={user} />
            ))
          )}

        </div>
      )}

    </PageShell>
  )
}