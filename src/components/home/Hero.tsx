import { Link } from 'react-router-dom'
import CodeDemo from './CodeDemo'

const stats = [
  { value: '6', label: 'Learning tracks' },
  { value: '5', label: 'Steps per section' },
  { value: '24/7', label: 'AI hints' },
  { value: '0', label: 'Setup needed' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pb-24 pt-16 sm:pt-24 lg:grid-cols-2 lg:gap-12">
        <div className="animate-fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-1.5 text-sm text-fg-soft">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AI instructor that gives hints, not answers
          </span>

          <h1 className="mt-8 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
            Learn to code
            <br />
            by{' '}
            <span className="bg-gradient-to-r from-brand-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              building
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted lg:mx-0">
            HTML, CSS, JavaScript, Python and React. Learn with short lessons, practice in a real editor, then build
            your own projects. Everything runs in your browser.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              to="/tracks/html"
              className="rounded-xl bg-brand-600 text-white px-6 py-3.5 font-semibold shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-500"
            >
              Start with HTML — it's free
            </Link>
            <Link
              to="/tracks"
              className="rounded-xl border border-line-strong px-6 py-3.5 font-semibold transition hover:bg-surface"
            >
              Browse tracks →
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-bold">{s.value}</dd>
                <dd className="text-xs text-subtle">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <CodeDemo />
        </div>
      </div>
    </section>
  )
}
