import { useNavigate } from "react-router-dom"

export default function SearchUserCard({ user }) {

  const navigate = useNavigate()

  return (

    <div
      onClick={() => navigate(`/user/${user._id}`)}
      className="glass rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition"
    >

      <img
        src={user.profileImage}
        className="w-12 h-12 rounded-full object-cover"
      />

      <div>

        <p className="text-white font-medium">
          {user.name}
        </p>

        <p className="text-sm text-gray-400">
          {user.branch}
        </p>

      </div>

    </div>

  )
}