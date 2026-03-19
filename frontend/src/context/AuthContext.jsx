import { createContext, useState, useEffect } from "react"
import api from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUser = async () => {
    try {
      const res = await api.get("/auth/me")
      setUser(res.data)
    } catch {
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}