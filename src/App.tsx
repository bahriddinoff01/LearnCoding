import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tracks from './pages/Tracks'
import TrackPage from './pages/TrackPage'
import LessonPage from './pages/LessonPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tracks" element={<Tracks />} />
        <Route path="tracks/:trackId" element={<TrackPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* Lessons use the full screen for the editor */}
      <Route path="tracks/:trackId/:lessonId" element={<LessonPage />} />
    </Routes>
  )
}
