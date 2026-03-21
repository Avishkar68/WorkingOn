// import { useState } from "react"
// import api from "../../api/axios"

// export default function CreatePostModal({close,refreshFeed}){

//   const [content,setContent] = useState("")
//   const [image,setImage] = useState("")
//   const [tags,setTags] = useState("")

//   const submitPost = async () => {

//     try{

//       await api.post("/posts",{
//         content,
//         image,
//         tags: tags.split(",")
//       })

//       refreshFeed()
//       close()

//     }catch(err){
//       console.error(err)
//     }

//   }

//   return(

//     <div className="fixed inset-0 flex items-center justify-center bg-black/40">

//       <div className="bg-white p-6 rounded-xl w-[500px]">

//         <h2 className="text-lg font-semibold mb-4">
//           Create a Post
//         </h2>

//         <textarea
//           placeholder="Share your thoughts..."
//           className="w-full border rounded-lg p-3 mb-3"
//           rows="4"
//           onChange={(e)=>setContent(e.target.value)}
//         />

//         <input
//           placeholder="Image URL"
//           className="w-full border rounded-lg p-2 mb-3"
//           onChange={(e)=>setImage(e.target.value)}
//         />

//         <input
//           placeholder="Tags (React,Node,AI)"
//           className="w-full border rounded-lg p-2 mb-3"
//           onChange={(e)=>setTags(e.target.value)}
//         />

//         <div className="flex justify-end gap-2">

//           <button
//             onClick={close}
//             className="px-4 py-2 border rounded-lg"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={submitPost}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
//           >
//             Post
//           </button>

//         </div>

//       </div>

//     </div>
//   )
// }


import { useState } from "react"
import api from "../../api/axios"

export default function CreatePostModal({ close, refreshFeed }) {

  const [content, setContent] = useState("")
  const [file, setFile] = useState(null)
  const [tags, setTags] = useState("")

  const submitPost = async () => {
    try {

      const formData = new FormData()

      formData.append("content", content)
      formData.append("tags", tags)
      formData.append("image", file)
      formData.append("isAnonymous", false)

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      refreshFeed()
      close()

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

      <div className="glass p-6 rounded-2xl w-[500px] text-white space-y-4">

        <h2 className="text-lg font-semibold">
          Create a Post
        </h2>

        <textarea
          placeholder="Share your thoughts..."
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-gray-300 placeholder-gray-500"
          rows="4"
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-gray-300"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          placeholder="Tags (React,Node,AI)"
          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 outline-none text-gray-300 placeholder-gray-500"
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={close}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={submitPost}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            Post
          </button>

        </div>

      </div>

    </div>
  )
}