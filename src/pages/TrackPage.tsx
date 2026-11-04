import { Link, useParams } from 'react-router-dom'
import { PrerequisiteGate } from '../components/PrerequisiteGate'
import { countLessons, flatLessons, getTrack } from '../data/tracks'
import { isLessonUnlocked, isTrackUnlocked } from '../lib/access'
import { useProgress } from '../lib/progress'
import NotFound from './NotFound'

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

  const lessons = flatLessons(track)
  const total = countLessons(track)
  const done = lessons.filter((l) => progress.isDone(track.id, l.id)).length
  const next = lessons.find((l) => !progress.isDone(track.id, l.id)) ?? lessons[0]
  const known = progress.isKnown(track.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link to="/tracks" className="text-sm text-muted hover:text-fg">
        ← All tracks
      </Link>
      <div className="mt-6 flex items-center gap-4">
        <span
          className={`grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${track.color} font-mono text-lg font-bold text-white`}
        >
          {track.short}
        </span>
        <div>
          <h1 className="text-4xl font-bold">{track.name}</h1>
          <p className="mt-1 text-muted">{track.description}</p>
        </div>
      </div>

      {known && (
        <div className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          You said you already know {track.name}, so every lesson here is open. Feel free to review.
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center justify-between text-sm">
          <span>
            {done} of {total} lessons done
          </span>
          <Link
            to={`/tracks/${track.id}/${next.id}`}
            className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500"
          >
            {done === 0 ? 'Start track' : done === total ? 'Review' : 'Continue'}
          </Link>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {track.sections.map((section, si) => (
          <section key={section.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Section {si + 1} · {section.title}
            </h2>
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {section.lessons.map((lesson) => {
                const complete = progress.isDone(track.id, lesson.id)
                const open = isLessonUnlocked(track, lesson.id, progress)
                const row = (
                  <>
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                        complete ? 'bg-emerald-500 text-white' : 'border border-line-strong text-muted'
                      }`}
                    >
                      {complete ? '✓' : open ? '' : '🔒'}
                    </span>
                    <span className="flex-1">{lesson.title}</span>
                    <span className="text-xs text-subtle">{open ? `${lesson.minutes} min` : 'Finish the lesson before'}</span>
                  </>
                )
                return (
                  <li key={lesson.id}>
                    {open ? (
                      <Link
                        to={`/tracks/${track.id}/${lesson.id}`}
                        className="flex items-center gap-4 bg-surface px-5 py-4 hover:bg-surface-2"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className="flex cursor-not-allowed items-center gap-4 bg-surface/50 px-5 py-4 text-subtle">
                        {row}
                      </div>
                    )}
                  </li>
                )
              })}
              <li className="flex items-center gap-4 bg-surface/50 px-5 py-4 text-subtle">
                <span className="w-7 text-center">❓</span>
                <span className="flex-1">Section quiz</span>
                <span className="text-xs">Coming soon</span>
              </li>
              <li className="flex items-center gap-4 bg-surface/50 px-5 py-4 text-subtle">
                <span className="w-7 text-center">🛠️</span>
                <span className="flex-1">Final project with AI instructor</span>
                <span className="text-xs">Coming soon</span>
              </li>
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
