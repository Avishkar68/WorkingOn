import { useNavigate } from "react-router-dom"

export default function SearchUserCard({ user }) {
  const navigate = useNavigate()

  return (

    <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">

      <img
        src={user.profileImage}
        className="w-12 h-12 rounded-full"
      />

      <div>



        <div
          onClick={() => navigate(`/user/${user._id}`)}
          className="cursor-pointer hover:bg-gray-100 p-3 rounded"
        >
          {user.name}
        </div>

        <p className="text-sm text-gray-500">
          {user.branch}
        </p>

      </div>

    </div>

  )

}