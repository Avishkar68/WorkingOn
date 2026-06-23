import { Navigate } from "react-router-dom"
import { useContext } from "react"
import { motion } from "framer-motion"
import { AuthContext } from "../context/AuthContext"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="skeleton-shimmer w-44 h-11 rounded-xl border border-white/10 bg-white/5"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.6 }}
        />
      </div>
    )
  }

  // If user is authenticated in Supabase but MongoDB profile does not exist
  if (user && user.profileExists === false) {
    return <Navigate to="/register" replace />
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}