import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState, lazy, Suspense } from "react"
import { Toaster } from "react-hot-toast"

import Layout from "./components/layout/Layout"
import ProtectedRoute from "./routes/ProtectedRoute"

// ✅ NOT lazy (important for speed + SEO)
import LandingPage from "./pages/LandingPage"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import BlogHome from "./pages/blogs/BlogHome"
import BlogDetail from "./pages/blogs/BlogDetail"
import OurTeam from "./pages/OurTeam.jsx"

// ✅ Lazy load only heavy/protected pages
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
const NotFound = lazy(() => import("./pages/NotFound"))

import { pageTransition, pageVariants } from "./lib/motion"
import SocketProvider from "./context/SocketContext"
import NotificationProvider from "./context/NotificationContext"
import { AuthProvider } from "./context/AuthContext"
import GoogleAnalytics from "./components/common/GoogleAnalytics"

function App() {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
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

// ✅ Only show loader for protected/heavy routes
const noLoaderRoutes = ["/", "/our-team", "/login", "/register", "/blog"]

function RouteLoader({ pathKey }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (noLoaderRoutes.includes(pathKey)) return

    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 150)
    return () => clearTimeout(timer)
  }, [pathKey])

  if (noLoaderRoutes.includes(pathKey)) return null

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="route-loader"
          initial={{ opacity: 0, scaleX: 0.2 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </AnimatePresence>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const pathKey = location.pathname

  useEffect(() => {
    console.log(`[Navigation] to: ${pathKey}`)
  }, [pathKey])

  return (
    <>
      {/* ✅ loader only for protected */}
      <RouteLoader pathKey={pathKey} />

      <AnimatePresence mode="wait" onExitComplete={() => {
        console.log(`[Animation] Exit complete for: ${pathKey}`)
        window.scrollTo(0, 0)
      }}>
        <Suspense fallback={
          <div className="min-h-screen bg-[#020609] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        }>
          <Routes location={location} key={pathKey}>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<RouteFrame><LandingPage /></RouteFrame>} />
            <Route path="/our-team" element={<RouteFrame><OurTeam /></RouteFrame>} />
            <Route path="/login" element={<RouteFrame><Login /></RouteFrame>} />
            <Route path="/register" element={<RouteFrame><Register /></RouteFrame>} />
            <Route path="/blog" element={<RouteFrame><BlogHome /></RouteFrame>} />
            <Route path="/blog/:id" element={<RouteFrame><BlogDetail /></RouteFrame>} />

            {/* ================= PROTECTED ROUTES ================= */}
            <Route
              path="/home"
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

            {/* ================= 404 ================= */}
            <Route path="*" element={<Navigate to="/home" replace />} />

          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default App