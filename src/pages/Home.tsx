import { Link } from 'react-router-dom'
import TrackCard from '../components/TrackCard'
import { tracks } from '../data/tracks'

const steps = [
  { icon: '📖', title: 'Learn', text: 'Short lessons with live examples you can edit and run.' },
  { icon: '✏️', title: 'Practice', text: 'Exercises and quizzes after every lesson, checked instantly.' },
  { icon: '⚔️', title: 'Challenge', text: 'Harder tasks that combine everything from a section.' },
  { icon: '🛠️', title: 'Build', text: 'Finish each section with your own project, guided by an AI instructor.' },
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.25),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
            ✨ With an AI instructor that gives hints, not answers
          </span>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Learn to code by{' '}
            <span className="bg-gradient-to-r from-brand-500 to-fuchsia-400 bg-clip-text text-transparent">
              building
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            HTML, CSS, JavaScript, Python and React. Lessons, challenges and quizzes in your browser, then real
            projects you build on your own.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/tracks/html" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold hover:bg-brand-500">
              Start with HTML — free
            </Link>
            <Link to="/tracks" className="rounded-xl border border-white/15 px-6 py-3 font-semibold hover:bg-white/5">
              See all tracks
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-500">Step {i + 1}</div>
              <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Tracks</h2>
        <p className="mt-2 text-slate-400">Pick a technology and go from zero to building projects.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      </section>
    </>
  )
}
