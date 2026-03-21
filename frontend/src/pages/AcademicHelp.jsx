import { useEffect, useState } from "react"
import api from "../api/axios"

export default function AcademicHelp(){

  const [posts,setPosts] = useState([])
  const [title,setTitle] = useState("")
  const [desc,setDesc] = useState("")

  const load = async ()=>{
    const res = await api.get("/academic")
    setPosts(res.data)
  }

  useEffect(()=>{
    load()
  },[])

  const create = async ()=>{
    await api.post("/academic",{ title, description: desc })
    setTitle("")
    setDesc("")
    load()
  }

  const reply = async (id,text)=>{
    await api.post(`/academic/${id}/reply`,{ text })
    load()
  }

  return(

    <div className="space-y-6">

      {/* CREATE QUESTION */}
      <div className="glass p-4 rounded-2xl space-y-3">

        <input
          placeholder="Ask something..."
          value={title}
          onChange={e=>setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-gray-300 placeholder-gray-500"
        />

        <textarea
          placeholder="Explain your doubt..."
          value={desc}
          onChange={e=>setDesc(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-gray-300 placeholder-gray-500"
        />

        <button
          onClick={create}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          Post
        </button>

      </div>

      {/* POSTS */}
      {posts.map(p=>(
        <div
          key={p._id}
          className="glass p-5 rounded-2xl space-y-4 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition"
        >

          {/* TITLE */}
          <h2 className="font-semibold text-white text-lg">
            {p.title}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-300 text-sm">
            {p.description}
          </p>

          {/* AUTHOR */}
          <p className="text-xs text-gray-400">
            by {p.author?.name}
          </p>

          {/* REPLIES */}
          <div className="pl-4 border-l border-white/10 space-y-2">

            {p.replies.map(r=>(
              <div
                key={r._id}
                className="text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-lg"
              >
                <b className="text-indigo-400">{r.user?.name}:</b> {r.text}
              </div>
            ))}

          </div>

          {/* ADD REPLY */}
          <ReplyBox onReply={(text)=>reply(p._id,text)} />

        </div>
      ))}

    </div>
  )
}

function ReplyBox({onReply}){

  const [text,setText] = useState("")

  return(
    <div className="flex gap-2 mt-3">

      <input
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder="Reply..."
        className="flex-1 bg-white/5 border border-white/10 p-2 rounded-lg outline-none text-gray-300 placeholder-gray-500"
      />

      <button
        onClick={()=>{
          if(!text.trim()) return
          onReply(text)
          setText("")
        }}
        className="bg-indigo-500 hover:bg-indigo-600 px-4 rounded-lg text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]"
      >
        Send
      </button>

    </div>
  )
}