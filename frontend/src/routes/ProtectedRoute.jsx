import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import api from "../api/axios"

export default function ProtectedRoute({ children }) {

  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {

    const checkAuth = async () => {

      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        setIsAuth(false)
        return
      }

      try {

        await api.get("/auth/me")

        setIsAuth(true)

      } catch {

        localStorage.removeItem("token")
        setIsAuth(false)

      }

      setLoading(false)
    }

    checkAuth()

  }, [])

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

  if (!isAuth) {
    return <Navigate to="/landing" replace />
  }

  return children
}