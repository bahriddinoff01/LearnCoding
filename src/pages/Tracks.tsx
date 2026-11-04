import TrackCard from '../components/TrackCard'
import { tracks } from '../data/tracks'

export default function Tracks() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold">All tracks</h1>
      <p className="mt-3 text-slate-400">
        Each track has lessons, exercises, quizzes, challenges and a final project for every section.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((t) => (
          <TrackCard key={t.id} track={t} />
        ))}
      </div>
    </div>
  )
}
