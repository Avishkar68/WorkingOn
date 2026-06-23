import { createContext, useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import api from "../api/axios"
import SplashScreen from "../components/ui/SplashScreen"
import toast from "react-hot-toast"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Supabase signout error:", err)
    }
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setUser(null)
  }

  const getUser = async () => {
    try {
      const res = await api.get("/auth/me")
      if (res.data) {
        if (res.data.profileExists === false) {
          setUser(res.data)
        } else {
          setUser(res.data)
          localStorage.setItem("userId", res.data._id)
        }
      } else {
        await logout()
      }
    } catch {
      await logout()
    }
    setLoading(false)
  }

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        localStorage.setItem("token", session.access_token)
        const email = session.user.email
        if (!email.endsWith("@spit.ac.in")) {
          toast.error("Only SPIT emails (@spit.ac.in) are allowed")
          await logout()
          return
        }
        await getUser()
      } else {
        if (import.meta.env.DEV) {
          await getUser()
        } else {
          setLoading(false)
        }
      }
    })

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        localStorage.setItem("token", session.access_token)
        const email = session.user.email
        if (!email.endsWith("@spit.ac.in")) {
          toast.error("Only SPIT emails (@spit.ac.in) are allowed")
          await logout()
          return
        }
        await getUser()
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, getUser, logout, loading }}>
      {loading ? <SplashScreen /> : children}
    </AuthContext.Provider>
  )
}