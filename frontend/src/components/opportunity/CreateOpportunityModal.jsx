import { useState } from "react"
import api from "../../api/axios"

export default function CreateOpportunityModal({close,refresh}) {

  const [title,setTitle] = useState("")
  const [company,setCompany] = useState("")
  const [description,setDescription] = useState("")
  const [deadline,setDeadline] = useState("")
  const [tags,setTags] = useState([])
  const [tagInput,setTagInput] = useState("")
  const [registrationLink,setRegistrationLink] = useState("")

  const addTag = ()=>{
    if(!tagInput.trim()) return
    setTags([...tags,tagInput])
    setTagInput("")
  }

  const createOpportunity = async ()=>{

    if(!title || !company || !description || !deadline){
      alert("Please fill all fields")
      return
    }

    if(!registrationLink){
      alert("Please add application link")
      return
    }

    try{

      await api.post("/opportunities",{
        title,
        company,
        description,
        deadline,
        tags,
        type:"internship",
        stipend:"",
        duration:"",
        registrationLink
      })

      refresh()
      close()

    }catch(err){
      console.error(err)
    }
  }

  return(

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white w-[500px] rounded-xl p-6 space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Post an Opportunity</h2>
          <button onClick={close}>✕</button>
        </div>

        <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Company"
          value={company}
          onChange={(e)=>setCompany(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e)=>setDeadline(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* 🔥 APPLICATION LINK */}
        <input
          placeholder="Application Link (Website / Form)"
          value={registrationLink}
          onChange={(e)=>setRegistrationLink(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* TAGS */}
        <div className="flex gap-2">
          <input
            placeholder="Add tag"
            value={tagInput}
            onChange={(e)=>setTagInput(e.target.value)}
            className="flex-1 border p-2 rounded"
          />

          <button
            onClick={addTag}
            className="bg-gray-200 px-3 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tags.map(tag=>(
            <span
              key={tag}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={close}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={createOpportunity}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Post Opportunity
          </button>
        </div>

      </div>

    </div>
  )
}