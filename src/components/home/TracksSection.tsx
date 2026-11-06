import { Link } from 'react-router-dom'
import { tracks } from '../../data/tracks'
import TrackCard from '../TrackCard'

/* ---------- Tracks ---------- */
export default function TracksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Tracks</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Pick where to start</h2>
          <p className="mt-3 text-muted">From your first tag to full React apps.</p>
        </div>
        <Link to="/tracks" className="text-sm font-semibold text-brand-600 dark:text-brand-300 hover:text-brand-700 dark:hover:text-brand-100">
          See all tracks →
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((t) => (
          <TrackCard key={t.id} track={t} />
        ))}
      </div>
    </section>
  )
}
