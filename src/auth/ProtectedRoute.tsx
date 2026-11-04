import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { useProgress } from '../lib/progress'

export function Spinner() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line-strong border-t-brand-500" />
    </div>
  )
}

/** Only signed-in users get through. Others go to /login and come back after. */
export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const { ready } = useProgress()
  const location = useLocation()

  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!ready) return <Spinner />
  return <Outlet />
}
