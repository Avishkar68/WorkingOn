import { useState } from "react"
import { createPortal } from "react-dom"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function JoinProjectModal({projectId,close,refresh}){

  const [message,setMessage] = useState("")

  const sendRequest = async ()=>{
    try{
      await api.post(`/projects/${projectId}/join`,{ message })
      toast.success("Request sent successfully!")
      refresh()
      close()
    }catch(err){
      console.error(err)
      toast.error("Failed to send request")
    }
  }

  return createPortal(

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="glass w-[450px] rounded-2xl p-6 space-y-4 text-white">

        <div className="flex justify-between">
          <h2 className="font-semibold text-lg">Join Project</h2>
          <button onClick={close} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <textarea
          placeholder="Tell them why you'd like to join..."
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-3 rounded text-gray-300"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={close}
            className="px-4 py-2 bg-white/10 rounded text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={sendRequest}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            Send Request
          </button>

        </div>

      </div>

    </div>,
    document.body
  )
}