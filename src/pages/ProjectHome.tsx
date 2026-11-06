import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '../auth/ProtectedRoute'
import ThemePicker from '../components/ThemePicker'
import { getTheme } from '../data/themes'
import { itemPath } from '../data/tracks'
import { nextItem } from '../lib/access'
import { useProgress } from '../lib/progress'
import { useProject } from '../lib/project'
import { allSteps, isStepDone, isStepOpen, nextStep, openInNewTab, stepPath } from '../lib/projectSteps'
import { projectDoc } from '../lib/render'

const devices = [
  { id: 'desktop', label: '🖥️ Desktop', width: '100%' },
  { id: 'tablet', label: '📱 Tablet', width: '768px' },
  { id: 'phone', label: '📱 Phone', width: '375px' },
] as const

/** The learner's project workspace: what they are building, their progress and a live preview. */
export default function ProjectHome() {
  const project = useProject()
  const progress = useProgress()
  const steps = useMemo(() => allSteps(), [])
  const [editing, setEditing] = useState(false)
  const [device, setDevice] = useState<(typeof devices)[number]['id']>('desktop')
  const [doc, setDoc] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDoc(projectDoc(project.html, project.css)), 200)
    return () => clearTimeout(t)
  }, [project.html, project.css])

  if (project.status === 'loading') return <Spinner />

  // First visit: choose what to build
  if (!project.theme || editing)
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          {editing ? 'Project settings' : 'Your project'}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {editing ? 'Edit your project' : 'What do you want to build?'}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {editing
            ? 'Change the theme, name or idea. Your code stays exactly as it is.'
            : 'As you learn HTML and CSS, every section adds a new part to one website. Pick a theme you care about, and it will be yours from the first tag to the final design.'}
        </p>
        <div className="mt-10">
          <ThemePicker
            initial={project.theme ? { theme: project.theme, title: project.title, idea: project.idea } : undefined}
            submitLabel={editing ? 'Save changes' : 'Start building →'}
            onCancel={editing ? () => setEditing(false) : undefined}
            onSave={async (d) => {
              await project.setDetails(d)
              setEditing(false)
            }}
          />
        </div>
      </div>
    )

  const theme = getTheme(project.theme)
  const doneCount = steps.filter((s) => isStepDone(s, progress)).length
  const next = nextStep(steps, progress)
  const nextOpen = next && isStepOpen(next, progress)
  // When the next step is still locked, send the learner to the lesson they need first
  const lessonFirst = next && !nextOpen ? nextItem(next.track, progress) : null
  const empty = !project.html.trim()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      {/* Project card */}
      <div className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
        <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${theme?.color} text-3xl`}>
          {theme?.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-subtle">{theme?.name}</div>
          <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">{project.title}</h1>
          {project.idea && <p className="mt-1 text-muted">{project.idea}</p>}
        </div>
        <button onClick={() => setEditing(true)} className="self-start rounded-xl border border-line-strong px-4 py-2 text-sm font-semibold hover:bg-surface-2 sm:self-center">
          ✏️ Edit project
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Live preview */}
        <div className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-line bg-elevated shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div className="flex gap-1 rounded-lg bg-surface p-1">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`rounded-md px-3 py-1.5 text-xs transition ${device === d.id ? 'bg-elevated font-semibold shadow-sm' : 'text-muted hover:text-fg'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openInNewTab(doc)}
                disabled={empty}
                className="rounded-lg px-3 py-1.5 text-xs text-muted hover:bg-surface hover:text-fg disabled:opacity-40"
              >
                ↗ Open in new tab
              </button>
              <Link
                to={next ? stepPath(next) : stepPath(steps.at(-1)!)}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500"
              >
                {'</>'} Open editor
              </Link>
            </div>
          </div>
          <div className="flex min-h-[460px] flex-1 justify-center bg-surface-2 p-4">
            {empty ? (
              <div className="grid place-items-center text-center">
                <div>
                  <div className="text-5xl">{theme?.icon}</div>
                  <p className="mt-4 font-semibold">Your website is empty for now</p>
                  <p className="mt-1 text-sm text-muted">It grows with every section you finish. Start with step 1!</p>
                </div>
              </div>
            ) : (
              <iframe
                title="Your website"
                sandbox=""
                srcDoc={doc}
                style={{ width: devices.find((d) => d.id === device)!.width }}
                className="h-[520px] max-w-full rounded-xl border border-line bg-white shadow-sm transition-all"
              />
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold">Progress</span>
              <span className="text-sm text-muted">
                {doneCount} / {steps.length} steps
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-gradient-to-r from-brand-500 to-fuchsia-500 transition-all" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
            </div>

            {next ? (
              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-subtle">
                  Next · Step {next.number} · {next.track.name}
                </div>
                <div className="mt-1 font-semibold">{next.section.project.title}</div>
                {theme?.ideas[next.section.id] && (
                  <p className="mt-2 rounded-xl bg-brand-500/10 p-3 text-sm text-fg-soft">💡 {theme.ideas[next.section.id]}</p>
                )}
                {nextOpen ? (
                  <Link to={stepPath(next)} className="mt-4 block rounded-xl bg-brand-600 py-3 text-center font-semibold text-white hover:bg-brand-500">
                    Work on this step →
                  </Link>
                ) : (
                  lessonFirst && (
                    <>
                      <p className="mt-3 text-sm text-muted">First, learn what you need in "{next.section.title}".</p>
                      <Link
                        to={itemPath(next.track, lessonFirst)}
                        className="mt-3 block rounded-xl bg-brand-600 py-3 text-center font-semibold text-white hover:bg-brand-500"
                      >
                        Continue learning →
                      </Link>
                    </>
                  )
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-100">
                🎉 All steps done! Your website is complete. Download it from the editor and share it.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-line bg-surface p-4">
            <div className="px-2 pb-2 text-sm font-semibold">All steps</div>
            <ol className="max-h-[360px] space-y-0.5 overflow-y-auto">
              {steps.map((s) => {
                const done = isStepDone(s, progress)
                const open = isStepOpen(s, progress)
                const row = (
                  <>
                    <span className="w-5 text-center text-sm">{done ? '✅' : open ? '▶️' : '🔒'}</span>
                    <span className="flex-1 truncate">
                      {s.number}. {s.section.project.title}
                    </span>
                    <span className="text-[11px] text-subtle">{s.track.name}</span>
                  </>
                )
                return (
                  <li key={s.track.id + s.section.id}>
                    {open ? (
                      <Link to={stepPath(s)} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-surface-2">
                        {row}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 px-2 py-2 text-sm text-subtle">{row}</div>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
