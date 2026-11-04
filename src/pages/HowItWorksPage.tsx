import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AiAvatar, Card, CtaBanner, GradientText, Heading, PageHeader } from '../components/ui'

/* ---------- Small mock-ups that show each step ---------- */

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-elevated shadow-xl">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs text-subtle">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function LessonMock() {
  return (
    <Window title="Lesson 2 · Links and images">
      <div className="text-xs font-semibold uppercase tracking-wider text-brand-500">6 min read</div>
      <div className="mt-2 text-lg font-bold">Links and images</div>
      <p className="mt-2 text-sm text-muted">Links use the &lt;a&gt; tag. The href attribute says where the link goes.</p>
      <pre className="mt-4 rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-300">
        {'<a href="https://mdn.dev">Read MDN</a>'}
      </pre>
      <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-800 dark:text-amber-100">
        💡 Always write a useful alt text for images.
      </div>
    </Window>
  )
}

const exerciseTypes = ['Write the code', 'Fix the bug', 'Fill in the blank', 'Predict the output', 'Order the lines']

function PracticeMock() {
  return (
    <Window title="Exercise · Fix the bug">
      <div className="flex flex-wrap gap-2">
        {exerciseTypes.map((t, i) => (
          <span
            key={t}
            className={`rounded-full px-3 py-1 text-xs ${
              i === 1 ? 'bg-brand-600 text-white' : 'bg-surface-2 text-muted'
            }`}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">This list shows nothing. Find the mistake:</p>
      <pre className="mt-2 rounded-lg bg-slate-900 p-3 font-mono text-xs leading-6 text-slate-200">
        {'<ul>\n  <li>HTML</li>\n  '}
        <span className="rounded bg-rose-500/30 px-1 text-rose-200">{'<li>CSS<li>'}</span>
        {'\n</ul>'}
      </pre>
    </Window>
  )
}

function QuizMock() {
  const options = ['<link>', '<a>', '<href>', '<url>']
  return (
    <Window title="Section quiz · Question 3 of 10">
      <div className="font-semibold">Which tag creates a link to another page?</div>
      <div className="mt-4 space-y-2">
        {options.map((o) => {
          const right = o === '<a>'
          return (
            <div
              key={o}
              className={`flex items-center justify-between rounded-lg border px-4 py-2.5 font-mono text-sm ${
                right ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-line'
              }`}
            >
              {o}
              {right && <span className="font-sans text-xs text-emerald-600 dark:text-emerald-300">✓ Correct</span>}
            </div>
          )
        })}
      </div>
      <p className="mt-4 text-xs text-muted">
        <b>Why:</b> &lt;a&gt; stands for "anchor". &lt;link&gt; connects files like stylesheets, not pages.
      </p>
    </Window>
  )
}

function ChallengeMock() {
  const checks = [
    { label: 'Card has a title and image', ok: true },
    { label: 'Image has alt text', ok: true },
    { label: 'Button links to a profile', ok: true },
    { label: 'Card uses semantic tags', ok: false },
  ]
  return (
    <Window title="Section challenge · Profile card">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Build a profile card</div>
        <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-700 dark:text-amber-300">3 / 4 passed</span>
      </div>
      <ul className="mt-4 space-y-2.5">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-3 text-sm">
            <span
              className={`grid h-5 w-5 place-items-center rounded-full text-[10px] text-white ${
                c.ok ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            >
              {c.ok ? '✓' : '✕'}
            </span>
            <span className={c.ok ? 'text-fg-soft' : 'text-rose-600 dark:text-rose-300'}>{c.label}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-3/4 bg-gradient-to-r from-brand-500 to-fuchsia-500" />
      </div>
    </Window>
  )
}

function BuildMock() {
  return (
    <Window title="Final project · Personal homepage">
      <div className="font-semibold">🛠️ Build your personal homepage</div>
      <p className="mt-2 text-sm text-muted">Use everything from HTML and CSS. No starter code, just you and a brief.</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {['Header with your name', 'About section', 'Project list', 'Contact form'].map((f) => (
          <span key={f} className="rounded-lg bg-surface-2 px-3 py-2 text-fg-soft">
            ☐ {f}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-3 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-3">
        <AiAvatar size="sm" />
        <p className="text-xs leading-relaxed text-fg-soft">
          Your form is missing labels. Which attribute connects a &lt;label&gt; to its input? 🤔
        </p>
      </div>
    </Window>
  )
}

const journey = [
  {
    step: 'Learn',
    icon: '📖',
    title: 'Short lessons you can edit live',
    text: 'Each lesson takes 5–10 minutes. Every example is real code you can change and run, so you learn by trying instead of just reading.',
    points: ['One idea per lesson', 'Live, editable examples', 'Tips and common mistakes'],
    visual: <LessonMock />,
  },
  {
    step: 'Practice',
    icon: '✏️',
    title: 'Exercises after every lesson',
    text: 'Small tasks check that the idea stuck. They come in different shapes so practice never gets boring.',
    points: ['Instant automatic checks', 'Five kinds of exercises', 'Unlocks the next lesson'],
    visual: <PracticeMock />,
  },
  {
    step: 'Quiz',
    icon: '❓',
    title: 'Quizzes that explain themselves',
    text: 'At the end of each section, a short quiz checks your understanding. Every answer, right or wrong, comes with an explanation.',
    points: ['Retry with shuffled questions', 'Mistakes come back later for review', '70% to pass'],
    visual: <QuizMock />,
  },
  {
    step: 'Challenge',
    icon: '⚔️',
    title: 'A challenge that combines it all',
    text: 'A bigger task mixes everything from the section. Hidden tests show how close you are, one check at a time.',
    points: ['Real-world style tasks', 'Score for correctness', 'A few AI hints allowed'],
    visual: <ChallengeMock />,
  },
  {
    step: 'Build',
    icon: '🛠️',
    title: 'Your own project, with a mentor',
    text: 'Finish each section by building something from scratch. The AI instructor guides you with hints, but never writes the code for you.',
    points: ['A brief, not a tutorial', 'AI hints in four levels', 'Saved to your portfolio'],
    visual: <BuildMock />,
  },
]

/* ---------- Roadmap ---------- */

const webPath = [
  { name: 'HTML', short: '</>', color: 'from-orange-500 to-red-500', text: 'Structure' },
  { name: 'CSS', short: '{ }', color: 'from-sky-500 to-blue-600', text: 'Style' },
  { name: 'JavaScript', short: 'JS', color: 'from-yellow-400 to-amber-500', text: 'Interaction' },
  { name: 'React', short: '⚛', color: 'from-cyan-400 to-sky-600', text: 'Apps' },
]

function Roadmap() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <Heading
        eyebrow="Learning order"
        title="Each track builds on the last"
        text="Projects in later tracks use everything before them, so tracks unlock in order. Already know something? Tell us and skip ahead."
      />
      <div className="mt-14 rounded-3xl border border-line bg-surface p-6 sm:p-10">
        <div className="text-sm font-semibold text-muted">🌐 Web developer path</div>
        <div className="mt-6 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          {webPath.map((t, i) => (
            <div key={t.name} className="flex flex-1 flex-col items-center gap-4 md:flex-row">
              <div className="flex w-full items-center gap-3 rounded-2xl border border-line bg-elevated p-4 shadow-sm md:flex-col md:text-center">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${t.color} font-mono font-bold text-white`}>
                  {t.short}
                </span>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-subtle">{t.text}</div>
                </div>
              </div>
              {i < webPath.length - 1 && <span className="rotate-90 text-2xl text-faint md:rotate-0">→</span>}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-line-strong p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 font-mono text-sm font-bold text-white">
              Py
            </span>
            <div>
              <div className="font-semibold">Python</div>
              <div className="text-xs text-subtle">Start anytime, no web knowledge needed</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-line-strong p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 font-mono text-sm font-bold text-white">
              DB
            </span>
            <div>
              <div className="font-semibold">SQL</div>
              <div className="text-xs text-subtle">Start anytime, works with any language</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: '🔓', title: 'Lessons unlock one by one', text: 'Finish a lesson\'s task to open the next. No getting lost.' },
          { icon: '⏭️', title: 'Skip what you know', text: 'Opening CSS early? We ask if you know HTML, and you choose.' },
          { icon: '☁️', title: 'Progress saved to your account', text: 'Pick up where you left off, on any device.' },
        ].map((f) => (
          <Card key={f.title}>
            <div className="text-2xl">{f.icon}</div>
            <div className="mt-3 font-semibold">{f.title}</div>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title={
          <>
            From your first tag to <GradientText>your first app</GradientText>
          </>
        }
        text="Every section follows the same five steps: learn, practice, quiz, challenge and build. You write code from the very first minute."
      >
        <div className="flex flex-wrap justify-center gap-2">
          {journey.map((j, i) => (
            <a
              key={j.step}
              href={`#step-${i + 1}`}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-fg-soft transition hover:border-line-strong hover:text-fg"
            >
              {j.icon} {j.step}
            </a>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-24 px-4 py-24">
        {journey.map((j, i) => (
          <section
            key={j.step}
            id={`step-${i + 1}`}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            <div className={i % 2 ? 'lg:order-2' : ''}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 font-bold text-white">{i + 1}</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {j.icon} {j.step}
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight">{j.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{j.text}</p>
              <ul className="mt-6 space-y-3">
                {j.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/15 text-[10px] text-emerald-600 dark:text-emerald-300">
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              {j.step === 'Build' && (
                <Link
                  to="/ai-instructor"
                  className="mt-6 inline-block font-semibold text-fuchsia-600 hover:underline dark:text-fuchsia-400"
                >
                  Meet the AI instructor →
                </Link>
              )}
            </div>
            <div className={i % 2 ? 'lg:order-1' : ''}>{j.visual}</div>
          </section>
        ))}
      </div>

      <Roadmap />
      <CtaBanner />
    </>
  )
}
