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

      {/* CREATE */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">

        <input
          placeholder="Ask something..."
          value={title}
          onChange={e=>setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Explain your doubt..."
          value={desc}
          onChange={e=>setDesc(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={create}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Post
        </button>

      </div>

      {/* POSTS */}
      {posts.map(p=>(
        <div key={p._id} className="bg-white p-5 rounded-xl shadow space-y-3">

          <h2 className="font-semibold">{p.title}</h2>
          <p className="text-gray-600">{p.description}</p>

          <p className="text-sm text-gray-500">
            by {p.author?.name}
          </p>

          {/* REPLIES */}
          <div className="pl-4 border-l space-y-2">

            {p.replies.map(r=>(
              <div key={r._id} className="text-sm">
                <b>{r.user?.name}:</b> {r.text}
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


// 🔥 REPLY COMPONENT
function ReplyBox({onReply}){

  const [text,setText] = useState("")

  return(
    <div className="flex gap-2 mt-2">

      <input
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder="Reply..."
        className="flex-1 border p-2 rounded"
      />

      <button
        onClick={()=>{
          onReply(text)
          setText("")
        }}
        className="bg-gray-200 px-3 rounded"
      >
        Send
      </button>

    </div>
  )
}