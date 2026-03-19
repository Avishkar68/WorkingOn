import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return children
}