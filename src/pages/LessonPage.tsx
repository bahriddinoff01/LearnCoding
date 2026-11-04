import Editor from '@monaco-editor/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Logo } from '../components/Layout'
import ThemeToggle from '../components/ThemeToggle'
import { flatLessons, getTrack } from '../data/tracks'
import type { Check, ContentBlock, Lesson, Track } from '../data/types'
import { isLessonUnlocked } from '../lib/access'
import { useProgress } from '../lib/progress'
import { useTheme } from '../lib/theme'
import NotFound from './NotFound'

const pageStyle = 'body{font-family:system-ui,sans-serif;padding:16px;line-height:1.5}'
const wrap = (code: string) => `<!doctype html><html><head><style>${pageStyle}</style></head><body>${code}</body></html>`

/**
 * Renders the learner's code in a hidden frame so checks can read real
 * computed styles. Scripts are not allowed to run in this frame.
 */
function runChecks(code: string, checks: Check[]): Promise<boolean[]> {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe')
    frame.setAttribute('sandbox', 'allow-same-origin')
    frame.style.cssText = 'position:fixed;left:-9999px;width:800px;height:600px;border:0'
    frame.onload = () => {
      const doc = frame.contentDocument!
      resolve(
        checks.map((c) => {
          try {
            return c.test(doc, code)
          } catch {
            return false
          }
        }),
      )
      frame.remove()
    }
    frame.srcdoc = wrap(code)
    document.body.appendChild(frame)
  })
}

export default function LessonPage() {
  const { trackId, lessonId } = useParams()
  const progress = useProgress()
  const track = getTrack(trackId)
  const lesson = track && flatLessons(track).find((l) => l.id === lessonId)
  if (!track || !lesson) return <NotFound />
  // Locked lessons (or tracks) send the learner back to the track page
  if (!isLessonUnlocked(track, lesson.id, progress)) return <Navigate to={`/tracks/${track.id}`} replace />
  // key resets the editor when moving to another lesson
  return <LessonView key={lesson.id} track={track} lesson={lesson} />
}

function Block({ block }: { block: ContentBlock }) {
  if (block.type === 'code')
    return (
      <pre className="overflow-x-auto rounded-xl border border-line bg-slate-900 p-4 font-mono text-sm text-emerald-300">
        {block.code}
      </pre>
    )
  if (block.type === 'tip')
    return (
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-900 dark:text-amber-100">
        💡 {block.text}
      </div>
    )
  return <p className="leading-relaxed text-fg-soft">{block.text}</p>
}

function LessonView({ track, lesson }: { track: Track; lesson: Lesson }) {
  const [code, setCode] = useState(lesson.starterCode)
  const [preview, setPreview] = useState(lesson.starterCode)
  const [results, setResults] = useState<boolean[] | null>(null)
  const [checking, setChecking] = useState(false)
  const progress = useProgress()
  const done = progress.isDone(track.id, lesson.id)
  const { theme } = useTheme()

  const lessons = flatLessons(track)
  const index = lessons.findIndex((l) => l.id === lesson.id)
  const prev = lessons[index - 1]
  const next = lessons[index + 1]

  // Update the preview shortly after the learner stops typing
  useEffect(() => {
    const t = setTimeout(() => setPreview(code), 300)
    return () => clearTimeout(t)
  }, [code])

  const previewDoc = useMemo(() => wrap(preview), [preview])

  async function check() {
    setChecking(true)
    const r = await runChecks(code, lesson.checks)
    setResults(r)
    setChecking(false)
    if (r.every(Boolean)) await progress.markDone(track.id, lesson.id)
  }

  const allPassed = results?.every(Boolean)

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden text-faint sm:inline">/</span>
          <Link to={`/tracks/${track.id}`} className="hidden text-sm text-muted hover:text-fg sm:inline">
            {track.name}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">
            Lesson {index + 1} of {lessons.length}
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid flex-1 overflow-hidden lg:grid-cols-[minmax(320px,2fr)_3fr]">
        {/* Lesson content */}
        <aside className="flex flex-col overflow-y-auto border-line lg:border-r">
          <div className="flex-1 space-y-5 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-500">{lesson.minutes} min read</div>
            <h1 className="text-2xl font-bold">
              {lesson.title} {done && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
            </h1>
            {lesson.content.map((b, i) => (
              <Block key={i} block={b} />
            ))}

            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
              <div className="text-sm font-semibold text-brand-700 dark:text-brand-100">🎯 Your task</div>
              <p className="mt-1 text-sm text-fg-soft">{lesson.task}</p>
            </div>

            <ul className="space-y-2">
              {lesson.checks.map((c, i) => {
                const r = results?.[i]
                return (
                  <li key={c.label} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] ${
                        r === undefined
                          ? 'border border-line-strong'
                          : r
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                      }`}
                    >
                      {r === undefined ? '' : r ? '✓' : '✕'}
                    </span>
                    <span className={r === false ? 'text-rose-700 dark:text-rose-200' : 'text-fg-soft'}>{c.label}</span>
                  </li>
                )
              })}
            </ul>

            {allPassed && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-800 dark:text-emerald-100">
                🎉 All checks passed. Nice work!
              </div>
            )}
          </div>

          <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-line bg-page p-4">
            {prev ? (
              <Link to={`/tracks/${track.id}/${prev.id}`} className="text-sm text-muted hover:text-fg">
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCode(lesson.starterCode)
                  setResults(null)
                }}
                className="rounded-lg border border-line-strong px-4 py-2 text-sm hover:bg-surface"
              >
                Reset
              </button>
              {allPassed && next ? (
                <Link
                  to={`/tracks/${track.id}/${next.id}`}
                  className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-500"
                >
                  Next lesson →
                </Link>
              ) : allPassed && !next ? (
                <Link
                  to={`/tracks/${track.id}`}
                  className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-500"
                >
                  Finish track
                </Link>
              ) : (
                <button
                  onClick={check}
                  disabled={checking}
                  className="rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-500 disabled:opacity-60"
                >
                  {checking ? 'Checking…' : 'Check my code'}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Editor + preview */}
        <section className="grid min-h-[600px] grid-rows-2 lg:min-h-0">
          <div className="flex min-h-0 flex-col border-b border-line">
            <div className="flex h-9 items-center border-b border-line bg-surface px-4 font-mono text-xs text-muted">
              index.html
            </div>
            <div className="min-h-0 flex-1">
              <Editor
                language="html"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={code}
                onChange={(v) => {
                  setCode(v ?? '')
                  setResults(null)
                }}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>
          <div className="flex min-h-0 flex-col">
            <div className="flex h-9 items-center border-b border-line bg-surface px-4 text-xs text-muted">
              Live preview
            </div>
            {/* sandbox keeps learner code isolated from the site */}
            <iframe title="Preview" sandbox="allow-scripts" srcDoc={previewDoc} className="min-h-0 flex-1 bg-white" />
          </div>
        </section>
      </div>
    </div>
  )
}
