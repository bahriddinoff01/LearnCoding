import Editor from '@monaco-editor/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Spinner } from '../auth/ProtectedRoute'
import InstructorChat from '../components/InstructorChat'
import { Logo } from '../components/Layout'
import ThemeToggle from '../components/ThemeToggle'
import { starterSiteHtml } from '../data/starterSite'
import { itemPath, projectTracks, trackItems } from '../data/tracks'
import type { Lesson, Section, Track } from '../data/types'
import { isItemUnlocked } from '../lib/access'
import { useProgress } from '../lib/progress'
import { useProject, type SaveStatus } from '../lib/project'
import { projectCode, projectDoc, runChecks } from '../lib/render'
import { useTheme } from '../lib/theme'

type Step = { track: Track; section: Section; number: number }

/** Every project step across the tracks, numbered in order (they build one site). */
function allSteps(): Step[] {
  let n = 0
  return projectTracks().flatMap((track) => track.sections.map((section) => ({ track, section, number: ++n })))
}

const stepId = (s: Step) => `project-${s.section.id}`

function SaveBadge({ status }: { status: SaveStatus }) {
  const map: Record<SaveStatus, [string, string]> = {
    loading: ['Loading…', 'text-subtle'],
    saved: ['✓ Saved', 'text-emerald-600 dark:text-emerald-400'],
    saving: ['Saving…', 'text-subtle'],
    unsaved: ['Editing…', 'text-subtle'],
    error: ['⚠ Not saved', 'text-rose-600 dark:text-rose-400'],
  }
  const [text, color] = map[status]
  return <span className={`text-xs ${color}`}>{text}</span>
}

function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

