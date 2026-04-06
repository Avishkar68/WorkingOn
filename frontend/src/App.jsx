import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

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
import PostDetail from "./pages/PostDetail"
import Opportunity from "./pages/try/Opportunity"
import { pageTransition, pageVariants } from "./lib/motion"

// ⭐ NEW IMPORTS
import CommunityPage from "./pages/CommunityPage"
import CreateCommunity from "./pages/CreateCommunity"
import CommunitiesPage from "./pages/CommunitiesPage"

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
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

          {/* ⭐ CREATE COMMUNITY */}
          <Route
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
          />

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
          <Route path="/opportunities" element={<RouteFrame><Layout><Opportunities /></Layout></RouteFrame>} />
          <Route path="/academic-help" element={<RouteFrame><Layout><AcademicHelp /></Layout></RouteFrame>} />
          <Route path="/projects" element={<RouteFrame><Layout><Projects /></Layout></RouteFrame>} />
          <Route path="/events" element={<RouteFrame><Layout><Events /></Layout></RouteFrame>} />
          <Route path="/explore" element={<RouteFrame><Layout><Explore /></Layout></RouteFrame>} />
          <Route path="/search" element={<RouteFrame><Layout><Search /></Layout></RouteFrame>} />
          <Route path="/profile" element={<RouteFrame><Layout><Profile /></Layout></RouteFrame>} />
          <Route path="/notifications" element={<RouteFrame><Layout><Notifications /></Layout></RouteFrame>} />
          <Route path="/settings" element={<RouteFrame><Layout><Settings /></Layout></RouteFrame>} />
          <Route path="/admin" element={<RouteFrame><Layout><AdminPanel /></Layout></RouteFrame>} />
          <Route path="/user/:id" element={<RouteFrame><Layout><UserProfile /></Layout></RouteFrame>} />
          <Route path="/posts/:id" element={<RouteFrame><Layout><PostDetail /></Layout></RouteFrame>} />
          <Route path="/events/:id" element={<RouteFrame><Layout><EventDetail /></Layout></RouteFrame>} />
          <Route path="/opportunities/:id" element={<RouteFrame><Layout><OpportunityDetail /></Layout></RouteFrame>} />
          <Route path="/opportunity" element={<RouteFrame><Layout><Opportunity /></Layout></RouteFrame>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App