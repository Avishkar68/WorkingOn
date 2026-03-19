import { useEffect, useState } from "react"
import api from "../api/axios"
import CreateOpportunityModal from "../components/opportunity/CreateOpportunityModal"

export default function Opportunities() {

  const [opportunities,setOpportunities] = useState([])
  const [showModal,setShowModal] = useState(false)

  const loadOpportunities = async () => {

    try{

      const res = await api.get("/opportunities")
      setOpportunities(res.data)

    }catch(err){
      console.error(err)
    }

  }

  useEffect(()=>{
    loadOpportunities()
  },[])

  const daysLeft = (deadline)=>{

    const diff = new Date(deadline) - new Date()
    const days = Math.ceil(diff / (1000*60*60*24))

    return days > 0 ? `${days} days left` : "Expired"
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            🎒 Opportunities
          </h1>

          <p className="text-gray-500">
            Internships, hackathons, and projects
          </p>

        </div>

        <button
          onClick={()=>setShowModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg"
        >
          Post Opportunity
        </button>

      </div>


      {/* OPPORTUNITY LIST */}

      <div className="space-y-5">

        {opportunities.map(op => (

          <div
            key={op._id}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >

            {/* TITLE */}

            <div>

              <h2 className="text-lg font-semibold">
                {op.title}
              </h2>

              <p className="text-indigo-600 text-sm">
                {op.company}
              </p>

            </div>


            {/* DESCRIPTION */}

            <p className="text-gray-600">
              {op.description}
            </p>


            {/* TAGS */}

            <div className="flex gap-2 flex-wrap">

              {op.tags?.map(tag=>(
                <span
                  key={tag}
                  className="bg-gray-100 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}

            </div>


            {/* DEADLINE */}

            <div className="text-gray-500 text-sm">
              📅 {daysLeft(op.deadline)}
            </div>


            {/* APPLY BUTTON */}

            <a
              href={op.registrationLink}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg"
            >
              Apply Now
            </a>

          </div>

        ))}

      </div>


      {/* MODAL */}

      {showModal &&
        <CreateOpportunityModal
          close={()=>setShowModal(false)}
          refresh={loadOpportunities}
        />
      }

    </div>
  )
}