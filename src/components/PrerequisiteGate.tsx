import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Track } from '../data/types'
import { missingPrerequisites } from '../lib/access'
import { useProgress } from '../lib/progress'

function listNames(tracks: Track[]) {
  const names = tracks.map((t) => t.name)
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
}

/**
 * Shown when someone opens a track before finishing the ones before it.
 * They can go back to the first missing track, or confirm they already know it.
 */
export function PrerequisiteGate({ track, onClose }: { track: Track; onClose?: () => void }) {
  const progress = useProgress()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const missing = missingPrerequisites(track, progress)
  const names = listNames(missing)
  const first = missing[0]

  async function skip() {
    setSaving(true)
    await progress.markKnown(missing.map((t) => t.id))
    onClose?.()
    navigate(`/tracks/${track.id}`)
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-elevated p-6 shadow-2xl sm:p-8">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-400/15 text-2xl">🔒</div>
      <h2 className="mt-5 text-xl font-bold">
        {track.name} builds on {names}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        You haven't finished {names} on LearnCoding yet. The {track.name} lessons and projects use what you learn there,
        so we recommend going in order.
      </p>
      <p className="mt-3 text-sm font-semibold">Do you already know {names}?</p>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => {
            onClose?.()
            navigate(`/tracks/${first.id}`)
          }}
          className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-500"
        >
          No, start with {first.name}
        </button>
        <button
          onClick={skip}
          disabled={saving}
          className="rounded-xl border border-line-strong px-5 py-3 font-semibold hover:bg-surface disabled:opacity-60"
        >
          {saving ? 'Saving…' : `Yes, I know ${names} — skip ahead`}
        </button>
        {onClose && (
          <button onClick={onClose} className="py-1 text-sm text-muted hover:text-fg">
            Cancel
          </button>
        )}
      </div>
      <p className="mt-5 text-xs text-subtle">You can always go back to {names} later. Skipped tracks stay fully open.</p>
    </div>
  )
}

/** The same prompt as a pop-up over the page. */
export function PrerequisiteModal({ track, onClose }: { track: Track; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md animate-fade-up">
        <PrerequisiteGate track={track} onClose={onClose} />
      </div>
    </div>
  )
}
