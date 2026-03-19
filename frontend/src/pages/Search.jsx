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

    if(!value) return setResults(null)

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

      <input
        type="text"
        placeholder="Search posts, users, opportunities..."
        value={query}
        onChange={(e)=>search(e.target.value)}
        className="w-full border rounded-lg p-3"
      />


      {/* TABS */}

      {results && (

        <div className="flex gap-4 bg-gray-100 p-2 rounded-lg">

          <button
            onClick={()=>setActiveTab("posts")}
            className={`px-4 py-1 rounded ${
              activeTab==="posts" && "bg-white shadow"
            }`}
          >
            Posts ({results.posts.length})
          </button>

          <button
            onClick={()=>setActiveTab("users")}
            className={`px-4 py-1 rounded ${
              activeTab==="users" && "bg-white shadow"
            }`}
          >
            Users ({results.users.length})
          </button>

          <button
            onClick={()=>setActiveTab("tags")}
            className={`px-4 py-1 rounded ${
              activeTab==="tags" && "bg-white shadow"
            }`}
          >
            Tags
          </button>

        </div>

      )}


      {/* RESULTS */}

      {results && activeTab==="posts" && (

        <div className="space-y-6">

          {results.posts.map(post => (

            <SearchPostCard
              key={post._id}
              post={post}
            />

          ))}

        </div>

      )}


      {results && activeTab==="users" && (

        <div className="space-y-4">

          {results.users.map(user => (

            <SearchUserCard
              key={user._id}
              user={user}
            />

          ))}

        </div>

      )}

    </div>

  )

}