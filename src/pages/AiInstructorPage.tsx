import { Link } from 'react-router-dom'
import InstructorChat from '../components/InstructorChat'
import { Card, CtaBanner, GradientText, Heading, PageHeader } from '../components/ui'
import { htmlSections } from '../data/html'
import type { InstructorContext } from '../lib/mockInstructor'

// A sample lesson with one failing check, so the demo has something to help with
const demoLesson = htmlSections[0].lessons[1]
const demoCode = `<h1>My favorite things</h1>
<a href="https://developer.mozilla.org">Learn on MDN</a>
<img src="https://picsum.photos/300/200">`
const demoCtx: InstructorContext = { lesson: demoLesson, code: demoCode, results: [true, true, true, false] }

const ladder = [
  {
    level: 1,
    name: 'Nudge',
    icon: '👉',
    text: 'A question that points your thinking in the right direction.',
    example: '"What does the image check ask for? Which attribute might be involved?"',
  },
  {
    level: 2,
    name: 'Concept',
    icon: '💡',
    text: 'The idea behind the problem, linked to the lesson that taught it.',
    example: '"The alt attribute describes an image for screen readers. You saw it in Lesson 2."',
  },
  {
    level: 3,
    name: 'Direction',
    icon: '🧭',
    text: 'Where in your own code to look, without fixing it for you.',
    example: '"You have an <img> on line 3. Does it have everything the check asks for?"',
  },
  {
    level: 4,
    name: 'Example',
    icon: '🧩',
    text: 'A short example of the same pattern on a different problem.',
    example: '<img src="cat.jpg" alt="A sleeping orange cat">',
  },
]

const will = [
  'Ask questions that help you think',
  'Explain error messages in plain language',
  'Point you to the lesson you need',
  'Review your finished project',
  'Cheer you on when you get it right',
]

const wont = [
  'Write your project code for you',
  'Fix your code with a full solution',
  'Skip straight to the answer',
  'Do your quizzes for you',
]

const context = [
  { icon: '📖', title: 'The lesson', text: 'What you are learning right now, and what came before it.' },
  { icon: '🧑‍💻', title: 'Your code', text: 'Exactly what you wrote, so hints point at your real lines.' },
  { icon: '✅', title: 'Your checks', text: 'Which checks pass and which fail, so it helps with the right thing.' },
  { icon: '📈', title: 'Your progress', text: 'Topics you found hard before, so it can review them with you.' },
]

