import { useState } from "react"
import api from "../../api/axios"

export default function JoinProjectModal({projectId,close,refresh}){

  const [message,setMessage] = useState("")

  const sendRequest = async ()=>{

    try{

      await api.post(`/projects/${projectId}/join`,{
        message
      })

      refresh()
      close()

    }catch(err){
      console.error(err)
    }

  }

  return(

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white w-[450px] rounded-xl p-6 space-y-4">

        <div className="flex justify-between">

          <h2 className="font-semibold text-lg">
            Join Project
          </h2>

          <button onClick={close}>
            ✕
          </button>

        </div>

        <textarea
          placeholder="Tell them why you'd like to join this project..."
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={close}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={sendRequest}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Send Request
          </button>

        </div>

      </div>

    </div>

  )

}