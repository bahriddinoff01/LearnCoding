import { Link } from 'react-router-dom'
import { countLessons } from '../data/tracks'
import type { Track } from '../data/types'

export default function TrackCard({ track }: { track: Track }) {
  const soon = track.status === 'soon'
  const body = (
    <div
      className={`group h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition ${
        soon ? 'opacity-60' : 'hover:-translate-y-1 hover:border-white/25 hover:bg-white/10'
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${track.color} font-mono font-bold`}
        >
          {track.short}
        </span>
        {soon ? (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Coming soon</span>
        ) : (
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
            {countLessons(track)} lessons
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-semibold">{track.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{track.description}</p>
    </div>
  )

  return soon ? body : <Link to={`/tracks/${track.id}`}>{body}</Link>
}
