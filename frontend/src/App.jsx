import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

import Layout from "./components/layout/Layout"
import ProtectedRoute from "./routes/ProtectedRoute"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import Home from "./pages/Home"
import Opportunities from "./pages/Opportunities"
import AcademicHelp from "./pages/AcademicHelp"
import Projects from "./pages/Projects"
import Events from "./pages/Events"
import Explore from "./pages/Explore"
import Search from "./pages/Search"
import Profile from "./pages/Profile"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import AdminPanel from "./pages/AdminPanel"
import UserProfile from "./pages/UserProfile"
import EventDetail from "./pages/EventDetail"
import OpportunityDetail from "./pages/OpportunityDetail"
import ProjectDetail from "./pages/ProjectDetail"
import PostDetail from "./pages/PostDetail"
import Opportunity from "./pages/try/Opportunity"
import ChallengePage from "./pages/ChallengePage"
import Leaderboard from "./pages/Leaderboard"
import { pageTransition, pageVariants } from "./lib/motion"

// ⭐ NEW IMPORTS
import CommunityPage from "./pages/CommunityPage"
// import CreateCommunity from "./pages/CreateCommunity"
import CommunitiesPage from "./pages/CommunitiesPage"
import LandingPage from "./pages/LandingPage"
import CampusPulse from "./pages/CampusPulse.jsx" // 🔥 Force re-scan
import SocketProvider from "./context/SocketContext"
import NotificationProvider from "./context/NotificationContext"
import { AuthProvider } from "./context/AuthContext"
import OurTeam from "./pages/OurTeam.jsx"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "rgba(9, 9, 11, 0.8)",
                  color: "#ededed",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  padding: "16px",
                  fontSize: "14px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                },
                success: {
                  iconTheme: {
                    primary: "#14b8a6",
                    secondary: "#09090b",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#09090b",
                  },
                },
              }}
            />
            <AnimatedRoutes />
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function RouteFrame({ children }) {
  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

function RouteLoader({ pathKey }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 260)
    return () => clearTimeout(timer)
  }, [pathKey])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="route-loader"
          initial={{ opacity: 0, scaleX: 0.2 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0.8 }}
          transition={{ duration: 0.24 }}
        />
      )}
    </AnimatePresence>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const pathKey = location.pathname

  return (
    <>
      <RouteLoader pathKey={pathKey} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={pathKey}>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/login" element={<RouteFrame><Login /></RouteFrame>} />
          <Route path="/register" element={<RouteFrame><Register /></RouteFrame>} />
          <Route path="/landing" element={<RouteFrame><LandingPage /></RouteFrame>} />
          <Route path="/landing/our-team" element={<RouteFrame><OurTeam /></RouteFrame>} />

          {/* ================= PROTECTED ROUTES ================= */}

          {/* HOME */}
          <Route
            path="/"
            element={
              <RouteFrame>
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              </RouteFrame>
            }
          />

          {/* ⭐ COMMUNITY PAGE */}
          <Route
            path="/community/:id"
            element={
              <RouteFrame>
                <ProtectedRoute>
                  <Layout>
                    <CommunityPage />
                  </Layout>
                </ProtectedRoute>
              </RouteFrame>
            }
          />

          {/* ⭐ CREATE COMMUNITY (REPLACED BY MODAL) */}
          {/* <Route
            path="/create-community"
            element={
              <RouteFrame>
                <ProtectedRoute>
                  <Layout>
                    <CreateCommunity />
                  </Layout>
                </ProtectedRoute>
              </RouteFrame>
            }
          /> */}

          <Route
            path="/communities"
            element={
              <RouteFrame>
                <ProtectedRoute>
                  <Layout>
                    <CommunitiesPage />
                  </Layout>
                </ProtectedRoute>
              </RouteFrame>
            }
          />

          {/* ================= EXISTING ROUTES ================= */}
          {[
            { path: "/opportunities", element: <Opportunities /> },
            { path: "/academic-help", element: <AcademicHelp /> },
            { path: "/projects", element: <Projects /> },
            { path: "/events", element: <Events /> },
            { path: "/explore", element: <Explore /> },
            { path: "/campus-pulse", element: <CampusPulse /> },
            { path: "/search", element: <Search /> },
            { path: "/profile", element: <Profile /> },
            { path: "/notifications", element: <Notifications /> },
            { path: "/settings", element: <Settings /> },
            { path: "/admin", element: <AdminPanel /> },
            { path: "/challenge", element: <ChallengePage /> },
            { path: "/leaderboard", element: <Leaderboard /> },
            { path: "/user/:id", element: <UserProfile /> },
            { path: "/posts/:id", element: <PostDetail /> },
            { path: "/events/:id", element: <EventDetail /> },
            { path: "/projects/:id", element: <ProjectDetail /> },
            { path: "/opportunities/:id", element: <OpportunityDetail /> },
            { path: "/opportunity", element: <Opportunity /> }
          ].map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <RouteFrame>
                  <ProtectedRoute>
                    <Layout>{element}</Layout>
                  </ProtectedRoute>
                </RouteFrame>
              }
            />
          ))}
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App