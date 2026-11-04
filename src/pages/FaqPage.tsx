import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { faqGroups } from '../data/faq'

export default function FaqPage() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<string>('all')

  const q = query.trim().toLowerCase()
  const visible = useMemo(
    () =>
      faqGroups
        .filter((g) => group === 'all' || g.id === group)
        .map((g) => ({
          ...g,
          items: g.items.filter((i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)),
        }))
        .filter((g) => g.items.length > 0),
    [q, group],
  )

  const tabs = [{ id: 'all', title: 'All', icon: '📋' }, ...faqGroups]

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions? Answers."
        text="Everything about learning on LearnCoding: tracks, lessons, the AI instructor and your account."
      >
        <div className="relative mx-auto max-w-xl">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            aria-label="Search questions"
            className="w-full rounded-2xl border border-line-strong bg-elevated py-4 pl-12 pr-4 shadow-lg outline-none transition placeholder:text-faint focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Categories */}
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:self-start lg:overflow-visible">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setGroup(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm transition ${
                  group === t.id ? 'bg-brand-600 font-semibold text-white' : 'text-muted hover:bg-surface hover:text-fg'
                }`}
              >
                <span>{t.icon}</span>
                {t.title}
              </button>
            ))}
          </nav>

          {/* Questions */}
          <div className="min-w-0 space-y-12">
            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-line-strong p-12 text-center">
                <div className="text-4xl">🔍</div>
                <p className="mt-4 font-semibold">No questions match "{query}"</p>
                <button onClick={() => setQuery('')} className="mt-3 text-sm text-brand-600 hover:underline dark:text-brand-400">
                  Clear search
                </button>
              </div>
            )}
            {visible.map((g) => (
              <section key={g.id}>
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <span>{g.icon}</span>
                  {g.title}
                </h2>
                <div className="mt-5 space-y-3">
                  {g.items.map((f) => (
                    <details
                      key={f.q}
                      open={!!q}
                      className="group rounded-2xl border border-line bg-surface px-6 py-5 transition open:bg-surface-2"
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
              </section>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-8">
            <div className="text-2xl">✨</div>
            <h3 className="mt-3 text-lg font-semibold">Stuck on a lesson?</h3>
            <p className="mt-2 text-sm text-muted">The AI instructor gives step-by-step hints right inside every lesson.</p>
            <Link to="/ai-instructor" className="mt-4 inline-block text-sm font-semibold text-fuchsia-600 hover:underline dark:text-fuchsia-400">
              See how it works →
            </Link>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-8">
            <div className="text-2xl">🚀</div>
            <h3 className="mt-3 text-lg font-semibold">Ready to start?</h3>
            <p className="mt-2 text-sm text-muted">Create a free account and write your first web page in 5 minutes.</p>
            <Link to="/signup" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
              Create an account →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
