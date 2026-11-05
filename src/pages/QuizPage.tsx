import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getTrack, itemPath, trackItems } from '../data/tracks'
import type { QuizQuestion, Section, Track } from '../data/types'
import { isItemUnlocked } from '../lib/access'
import { useProgress } from '../lib/progress'
import NotFound from './NotFound'

const PASS = 0.7

// Shuffles question order and answer order, keeping track of the right answer
function shuffled(questions: QuizQuestion[]) {
  const mix = <T,>(arr: T[]) => arr.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v)
  return mix(questions).map((q) => {
    const order = mix(q.options.map((_, i) => i))
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
  })
}

export default function QuizPage() {
  const { trackId, sectionId } = useParams()
  const progress = useProgress()
  const track = getTrack(trackId)
  const section = track?.sections.find((s) => s.id === sectionId)
  if (!track || !section) return <NotFound />
  if (!isItemUnlocked(track, `quiz-${section.id}`, progress)) return <Navigate to={`/tracks/${track.id}`} replace />
  return <Quiz key={section.id} track={track} section={section} />
}

function Quiz({ track, section }: { track: Track; section: Section }) {
  const progress = useProgress()
  const [round, setRound] = useState(0)
  const questions = useMemo(() => shuffled(section.quiz), [section, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = questions[index]
  const answered = picked !== null
  const items = trackItems(track)
  const after = items[items.findIndex((i) => i.id === `quiz-${section.id}`) + 1]

  function pick(i: number) {
    if (answered) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }

  async function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setPicked(null)
      return
    }
    setFinished(true)
    if (score / questions.length >= PASS) await progress.markDone(track.id, `quiz-${section.id}`)
  }

  function retry() {
    setRound((r) => r + 1)
    setIndex(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
  }

  const passed = score / questions.length >= PASS

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Link to={`/tracks/${track.id}`} className="text-sm text-muted hover:text-fg">
        ← {track.name}
      </Link>
      <div className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
        Section quiz · {section.title}
      </div>

      {finished ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-8 text-center">
          <div className="text-6xl">{passed ? '🎉' : '💪'}</div>
          <h1 className="mt-4 text-3xl font-bold">
            {score} / {questions.length} correct
          </h1>
          <p className="mt-3 text-muted">
            {passed
              ? 'You passed! The project step for this section is now unlocked.'
              : `You need ${Math.ceil(PASS * questions.length)} correct to pass. Review the lessons and try again. The questions get shuffled.`}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {passed && after ? (
              <Link to={itemPath(track, after)} className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-500">
                Continue to project step →
              </Link>
            ) : (
              <button onClick={retry} className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-500">
                Try again
              </button>
            )}
            <Link to={`/tracks/${track.id}`} className="rounded-xl border border-line-strong px-6 py-3 font-semibold hover:bg-surface">
              Back to {track.name}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Progress dots */}
          <div className="mt-6 flex gap-1.5">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < index ? 'bg-brand-500' : i === index ? 'bg-brand-300' : 'bg-surface-2'}`}
              />
            ))}
          </div>
          <div className="mt-2 text-xs text-subtle">
            Question {index + 1} of {questions.length}
          </div>

          <h1 className="mt-6 text-2xl font-bold leading-snug">{q.q}</h1>
          {q.code && (
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm text-emerald-300">{q.code}</pre>
          )}

          <div className="mt-6 space-y-3">
            {q.options.map((o, i) => {
              const isRight = i === q.answer
              const isPicked = i === picked
              let cls = 'border-line hover:border-line-strong hover:bg-surface'
              if (answered && isRight) cls = 'border-emerald-500 bg-emerald-500/10'
              else if (answered && isPicked) cls = 'border-rose-500 bg-rose-500/10'
              else if (answered) cls = 'border-line opacity-60'
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={answered}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left transition ${cls}`}
                >
                  <span className={/[<>{}]/.test(o) ? 'font-mono text-sm' : ''}>{o}</span>
                  {answered && isRight && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
                  {answered && isPicked && !isRight && <span className="text-rose-600 dark:text-rose-400">✕</span>}
                </button>
              )
            })}
          </div>

          {answered && (
            <div
              className={`mt-6 rounded-xl p-4 text-sm ${
                picked === q.answer
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-100'
                  : 'bg-rose-500/10 text-rose-800 dark:text-rose-100'
              }`}
            >
              <b>{picked === q.answer ? 'Correct! ' : 'Not quite. '}</b>
              {q.explain}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={next}
              disabled={!answered}
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:opacity-40"
            >
              {index + 1 < questions.length ? 'Next question →' : 'See results'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
