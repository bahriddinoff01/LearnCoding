import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/Layout'
import AiInstructorPage from './pages/AiInstructorPage'
import AuthPage from './pages/AuthPage'
import FaqPage from './pages/FaqPage'
import HowItWorksPage from './pages/HowItWorksPage'
import Home from './pages/Home'
import LessonPage from './pages/LessonPage'
import NotFound from './pages/NotFound'
import TrackPage from './pages/TrackPage'
import Tracks from './pages/Tracks'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public pages */}
        <Route index element={<Home />} />
        <Route path="tracks" element={<Tracks />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="ai-instructor" element={<AiInstructorPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="signup" element={<AuthPage mode="signup" />} />

        {/* Signed-in users only */}
        <Route element={<ProtectedRoute />}>
          <Route path="tracks/:trackId" element={<TrackPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Lessons use the full screen for the editor, and need an account */}
      <Route element={<ProtectedRoute />}>
        <Route path="tracks/:trackId/:lessonId" element={<LessonPage />} />
      </Route>
    </Routes>
  )
}
