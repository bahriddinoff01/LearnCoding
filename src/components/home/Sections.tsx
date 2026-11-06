import { Link } from 'react-router-dom'
import { allFaqs } from '../../data/faq'
import { Bubble, CtaBanner, Heading } from '../ui'

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
  { icon: '✏️', title: 'Practice', text: 'Every lesson ends with a task: write code or fix a bug, checked instantly.' },
  { icon: '❓', title: 'Quiz', text: 'Check what you understood, with an explanation for every answer.' },
  { icon: '🌐', title: 'Build', text: 'Add a new part to your own website. It grows with every section you finish.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-24">
      <Heading
        eyebrow="How it works"
        title="Every section, four steps"
        text="You don't just watch. You write code from the first minute, and every section adds something real to your own personal website."
      />
      <ol className="relative mt-16 grid gap-6 md:grid-cols-4">
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
      <div className="mt-12 text-center">
        <Link to="/how-it-works" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          See the full learning journey →
        </Link>
      </div>
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
          <Link to="/ai-instructor" className="mt-10 inline-block font-semibold text-fuchsia-600 hover:underline dark:text-fuchsia-400">
            Try the AI instructor demo →
          </Link>
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

/* ---------- FAQ ---------- */
export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24">
      <Heading eyebrow="FAQ" title="Questions? Answers." />
      <div className="mt-12 space-y-3">
        {allFaqs.slice(0, 5).map((f) => (
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
      <div className="mt-12 text-center">
        <Link to="/faq" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          See all questions →
        </Link>
      </div>
    </section>
  )
}

/* ---------- Final call to action ---------- */
export const Cta = CtaBanner