export default function ProjectPage() {
  const { trackId, sectionId } = useParams()
  const progress = useProgress()
  const project = useProject()
  const { theme } = useTheme()
  const steps = useMemo(() => allSteps(), [])

  const [file, setFile] = useState<'html' | 'css'>('html')
  const [results, setResults] = useState<boolean[] | null>(null)
  const [checking, setChecking] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [preview, setPreview] = useState({ html: '', css: '' })

  // The step from the address, or the learner's next unfinished step
  const step =
    steps.find((s) => s.track.id === trackId && s.section.id === sectionId) ??
    steps.find((s) => !progress.isDone(s.track.id, stepId(s)) && isItemUnlocked(s.track, stepId(s), progress)) ??
    steps.at(-1)!

  const unlocked = isItemUnlocked(step.track, stepId(step), progress)
  const done = progress.isDone(step.track.id, stepId(step))
  const { requirements } = step.section.project
  const items = trackItems(step.track)
  const afterStep = items[items.findIndex((i) => i.id === stepId(step)) + 1]
  const nextTrack = projectTracks()[projectTracks().indexOf(step.track) + 1]
  const isCssStep = step.track.id !== 'html'

  // Reset the check results when moving to another step
  const [shownFor, setShownFor] = useState(stepId(step))
  if (shownFor !== stepId(step)) {
    setShownFor(stepId(step))
    setResults(null)
  }

  // Update the preview shortly after typing stops
  useEffect(() => {
    const t = setTimeout(() => setPreview({ html: project.html, css: project.css }), 300)
    return () => clearTimeout(t)
  }, [project.html, project.css])

  if (project.status === 'loading') return <Spinner />

  async function check() {
    setChecking(true)
    const r = await runChecks(projectDoc(project.html, project.css), projectCode(project.html, project.css), requirements)
    setResults(r)
    setChecking(false)
    if (r.every(Boolean) && unlocked) await progress.markDone(step.track.id, stepId(step))
  }

  const allPassed = !!results?.every(Boolean)

  // A lesson-shaped description of the step, so the AI instructor can help with it
  const stepAsLesson: Lesson = {
    id: stepId(step),
    title: step.section.project.title,
    minutes: 0,
    content: [{ type: 'text', text: step.section.project.brief }, ...step.section.project.tips.map((t) => ({ type: 'tip' as const, text: t }))],
    task: step.section.project.brief,
    starterCode: '',
    checks: requirements,
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Logo />
          <span className="hidden text-faint sm:inline">/</span>
          <span className="hidden truncate text-sm font-semibold sm:inline">🌐 My website</span>
          <SaveBadge status={project.status} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              download('index.html', project.html)
              if (project.css) download('style.css', project.css)
            }}
            className="hidden rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-fg md:block"
            title="Download your website files"
          >
            ⬇ Download
          </button>
          <button
            onClick={() => setAiOpen((o) => !o)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              aiOpen ? 'bg-fuchsia-600 text-white' : 'bg-fuchsia-500/10 text-fuchsia-700 hover:bg-fuchsia-500/20 dark:text-fuchsia-300'
            }`}
          >
            ✨ <span className="hidden sm:inline">AI Instructor</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* AI instructor side panel */}
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
        <InstructorChat
          key={stepId(step)}
          ctx={{ lesson: stepAsLesson, code: projectCode(project.html, project.css), results }}
          className="h-full [&>div:first-child]:pr-12"
        />
      </div>

      <div className="grid flex-1 overflow-hidden lg:grid-cols-[minmax(340px,2fr)_3fr]">
        {/* Step brief */}
        <aside className="flex flex-col overflow-y-auto border-line lg:border-r">
          <div className="flex-1 space-y-5 p-6">
            <button
              onClick={() => setShowSteps((s) => !s)}
              className="flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm hover:bg-surface-2"
            >
              <span>
                <span className="text-subtle">Step {step.number} of {steps.length} · </span>
                <span className="font-semibold">{step.track.name}</span>
              </span>
              <span className="text-muted">{showSteps ? '▲' : 'All steps ▼'}</span>
            </button>

            {showSteps && (
              <ol className="space-y-1 rounded-xl border border-line p-2">
                {steps.map((s) => {
                  const sDone = progress.isDone(s.track.id, stepId(s))
                  const sOpen = isItemUnlocked(s.track, stepId(s), progress)
                  const current = s === step
                  return (
                    <li key={stepId(s) + s.track.id}>
                      <Link
                        to={`/project/${s.track.id}/${s.section.id}`}
                        onClick={() => setShowSteps(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${current ? 'bg-brand-600 text-white' : 'hover:bg-surface'}`}
                      >
                        <span className="w-5 text-center">{sDone ? '✅' : sOpen ? '▶️' : '🔒'}</span>
                        <span className="flex-1 truncate">
                          {s.number}. {s.section.project.title}
                        </span>
                        <span className={`text-xs ${current ? 'text-white/70' : 'text-subtle'}`}>{s.track.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            )}

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                {step.track.name} · Section {step.track.sections.indexOf(step.section) + 1}: {step.section.title}
              </div>
              <h1 className="mt-2 text-2xl font-bold">
                {step.section.project.title} {done && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
              </h1>
            </div>

            {!unlocked && (
              <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-900 dark:text-amber-100">
                🔒 This step unlocks after you finish the lessons and quiz of "{step.section.title}". You can still edit your website
                freely.{' '}
                <Link to={`/tracks/${step.track.id}`} className="font-semibold underline">
                  Go to {step.track.name}
                </Link>
              </div>
            )}

            {isCssStep && !project.html.trim() && (
              <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 text-sm">
                <p className="font-semibold">You don't have a website yet</p>
                <p className="mt-1 text-muted">
                  It looks like you skipped the HTML course. Start from a ready-made personal page, then make it yours.
                </p>
                <button
                  onClick={() => project.setHtml(starterSiteHtml)}
                  className="mt-3 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-500"
                >
                  Use a starter website
                </button>
              </div>
            )}

            <p className="leading-relaxed text-fg-soft">{step.section.project.brief}</p>

            <div className="space-y-2">
              {step.section.project.tips.map((t) => (
                <div key={t} className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-900 dark:text-amber-100">
                  💡 {t}
                </div>
              ))}
            </div>

            <div>
              <div className="text-sm font-semibold">✅ Requirements</div>
              <ul className="mt-3 space-y-2">
                {requirements.map((c, i) => {
                  const r = results?.[i]
                  return (
                    <li key={c.label} className="flex items-center gap-3 text-sm">
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] ${
                          r === undefined ? 'border border-line-strong' : r ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {r === undefined ? '' : r ? '✓' : '✕'}
                      </span>
                      <span className={r === false ? 'text-rose-700 dark:text-rose-200' : 'text-fg-soft'}>{c.label}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {allPassed && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-800 dark:text-emerald-100">
                🎉 {unlocked ? 'Step complete! Your website just got better.' : 'All requirements pass. Finish the lessons to unlock this step.'}
              </div>
            )}

            {results && !allPassed && (
              <button
                onClick={() => setAiOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-4 text-left text-sm hover:bg-fuchsia-500/15"
              >
                <span className="text-xl">✨</span>
                <span>
                  <span className="font-semibold">Stuck?</span>{' '}
                  <span className="text-muted">Ask the AI instructor for a hint about your website.</span>
                </span>
              </button>
            )}
          </div>

          <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-line bg-page p-4">
            <Link to={`/tracks/${step.track.id}`} className="text-sm text-muted hover:text-fg">
              ← {step.track.name}
            </Link>
            {(done || (allPassed && unlocked)) && (afterStep || nextTrack) ? (
              <Link
                to={afterStep ? itemPath(step.track, afterStep) : `/tracks/${nextTrack!.id}`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                {afterStep ? 'Next section →' : `Start ${nextTrack!.name} →`}
              </Link>
            ) : (
              <button
                onClick={check}
                disabled={checking}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:opacity-60"
              >
                {checking ? 'Checking…' : 'Check my website'}
              </button>
            )}
          </div>
        </aside>

        {/* Editor + preview */}
        <section className="grid min-h-[640px] grid-rows-2 lg:min-h-0">
          <div className="flex min-h-0 flex-col border-b border-line">
            <div className="flex h-10 items-end gap-1 border-b border-line bg-surface px-2">
              {(['html', 'css'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFile(f)}
                  className={`rounded-t-lg px-4 py-2 font-mono text-xs transition ${
                    file === f ? 'bg-page font-semibold text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {f === 'html' ? 'index.html' : 'style.css'}
                </button>
              ))}
              {file === 'css' && !/style\.css/.test(project.html) && (
                <span className="mb-2 ml-auto truncate text-[11px] text-amber-600 dark:text-amber-400">
                  Link this file in index.html to see it
                </span>
              )}
            </div>
            <div className="min-h-0 flex-1">
              <Editor
                key={file}
                language={file}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={file === 'html' ? project.html : project.css}
                onChange={(v) => {
                  setResults(null)
                  if (file === 'html') project.setHtml(v ?? '')
                  else project.setCss(v ?? '')
                }}
                options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on', scrollBeyondLastLine: false, tabSize: 2, padding: { top: 12 } }}
              />
            </div>
          </div>
          <div className="flex min-h-0 flex-col">
            <div className="flex h-9 items-center justify-between border-b border-line bg-surface px-4 text-xs text-muted">
              <span>Live preview · your website</span>
            </div>
            <iframe title="Your website" sandbox="" srcDoc={projectDoc(preview.html, preview.css)} className="min-h-0 flex-1 bg-white" />
          </div>
        </section>
      </div>
    </div>
  )
}

