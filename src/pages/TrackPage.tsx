import { Link, useParams } from 'react-router-dom'
import { countLessons, flatLessons, getTrack } from '../data/tracks'
import { isDone } from '../lib/progress'
import NotFound from './NotFound'

export default function TrackPage() {
  const { trackId } = useParams()
  const track = getTrack(trackId)
  if (!track || track.status === 'soon') return <NotFound />

  const total = countLessons(track)
  const done = flatLessons(track).filter((l) => isDone(track.id, l.id)).length
  const next = flatLessons(track).find((l) => !isDone(track.id, l.id)) ?? flatLessons(track)[0]

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link to="/tracks" className="text-sm text-slate-400 hover:text-white">
        ← All tracks
      </Link>
      <div className="mt-6 flex items-center gap-4">
        <span
          className={`grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${track.color} font-mono text-lg font-bold`}
        >
          {track.short}
        </span>
        <div>
          <h1 className="text-4xl font-bold">{track.name}</h1>
          <p className="mt-1 text-slate-400">{track.description}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between text-sm">
          <span>
            {done} of {total} lessons done
          </span>
          <Link
            to={`/tracks/${track.id}/${next.id}`}
            className="rounded-lg bg-brand-600 px-4 py-2 font-medium hover:bg-brand-500"
          >
            {done === 0 ? 'Start track' : done === total ? 'Review' : 'Continue'}
          </Link>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {track.sections.map((section, si) => (
          <section key={section.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Section {si + 1} · {section.title}
            </h2>
            <ul className="mt-3 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
              {section.lessons.map((lesson) => {
                const complete = isDone(track.id, lesson.id)
                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/tracks/${track.id}/${lesson.id}`}
                      className="flex items-center gap-4 bg-white/5 px-5 py-4 hover:bg-white/10"
                    >
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                          complete ? 'bg-emerald-500 text-white' : 'border border-white/20 text-slate-400'
                        }`}
                      >
                        {complete ? '✓' : ''}
                      </span>
                      <span className="flex-1">{lesson.title}</span>
                      <span className="text-xs text-slate-500">{lesson.minutes} min</span>
                    </Link>
                  </li>
                )
              })}
              <li className="flex items-center gap-4 bg-white/[0.02] px-5 py-4 text-slate-500">
                <span className="w-7 text-center">❓</span>
                <span className="flex-1">Section quiz</span>
                <span className="text-xs">Coming soon</span>
              </li>
              <li className="flex items-center gap-4 bg-white/[0.02] px-5 py-4 text-slate-500">
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
