import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../api/axios"
import PageShell from "../components/layout/PageShell"

import SearchPostCard from "../components/search/SearchPostCard"
import SearchUserCard from "../components/search/SearchUserCard"

export default function Search(){
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get("q") || ""

  const [query,setQuery] = useState(q)
  const [results,setResults] = useState(null)
  const [activeTab,setActiveTab] = useState("posts")

  // Sync local query with URL param
  useEffect(() => {
    setQuery(q)
  }, [q])

  // Debounced search execution
  useEffect(() => {
    if (!q.trim()) {
      setResults(null)
      return
    }

    const handler = setTimeout(async () => {
      try {
        const res = await api.get(`/search?q=${q}`)
        setResults(res.data)
      } catch (err) {
        console.error(err)
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [q])

  return(

    <PageShell
      eyebrow="Lookup"
      title="Search"
      subtitle="Find people, posts, and topics quickly."
    >

      {/* RESULTS HEADER */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-400 text-sm">
          Showing results for <span className="text-indigo-400 font-semibold">"{q}"</span>
        </p>
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