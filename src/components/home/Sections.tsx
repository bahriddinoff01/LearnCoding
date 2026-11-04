import { Link } from 'react-router-dom'
import { tracks } from '../../data/tracks'
import TrackCard from '../TrackCard'

function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-muted">{text}</p>}
    </div>
  )
}

/* ---------- Technologies strip ---------- */
const tech = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'React', 'SQL', 'Git']

export function TechStrip() {
  return (
    <section className="border-y border-line bg-surface/50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-subtle">
          Everything you need to become a developer
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {tech.map((t) => (
            <span key={t} className="font-mono text-lg font-semibold text-subtle transition hover:text-fg-soft">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- How it works ---------- */
const steps = [
  { icon: '📖', title: 'Learn', text: 'Short lessons with live examples you can edit and run right away.' },
  { icon: '✏️', title: 'Practice', text: 'Exercises after every lesson: write code, fix bugs, predict output.' },
  { icon: '❓', title: 'Quiz', text: 'Check what you understood, with an explanation for every answer.' },
  { icon: '⚔️', title: 'Challenge', text: 'A harder task that combines everything from the section.' },
  { icon: '🛠️', title: 'Build', text: 'Your own project from scratch, with the AI instructor by your side.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-24">
      <Heading
        eyebrow="How it works"
        title="Every section, five steps"
        text="You don't just watch. You write code from the first minute and finish each section with something you built yourself."
      />
      <ol className="relative mt-16 grid gap-6 md:grid-cols-5">
        <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-brand-500/0 via-brand-500/50 to-brand-500/0 md:block" />
        {steps.map((s, i) => (
          <li key={s.title} className="relative text-center">
            <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-line bg-elevated text-2xl shadow-lg">
              {s.icon}
              <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white text-xs font-bold">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------- AI instructor ---------- */
const rules = [
  { title: 'Hints in steps', text: 'A small nudge first. More help only if you still need it.' },
  { title: 'Never the full answer', text: 'It asks questions and points you to the right lesson instead.' },
  { title: 'Knows your code', text: 'It sees your project and your errors, so hints are specific.' },
  { title: 'Plain-language errors', text: 'Confusing error messages explained like a friend would.' },
]

function Bubble({ from, children }: { from: 'you' | 'ai'; children: React.ReactNode }) {
  const ai = from === 'ai'
  return (
    <div className={`flex gap-3 ${ai ? '' : 'flex-row-reverse'}`}>
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
          ai ? 'bg-gradient-to-br from-fuchsia-500 to-brand-500' : 'bg-slate-700 text-white'
        }`}
      >
        {ai ? 'AI' : 'You'}
      </span>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          ai ? 'rounded-tl-sm bg-surface-2 text-fg-soft' : 'rounded-tr-sm bg-brand-600 text-white'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export function AiInstructor() {
  return (
    <section id="ai" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-fuchsia-600/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 lg:grid-cols-2">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400">AI Instructor</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            A mentor that helps you think, not copy
          </h2>
          <p className="mt-4 text-muted">
            Stuck on your project? The AI instructor guides you like a good teacher. You still write every line, so you
            actually learn.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {rules.map((r) => (
              <div key={r.title}>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-700 dark:text-emerald-300">
                    ✓
                  </span>
                  {r.title}
                </div>
                <p className="mt-1 pl-7 text-sm text-muted">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-elevated/80 p-5 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <div className="text-sm font-semibold">Project: To-do app</div>
              <div className="text-xs text-subtle">JavaScript · Section 4</div>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">2 hints left today</span>
          </div>
          <div className="space-y-4 pt-5">
            <Bubble from="you">Can you just write the code for adding items? 😅</Bubble>
            <Bubble from="ai">
              I can't write it for you, but let's break it down! When the user clicks <b>Add</b>, what are the 2 things
              your app needs to do?
            </Bubble>
            <Bubble from="you">Read the input… and put it in the list?</Bubble>
            <Bubble from="ai">
              Exactly! 🎯 For reading the input, look back at <span className="text-brand-600 dark:text-brand-300 underline">Lesson 3: Getting values from inputs</span>. Which property did you use there?
            </Bubble>
          </div>
          <div className="mt-5 flex items-center gap-2">
            {['Nudge', 'Concept', 'Direction', 'Example'].map((h, i) => (
              <span
                key={h}
                className={`rounded-full px-3 py-1 text-[11px] ${
                  i < 2 ? 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-200' : 'bg-surface text-subtle'
                }`}
              >
                {i + 1}. {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Tracks ---------- */
export function TracksSection() {
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

/* ---------- FAQ ---------- */
const faqs = [
  {
    q: 'Do I need any experience?',
    a: 'No. The HTML track starts from zero. If you have never written code before, start there.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. The editor, preview and tests all run in your browser. A laptop works best, but you can read lessons on your phone.',
  },
  {
    q: 'Is it free?',
    a: 'Yes, the lessons and exercises are free while we build the platform.',
  },
  {
    q: 'Will the AI just give me the answers?',
    a: 'No, on purpose. It gives hints in steps, asks guiding questions and points you to lessons. You always write the code yourself.',
  },
  {
    q: 'What will I have at the end?',
    a: 'A project for every section you finish, saved to your profile. Together they make a portfolio you can show employers.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24">
      <Heading eyebrow="FAQ" title="Questions? Answers." />
      <div className="mt-12 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-line bg-surface px-6 py-5 open:bg-surface-2"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-fg-soft transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ---------- Final call to action ---------- */
export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br text-white from-brand-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center sm:px-16">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">Write your first line of code today</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-brand-100">
          Your first lesson takes 5 minutes. No sign-up, no installs.
        </p>
        <Link
          to="/tracks/html/first-page"
          className="relative mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-brand-700 shadow-xl transition hover:-translate-y-0.5"
        >
          Start lesson 1 →
        </Link>
      </div>
    </section>
  )
}
