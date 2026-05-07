import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'

const Workout      = lazy(() => import('./pages/Workout'))
const Nutrition    = lazy(() => import('./pages/Nutrition'))
const BMI          = lazy(() => import('./pages/BMI'))
const Blog         = lazy(() => import('./pages/Blog'))
const BlogPost     = lazy(() => import('./pages/BlogPost'))
const Consultation = lazy(() => import('./pages/Consultation'))
const Contact      = lazy(() => import('./pages/Contact'))
const Login        = lazy(() => import('./pages/Login'))
const Admin        = lazy(() => import('./pages/Admin'))
const NotFound     = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center text-gray-400">
      <p>Đang tải...</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  )
}
