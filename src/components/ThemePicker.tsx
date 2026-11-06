import { useState, type FormEvent } from 'react'
import { themes, type ProjectTheme } from '../data/themes'

type Details = { theme: string; title: string; idea: string }

const inputClass =
  'mt-1.5 w-full rounded-xl border border-line-strong bg-page px-4 py-3 outline-none transition placeholder:text-faint focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15'

function ThemeCard({ theme, selected, onPick }: { theme: ProjectTheme; selected: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      className={`relative flex h-full flex-col rounded-2xl border p-5 text-left transition ${
        selected ? 'border-brand-500 bg-brand-500/10 ring-4 ring-brand-500/15' : 'border-line bg-surface hover:-translate-y-0.5 hover:border-line-strong'
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs text-white">✓</span>
      )}
      <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${theme.color} text-xl`}>{theme.icon}</span>
      <span className="mt-3 font-semibold">{theme.name}</span>
      <span className="mt-1 text-xs leading-relaxed text-muted">{theme.pitch}</span>
    </button>
  )
}

/**
 * Lets the learner choose what their website is about: a theme, a name and
 * a one-sentence idea. Used when starting a project and when editing it.
 */
export default function ThemePicker({
  initial,
  submitLabel = 'Start building →',
  onSave,
  onCancel,
}: {
  initial?: Partial<Details>
  submitLabel?: string
  onSave: (d: Details) => Promise<unknown> | void
  onCancel?: () => void
}) {
  const [theme, setTheme] = useState(initial?.theme ?? '')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [idea, setIdea] = useState(initial?.idea ?? '')
  const [saving, setSaving] = useState(false)
  const picked = themes.find((t) => t.id === theme)
  const preview = picked ? Object.values(picked.ideas).slice(3, 6) : []

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!picked || !title.trim()) return
    setSaving(true)
    await onSave({ theme, title: title.trim(), idea: idea.trim() })
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold">1. Pick a theme</h2>
        <p className="mt-1 text-sm text-muted">These are recommendations. Every theme teaches the same skills, so choose what excites you.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((t) => (
            <ThemeCard
              key={t.id}
              theme={t}
              selected={t.id === theme}
              onPick={() => setTheme(t.id)}
            />
          ))}
        </div>
      </section>

      {picked && (
        <section className="animate-fade-up">
          <h2 className="text-lg font-semibold">2. Describe your project</h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <label className="block text-sm font-medium">
                Website name
                <input
                  required
                  maxLength={80}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`For example: ${picked.example.title}`}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-medium">
                Your idea in one sentence <span className="font-normal text-subtle">(optional)</span>
                <textarea
                  maxLength={300}
                  rows={3}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={picked.example.idea}
                  className={inputClass}
                />
              </label>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span>{picked.icon}</span> What you'll add along the way
              </div>
              {preview.length > 0 ? (
                <ul className="mt-3 space-y-2.5 text-sm text-muted">
                  {preview.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-brand-500">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Every step tells you what to add (text, images, a table, a form…). You decide how it fits your idea.
                </p>
              )}
              <p className="mt-4 text-xs text-subtle">You can change all of this later.</p>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-xl border border-line-strong px-6 py-3 font-semibold hover:bg-surface">
            Cancel
          </button>
        )}
        <button
          disabled={!picked || !title.trim() || saving}
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 disabled:opacity-50 disabled:shadow-none"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
