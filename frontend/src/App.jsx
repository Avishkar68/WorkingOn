import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState, lazy, Suspense } from "react"
import { Toaster } from "react-hot-toast"

import Layout from "./components/layout/Layout"
import ProtectedRoute from "./routes/ProtectedRoute"

// ✅ Non-lazy (public + SEO)
import LandingPage from "./pages/LandingPage"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import BlogHome from "./pages/blogs/BlogHome"
import BlogDetail from "./pages/blogs/BlogDetail"
import OurTeam from "./pages/OurTeam.jsx"

// ✅ Lazy (heavy pages)
const Home = lazy(() => import("./pages/Home"))
const Opportunities = lazy(() => import("./pages/Opportunities"))
const AcademicHelp = lazy(() => import("./pages/AcademicHelp"))
const Projects = lazy(() => import("./pages/Projects"))
const Events = lazy(() => import("./pages/Events"))
const Explore = lazy(() => import("./pages/Explore"))
const Search = lazy(() => import("./pages/Search"))
const Profile = lazy(() => import("./pages/Profile"))
const Notifications = lazy(() => import("./pages/Notifications"))
const Settings = lazy(() => import("./pages/Settings"))
const AdminPanel = lazy(() => import("./pages/AdminPanel"))
const UserProfile = lazy(() => import("./pages/UserProfile"))
const EventDetail = lazy(() => import("./pages/EventDetail"))
const OpportunityDetail = lazy(() => import("./pages/OpportunityDetail"))
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"))
const PostDetail = lazy(() => import("./pages/PostDetail"))
const Opportunity = lazy(() => import("./pages/try/Opportunity"))
const ChallengePage = lazy(() => import("./pages/ChallengePage"))
const Leaderboard = lazy(() => import("./pages/Leaderboard"))
const CommunityPage = lazy(() => import("./pages/CommunityPage"))
const CommunitiesPage = lazy(() => import("./pages/CommunitiesPage"))
const CampusPulse = lazy(() => import("./pages/CampusPulse.jsx"))

import SocketProvider from "./context/SocketContext"
import NotificationProvider from "./context/NotificationContext"
import { AuthProvider } from "./context/AuthContext"

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
                  padding: "16px",
                  fontSize: "14px",
                  borderRadius: "16px",
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

function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    console.log("[Navigation]", location.pathname)
  }, [location.pathname])

  return (
    <>
      {/* ✅ NO mode="wait" */}
      <AnimatePresence>
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#020609] flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            </div>
          }
        >
          {/* ✅ NO key={pathKey} */}
          <Routes location={location}>

            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/our-team" element={<OurTeam />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<BlogHome />} />
            <Route path="/blog/:id" element={<BlogDetail />} />

            {/* ================= PROTECTED ================= */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Layout><Home /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/community/:id"
              element={
                <ProtectedRoute>
                  <Layout><CommunityPage /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/communities"
              element={
                <ProtectedRoute>
                  <Layout><CommunitiesPage /></Layout>
                </ProtectedRoute>
              }
            />

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
                  <ProtectedRoute>
                    <Layout>{element}</Layout>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/home" replace />} />

          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default App