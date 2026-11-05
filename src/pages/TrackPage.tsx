import { Link, useParams } from 'react-router-dom'
import { PrerequisiteGate } from '../components/PrerequisiteGate'
import { getTrack, itemPath, trackItems } from '../data/tracks'
import type { TrackItem } from '../data/types'
import { isItemUnlocked, isTrackUnlocked, nextItem } from '../lib/access'
import { useProgress } from '../lib/progress'
import NotFound from './NotFound'

const itemIcon = { lesson: '', quiz: '❓', project: '🌐' }

function itemLabel(item: TrackItem) {
  if (item.kind === 'lesson') return item.lesson.title
  if (item.kind === 'quiz') return 'Section quiz'
  return `Your website: ${item.section.project.title}`
}

function itemMeta(item: TrackItem) {
  if (item.kind === 'lesson') return `${item.lesson.kind === 'fix' ? '🐞 Fix the bug · ' : ''}${item.lesson.minutes} min`
  if (item.kind === 'quiz') return `${item.section.quiz.length} questions`
  return 'Project step'
}

export default function TrackPage() {
  const { trackId } = useParams()
  const progress = useProgress()
  const track = getTrack(trackId)
  if (!track || track.status === 'soon') return <NotFound />

  // Opened a track too early (for example by typing the address): ask first
  if (!isTrackUnlocked(track, progress))
    return (
      <div className="grid min-h-[70vh] place-items-center px-4 py-16">
        <PrerequisiteGate track={track} />
      </div>
    )

  const items = trackItems(track)
  const done = items.filter((i) => progress.isDone(track.id, i.id)).length
  const next = nextItem(track, progress)
  const known = progress.isKnown(track.id)
  const lessonCount = items.filter((i) => i.kind === 'lesson').length

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <Link to="/tracks" className="text-sm text-muted hover:text-fg">
        ← All tracks
      </Link>
      <div className="mt-6 flex items-center gap-4">
        <span
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${track.color} font-mono text-lg font-bold text-white`}
        >
          {track.short}
        </span>
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{track.name}</h1>
          <p className="mt-1 text-muted">{track.description}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full bg-surface-2 px-3 py-1">{track.sections.length} sections</span>
        <span className="rounded-full bg-surface-2 px-3 py-1">{lessonCount} lessons</span>
        <span className="rounded-full bg-surface-2 px-3 py-1">{track.sections.length} quizzes</span>
        <span className="rounded-full bg-surface-2 px-3 py-1">{track.sections.length} website steps</span>
      </div>

      {known && (
        <div className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          You said you already know {track.name}, so everything here is open. Feel free to review.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>
              {done} of {items.length} steps done
            </span>
            <Link
              to={itemPath(track, next)}
              className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500"
            >
              {done === 0 ? 'Start track' : done === items.length ? 'Review' : 'Continue'}
            </Link>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
        </div>
        <Link
          to="/project"
          className="flex items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-brand-500/10 to-fuchsia-500/10 p-6 transition hover:border-line-strong"
        >
          <span className="text-3xl">🌐</span>
          <span>
            <span className="block font-semibold">My website</span>
            <span className="text-xs text-muted">Open your project →</span>
          </span>
        </Link>
      </div>

      <div className="mt-10 space-y-8">
        {track.sections.map((section, si) => (
          <section key={section.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Section {si + 1} · {section.title}
            </h2>
            <p className="mt-1 text-sm text-subtle">{section.summary}</p>
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {items
                .filter((i) => i.section === section)
                .map((item) => {
                  const complete = progress.isDone(track.id, item.id)
                  const open = isItemUnlocked(track, item.id, progress)
                  const isProject = item.kind === 'project'
                  const row = (
                    <>
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${
                          complete ? 'bg-emerald-500 text-white' : 'border border-line-strong text-muted'
                        }`}
                      >
                        {complete ? '✓' : open ? itemIcon[item.kind] : '🔒'}
                      </span>
                      <span className={`flex-1 ${isProject ? 'font-semibold' : ''}`}>{itemLabel(item)}</span>
                      <span className="text-right text-xs text-subtle">{open ? itemMeta(item) : 'Locked'}</span>
                    </>
                  )
                  const base = `flex items-center gap-4 px-5 py-4 ${isProject ? 'bg-brand-500/5' : 'bg-surface'}`
                  return (
                    <li key={item.id}>
                      {open ? (
                        <Link to={itemPath(track, item)} className={`${base} hover:bg-surface-2`}>
                          {row}
                        </Link>
                      ) : (
                        <div className={`${base} cursor-not-allowed text-subtle opacity-70`}>{row}</div>
                      )}
                    </li>
                  )
                })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