function DemoLesson() {
  const lines = demoCode.split('\n')
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-elevated shadow-xl">
      <div className="border-b border-line px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-500">Sample lesson · HTML</div>
        <div className="mt-1 font-semibold">{demoLesson.title}</div>
        <p className="mt-2 text-sm text-muted">🎯 {demoLesson.task}</p>
      </div>
      <div className="bg-slate-900 px-5 py-4 font-mono text-[13px] leading-7 text-slate-200">
        <div className="mb-2 text-xs text-slate-500">index.html</div>
        {lines.map((l, i) => (
          <div key={i} className={`flex ${i === 2 ? '-mx-5 bg-rose-500/15 px-5' : ''}`}>
            <span className="mr-4 w-4 select-none text-right text-slate-600">{i + 1}</span>
            <span className="whitespace-pre-wrap break-all">{l}</span>
          </div>
        ))}
      </div>
      <ul className="space-y-2 px-5 py-4">
        {demoLesson.checks.map((c, i) => {
          const ok = demoCtx.results![i]
          return (
            <li key={c.label} className="flex items-center gap-3 text-sm">
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[10px] text-white ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`}
              >
                {ok ? '✓' : '✕'}
              </span>
              <span className={ok ? 'text-fg-soft' : 'text-rose-600 dark:text-rose-300'}>{c.label}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function AiInstructorPage() {
  return (
    <>
      <PageHeader
        tone="fuchsia"
        eyebrow="AI Instructor · Preview"
        title={
          <>
            A mentor that helps you <GradientText>think</GradientText>, not copy
          </>
        }
        text="Stuck on a task? The AI instructor guides you like a patient teacher: one hint at a time, never the full answer. You still write every line, so you actually learn."
      >
        <a
          href="#demo"
          className="inline-block rounded-xl bg-fuchsia-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-fuchsia-600/30 transition hover:-translate-y-0.5 hover:bg-fuchsia-500"
        >
          Try the demo ↓
        </a>
      </PageHeader>

      {/* Live demo */}
      <section id="demo" className="mx-auto max-w-6xl px-4 py-24">
        <Heading
          eyebrow="Try it"
          title="Help a learner fix their page"
          text="This learner's image check is failing. Ask the instructor for help: press a hint button, pick a suggestion, or type your own question."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <DemoLesson />
          <div className="h-[560px] overflow-hidden rounded-2xl border border-line bg-elevated shadow-xl">
            <InstructorChat ctx={demoCtx} className="h-full" />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-subtle">
          Preview: replies are simulated for now. The real instructor will use an AI model with the same rules.
        </p>
      </section>

      {/* Hint ladder */}
      <section className="border-y border-line bg-surface/50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Heading
            eyebrow="The hint ladder"
            title="Help in four small steps"
            text="Every hint gives a little more help than the one before. You climb only as high as you need, so you always do the thinking."
          />
          <div className="relative mt-14 grid gap-5 md:grid-cols-4">
            {ladder.map((h) => (
              <div key={h.level} className="relative rounded-2xl border border-line bg-elevated p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{h.icon}</span>
                  <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300">
                    Level {h.level}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{h.name}</h3>
                <p className="mt-2 text-sm text-muted">{h.text}</p>
                <div
                  className={`mt-4 rounded-lg p-3 text-xs ${
                    h.level === 4 ? 'bg-slate-900 font-mono text-emerald-300' : 'bg-surface-2 italic text-fg-soft'
                  }`}
                >
                  {h.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Will / won't */}
      <section className="mx-auto max-w-5xl px-4 py-24">
        <Heading eyebrow="Ground rules" title="What it will and won't do" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-emerald-500/30">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">✓ It will</div>
            <ul className="mt-5 space-y-3">
              {will.map((w) => (
                <li key={w} className="flex gap-3 text-sm">
                  <span className="text-emerald-500">✓</span>
                  {w}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="border-rose-500/30">
            <div className="flex items-center gap-2 font-semibold text-rose-700 dark:text-rose-300">✕ It won't</div>
            <ul className="mt-5 space-y-3">
              {wont.map((w) => (
                <li key={w} className="flex gap-3 text-sm">
                  <span className="text-rose-500">✕</span>
                  {w}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg bg-surface-2 p-3 text-xs text-muted">
              Ask for the answer and it replies: <i>"I can't write it for you, but let's break it down."</i>
            </p>
          </Card>
        </div>
      </section>

      {/* Context */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Heading
          eyebrow="Context-aware"
          title="It knows what you're working on"
          text="Generic chatbots guess. The instructor sees your lesson and your code, so every hint fits your exact situation."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {context.map((c) => (
            <Card key={c.title}>
              <div className="text-3xl">{c.icon}</div>
              <div className="mt-4 font-semibold">{c.title}</div>
              <p className="mt-1 text-sm text-muted">{c.text}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-line bg-surface p-6 text-center sm:p-8">
          <div className="text-2xl">⏳</div>
          <div className="mt-3 font-semibold">10 hints a day</div>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
            A daily limit keeps LearnCoding free and nudges you to try on your own first. Most tasks need only one or two
            hints.
          </p>
          <Link to="/faq" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
            More questions? Read the FAQ →
          </Link>
        </div>
      </section>

      <CtaBanner
        title="Learn with a mentor by your side"
        text="Start a lesson, and when you get stuck, the AI instructor is one click away."
        label="Start learning →"
        to="/tracks/html"
      />
    </>
  )
}
