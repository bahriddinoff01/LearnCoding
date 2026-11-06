import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute, { Spinner } from './auth/ProtectedRoute'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Pages load only when someone opens them, so the home page starts faster
const AiInstructorPage = lazy(() => import('./pages/AiInstructorPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const ProjectHome = lazy(() => import('./pages/ProjectHome'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const TrackPage = lazy(() => import('./pages/TrackPage'))
const Tracks = lazy(() => import('./pages/Tracks'))

/** Shows a spinner while a page's code is loading. */
const page = (el: ReactNode) => <Suspense fallback={<Spinner />}>{el}</Suspense>

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public pages */}
        <Route index element={<Home />} />
        <Route path="tracks" element={page(<Tracks />)} />
        <Route path="how-it-works" element={page(<HowItWorksPage />)} />
        <Route path="ai-instructor" element={page(<AiInstructorPage />)} />
        <Route path="faq" element={page(<FaqPage />)} />
        <Route path="login" element={page(<AuthPage mode="login" />)} />
        <Route path="signup" element={page(<AuthPage mode="signup" />)} />

        {/* Signed-in users only */}
        <Route element={<ProtectedRoute />}>
          <Route path="tracks/:trackId" element={page(<TrackPage />)} />
          <Route path="tracks/:trackId/:sectionId/quiz" element={page(<QuizPage />)} />
          <Route path="project" element={page(<ProjectHome />)} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Lessons use the full screen for the editor, and need an account */}
      <Route element={<ProtectedRoute />}>
        <Route path="tracks/:trackId/:lessonId" element={page(<LessonPage />)} />
        <Route path="project/:trackId/:sectionId" element={page(<ProjectPage />)} />
      </Route>
    </Routes>
  )
}
