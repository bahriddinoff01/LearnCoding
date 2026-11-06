import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { OPEN_ACCESS } from '../config'
import TrackCard from '../components/TrackCard'
import { PageHeader } from '../components/ui'
import { countLessons, flatLessons, tracks } from '../data/tracks'
import { isTrackComplete } from '../lib/access'
import { useProgress } from '../lib/progress'

const webIds = ['html', 'css', 'javascript', 'react']

const filters = [
  { id: 'all', label: 'All tracks' },
  { id: 'web', label: '🌐 Web path' },
  { id: 'other', label: '🧠 Start anytime' },
  { id: 'available', label: '✅ Available now' },
] as const

type Filter = (typeof filters)[number]['id']

function SignedInSummary() {
  const progress = useProgress()
  if (!progress.ready) return null
  const available = tracks.filter((t) => t.status === 'available')
  const lessonsDone = available.reduce(
    (n, t) => n + flatLessons(t).filter((l) => progress.isDone(t.id, l.id)).length,
    0,
  )
  const lessonsTotal = available.reduce((n, t) => n + countLessons(t), 0)
  const tracksDone = available.filter((t) => isTrackComplete(t, progress)).length
  // The first available track the learner hasn't finished
  const next = available.find((t) => !isTrackComplete(t, progress))

  const stats = [
    { label: 'Lessons done', value: `${lessonsDone}/${lessonsTotal}` },
    { label: 'Tracks completed', value: `${tracksDone}/${available.length}` },
  ]

  return (
    <div className="mb-10 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-8">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-subtle">{s.label}</div>
          </div>
        ))}
      </div>
      {next && (
        <Link
          to={`/tracks/${next.id}`}
          className="rounded-xl bg-brand-600 px-5 py-3 text-center font-semibold text-white hover:bg-brand-500"
        >
          Continue {next.name} →
        </Link>
      )}
    </div>
  )
}

export default function Tracks() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<Filter>('all')

  const shown = tracks.filter((t) => {
    if (filter === 'web') return webIds.includes(t.id)
    if (filter === 'other') return !webIds.includes(t.id)
    if (filter === 'available') return t.status === 'available'
    return true
  })

  return (
    <>
      <PageHeader
        eyebrow="Tracks"
        title="Pick your path"
        text="Start with HTML and work your way up to React, or jump into Python and SQL anytime. Every track ends with real projects."
      >
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm">
          {['HTML', 'CSS', 'JavaScript', 'React'].map((n, i, arr) => (
            <span key={n} className="flex items-center gap-2">
              <span className="rounded-full border border-line bg-elevated px-4 py-1.5 font-medium shadow-sm">{n}</span>
              {i < arr.length - 1 && <span className="text-faint">→</span>}
            </span>
          ))}
        </div>
        <Link to="/how-it-works" className="mt-5 inline-block text-sm text-muted hover:text-fg">
          Why this order? →
        </Link>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16">
        {(user || OPEN_ACCESS) && <SignedInSummary />}

        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                filter === f.id
                  ? 'bg-fg font-semibold text-page'
                  : 'border border-line text-muted hover:border-line-strong hover:text-fg'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>

        {!user && (
          <div className="mt-12 rounded-2xl border border-line bg-surface p-6 text-center sm:p-8">
            <p className="font-semibold">Create a free account to start learning and save your progress.</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link to="/signup" className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-500">
                Sign up free
              </Link>
              <Link to="/login" className="rounded-xl border border-line-strong px-5 py-2.5 font-semibold hover:bg-surface">
                Log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
