import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

type Mode = 'login' | 'signup'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-line-strong bg-page px-4 py-3 outline-none transition placeholder:text-faint focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15'

export default function AuthPage({ mode }: { mode: Mode }) {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Where to go after logging in (set by ProtectedRoute)
  const from = (location.state as { from?: string } | null)?.from ?? '/tracks/html'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  if (user) return <Navigate to={from} replace />

  const isSignup = mode === 'signup'

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (isSignup && password.length < 8) return setError('Password must be at least 8 characters.')
    setBusy(true)
    if (isSignup) {
      const res = await signUp(name.trim(), email.trim(), password)
      setBusy(false)
      if (res.error) return setError(res.error)
      if (res.needsConfirm) return setConfirmSent(true)
    } else {
      const err = await signIn(email.trim(), password)
      setBusy(false)
      if (err) return setError(err)
    }
    navigate(from, { replace: true })
  }

  if (confirmSent)
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="text-5xl">📬</div>
        <h1 className="mt-6 text-2xl font-bold">Check your email</h1>
        <p className="mt-3 text-muted">
          We sent a confirmation link to <span className="font-semibold text-fg">{email}</span>. Click it to activate your
          account, then log in.
        </p>
        <Link to="/login" state={{ from }} className="mt-8 inline-block font-semibold text-brand-600 dark:text-brand-400">
          Go to log in →
        </Link>
      </div>
    )

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-600/15 blur-3xl" />
      <div className="relative mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="rounded-2xl border border-line bg-elevated p-6 shadow-xl sm:p-8">
          <h1 className="text-2xl font-bold">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-muted">
            {isSignup ? 'Free forever. Save your progress and unlock every lesson.' : 'Log in to continue learning.'}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {isSignup && (
              <label className="block text-sm font-medium">
                Name
                <input
                  required
                  maxLength={60}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </label>
            )}
            <label className="block text-sm font-medium">
              Email
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                required
                type="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
              />
            </label>

            {error && (
              <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                {error}
              </p>
            )}

            <button
              disabled={busy}
              className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 disabled:opacity-60"
            >
              {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {isSignup ? 'Already have an account? ' : 'New to LearnCoding? '}
            <Link
              to={isSignup ? '/login' : '/signup'}
              state={{ from }}
              className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
            >
              {isSignup ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
