import Editor from '@monaco-editor/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Logo } from '../components/Layout'
import { flatLessons, getTrack } from '../data/tracks'
import type { ContentBlock, Lesson, Track } from '../data/types'
import { isDone, markDone } from '../lib/progress'
import NotFound from './NotFound'

export default function LessonPage() {
  const { trackId, lessonId } = useParams()
  const track = getTrack(trackId)
  const lesson = track && flatLessons(track).find((l) => l.id === lessonId)
  if (!track || !lesson) return <NotFound />
  // key resets the editor when moving to another lesson
  return <LessonView key={lesson.id} track={track} lesson={lesson} />
}

function Block({ block }: { block: ContentBlock }) {
  if (block.type === 'code')
    return (
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-emerald-300">
        {block.code}
      </pre>
    )
  if (block.type === 'tip')
    return (
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
        💡 {block.text}
      </div>
    )
  return <p className="leading-relaxed text-slate-300">{block.text}</p>
}

function LessonView({ track, lesson }: { track: Track; lesson: Lesson }) {
  const [code, setCode] = useState(lesson.starterCode)
  const [preview, setPreview] = useState(lesson.starterCode)
  const [results, setResults] = useState<boolean[] | null>(null)
  const [done, setDone] = useState(() => isDone(track.id, lesson.id))

  const lessons = flatLessons(track)
  const index = lessons.findIndex((l) => l.id === lesson.id)
  const prev = lessons[index - 1]
  const next = lessons[index + 1]

  // Update the preview shortly after the learner stops typing
  useEffect(() => {
    const t = setTimeout(() => setPreview(code), 300)
    return () => clearTimeout(t)
  }, [code])

  const previewDoc = useMemo(
    () =>
      `<!doctype html><html><head><style>body{font-family:system-ui,sans-serif;padding:16px;line-height:1.5}</style></head><body>${preview}</body></html>`,
    [preview],
  )

  function check() {
    const doc = new DOMParser().parseFromString(code, 'text/html')
    const r = lesson.checks.map((c) => {
      try {
        return c.test(doc, code)
      } catch {
        return false
      }
    })
    setResults(r)
    if (r.every(Boolean)) {
      markDone(track.id, lesson.id)
      setDone(true)
    }
  }

  const allPassed = results?.every(Boolean)

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden text-slate-600 sm:inline">/</span>
          <Link to={`/tracks/${track.id}`} className="hidden text-sm text-slate-400 hover:text-white sm:inline">
            {track.name}
          </Link>
        </div>
        <span className="text-sm text-slate-400">
          Lesson {index + 1} of {lessons.length}
        </span>
      </header>

      <div className="grid flex-1 overflow-hidden lg:grid-cols-[minmax(320px,2fr)_3fr]">
        {/* Lesson content */}
        <aside className="flex flex-col overflow-y-auto border-white/10 lg:border-r">
          <div className="flex-1 space-y-5 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-500">{lesson.minutes} min read</div>
            <h1 className="text-2xl font-bold">
              {lesson.title} {done && <span className="text-emerald-400">✓</span>}
            </h1>
            {lesson.content.map((b, i) => (
              <Block key={i} block={b} />
            ))}

            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
              <div className="text-sm font-semibold text-brand-100">🎯 Your task</div>
              <p className="mt-1 text-sm text-slate-200">{lesson.task}</p>
            </div>

            <ul className="space-y-2">
              {lesson.checks.map((c, i) => {
                const r = results?.[i]
                return (
                  <li key={c.label} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] ${
                        r === undefined
                          ? 'border border-white/20'
                          : r
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                      }`}
                    >
                      {r === undefined ? '' : r ? '✓' : '✕'}
                    </span>
                    <span className={r === false ? 'text-rose-200' : 'text-slate-300'}>{c.label}</span>
                  </li>
                )
              })}
            </ul>

            {allPassed && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                🎉 All checks passed. Nice work!
              </div>
            )}
          </div>

          <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-white/10 bg-slate-950 p-4">
            {prev ? (
              <Link to={`/tracks/${track.id}/${prev.id}`} className="text-sm text-slate-400 hover:text-white">
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
                className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
              >
                Reset
              </button>
              {allPassed && next ? (
                <Link
                  to={`/tracks/${track.id}/${next.id}`}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500"
                >
                  Next lesson →
                </Link>
              ) : allPassed && !next ? (
                <Link
                  to={`/tracks/${track.id}`}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500"
                >
                  Finish track
                </Link>
              ) : (
                <button
                  onClick={check}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500"
                >
                  Check my code
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Editor + preview */}
        <section className="grid min-h-[600px] grid-rows-2 lg:min-h-0">
          <div className="flex min-h-0 flex-col border-b border-white/10">
            <div className="flex h-9 items-center border-b border-white/10 bg-black/20 px-4 font-mono text-xs text-slate-400">
              index.html
            </div>
            <div className="min-h-0 flex-1">
              <Editor
                language="html"
                theme="vs-dark"
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
            <div className="flex h-9 items-center border-b border-white/10 bg-black/20 px-4 text-xs text-slate-400">
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
