import Editor from '@monaco-editor/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Logo } from '../components/Layout'
import InstructorChat from '../components/InstructorChat'
import ThemeToggle from '../components/ThemeToggle'
import { getTrack, itemPath, trackItems } from '../data/tracks'
import type { ContentBlock, Lesson, Track } from '../data/types'
import { isItemUnlocked } from '../lib/access'
import { lessonDoc, runChecks } from '../lib/render'
import { useProgress } from '../lib/progress'
import { useTheme } from '../lib/theme'
import NotFound from './NotFound'

export default function LessonPage() {
  const { trackId, lessonId } = useParams()
  const progress = useProgress()
  const track = getTrack(trackId)
  const item = track && trackItems(track).find((i) => i.kind === 'lesson' && i.id === lessonId)
  const lesson = item?.kind === 'lesson' ? item.lesson : undefined
  if (!track || !lesson) return <NotFound />
  // Locked lessons (or tracks) send the learner back to the track page
  if (!isItemUnlocked(track, lesson.id, progress)) return <Navigate to={`/tracks/${track.id}`} replace />
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
  const [aiOpen, setAiOpen] = useState(false)
  const progress = useProgress()
  const done = progress.isDone(track.id, lesson.id)
  const { theme } = useTheme()

  const items = trackItems(track)
  const at = items.findIndex((i) => i.id === lesson.id)
  const prev = items[at - 1]
  const next = items[at + 1]
  const section = items[at].section
  const sectionLessons = section.lessons
  const index = sectionLessons.indexOf(lesson)
  const nextLabel = !next ? 'Finish track' : next.kind === 'lesson' ? 'Next lesson →' : 'Section quiz →'

  // Update the preview shortly after the learner stops typing
  useEffect(() => {
    const t = setTimeout(() => setPreview(code), 300)
    return () => clearTimeout(t)
  }, [code])

  const previewDoc = useMemo(() => lessonDoc(preview), [preview])

  async function check() {
    setChecking(true)
    const r = await runChecks(lessonDoc(code), code, lesson.checks)
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
          <span className="hidden text-sm text-muted sm:inline">
            {section.title} · Lesson {index + 1} of {sectionLessons.length}
          </span>
          <button
            onClick={() => setAiOpen((o) => !o)}
            aria-expanded={aiOpen}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              aiOpen
                ? 'bg-fuchsia-600 text-white'
                : 'bg-fuchsia-500/10 text-fuchsia-700 hover:bg-fuchsia-500/20 dark:text-fuchsia-300'
            }`}
          >
            ✨ <span>AI Instructor</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* AI instructor side panel. It stays mounted so the chat survives closing. */}
      <div
        className={`fixed bottom-0 right-0 top-14 z-40 flex w-full flex-col border-l border-line bg-elevated shadow-2xl transition-transform duration-300 sm:w-[420px] ${
          aiOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
        aria-hidden={!aiOpen}
      >
        <button
          onClick={() => setAiOpen(false)}
          className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-fg"
          aria-label="Close AI instructor"
        >
          ✕
        </button>
        <InstructorChat ctx={{ lesson, code, results }} className="h-full [&>div:first-child]:pr-12" />
      </div>

      <div className="grid flex-1 overflow-hidden lg:grid-cols-[minmax(320px,2fr)_3fr]">
        {/* Lesson content */}
        <aside className="flex flex-col overflow-y-auto border-line lg:border-r">
          <div className="flex-1 space-y-5 p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-500">
              {lesson.minutes} min
              {lesson.kind === 'fix' && (
                <span className="rounded-full bg-rose-500/15 px-2 py-0.5 normal-case tracking-normal text-rose-700 dark:text-rose-300">
                  🐞 Fix the bug
                </span>
              )}
            </div>
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

            {results && !allPassed && (
              <button
                onClick={() => setAiOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-4 text-left text-sm transition hover:bg-fuchsia-500/15"
              >
                <span className="text-xl">✨</span>
                <span>
                  <span className="font-semibold">Stuck?</span>{' '}
                  <span className="text-muted">Ask the AI instructor for a hint. It won't give away the answer.</span>
                </span>
              </button>
            )}
          </div>

          <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-line bg-page p-4">
            {prev ? (
              <Link to={itemPath(track, prev)} className="text-sm text-muted hover:text-fg">
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
              {(allPassed || done) && (
                <Link
                  to={next ? itemPath(track, next) : `/tracks/${track.id}`}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  {nextLabel}
                </Link>
              )}
              {allPassed ? null : (
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
