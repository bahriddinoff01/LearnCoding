import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { countLessons, flatLessons, getTrack } from '../data/tracks'
import type { Track } from '../data/types'
import { isTrackComplete, isTrackUnlocked } from '../lib/access'
import { useProgress } from '../lib/progress'
import { PrerequisiteModal } from './PrerequisiteGate'

export default function TrackCard({ track }: { track: Track }) {
  const { user } = useAuth()
  const progress = useProgress()
  const [askSkip, setAskSkip] = useState(false)

  const soon = track.status === 'soon'
  const signedIn = !!user && progress.ready
  const locked = signedIn && !isTrackUnlocked(track, progress)
  const complete = signedIn && isTrackComplete(track, progress)
  const doneCount = signedIn ? flatLessons(track).filter((l) => progress.isDone(track.id, l.id)).length : 0
  const total = countLessons(track)
  const requires = getTrack(track.requires)

  let badge
  if (soon) badge = <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-fg-soft">Coming soon</span>
  else if (complete)
    badge = (
      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
        ✓ Completed
      </span>
    )
  else if (locked)
    badge = (
      <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-700 dark:text-amber-300">
        🔒 After {requires?.name}
      </span>
    )
  else
    badge = (
      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
        {signedIn && doneCount > 0 ? `${doneCount}/${total} done` : `${total} lessons`}
      </span>
    )

  const body = (
    <div
      className={`group h-full rounded-2xl border border-line bg-surface p-6 text-left transition ${
        soon ? 'opacity-60' : 'hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2'
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${track.color} font-mono font-bold text-white ${
            locked ? 'opacity-50 grayscale' : ''
          }`}
        >
          {track.short}
        </span>
        {badge}
      </div>
      <h3 className="mt-4 text-xl font-semibold">{track.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{track.description}</p>
      {requires && !complete && <p className="mt-4 text-xs text-subtle">Start after: {requires.name}</p>}
    </div>
  )

  if (soon) return body
  if (locked)
    return (
      <>
        <button onClick={() => setAskSkip(true)} className="block h-full w-full">
          {body}
        </button>
        {askSkip && <PrerequisiteModal track={track} onClose={() => setAskSkip(false)} />}
      </>
    )
  return <Link to={`/tracks/${track.id}`}>{body}</Link>
}
