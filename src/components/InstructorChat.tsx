import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  focusCheck,
  getHint,
  getReply,
  hintLevels,
  type HintLevel,
  type InstructorContext,
  type Reply,
} from '../lib/mockInstructor'
import { AiAvatar } from './ui'

type Message = { from: 'you' | 'ai' } & Reply

const suggestions = ["I'm stuck", 'Why is my check failing?', 'Just give me the code 😅']

/**
 * Chat with the AI instructor. Used in the lesson panel and on the demo page.
 * Replies are simulated for now (see lib/mockInstructor.ts).
 */
export default function InstructorChat({
  ctx,
  dailyHints = 10,
  className = '',
}: {
  ctx: InstructorContext
  dailyHints?: number
  className?: string
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'ai',
      text: `Hi! I'm your AI instructor for "${ctx.lesson.title}". I won't write the code for you, but I'll help you figure it out. Where are you stuck?`,
    },
  ])
  const [nextLevel, setNextLevel] = useState<HintLevel>(1)
  const [hintsLeft, setHintsLeft] = useState(dailyHints)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Start the hint ladder again when the learner moves on to a different check
  const currentFocus = focusCheck(ctx)?.index ?? null
  if (currentFocus !== focusIndex) {
    setFocusIndex(currentFocus)
    setNextLevel(1)
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  function respond(userText: string, makeReply: () => Reply) {
    if (typing) return
    if (hintsLeft <= 0) {
      setMessages((m) => [
        ...m,
        { from: 'you', text: userText },
        { from: 'ai', text: "You've used all your hints for today. Try re-reading the lesson, and I'll be back tomorrow! 🌙" },
      ])
      return
    }
    setMessages((m) => [...m, { from: 'you', text: userText }])
    setTyping(true)
    // A short pause so it feels like a conversation
    setTimeout(() => {
      const reply = makeReply()
      setMessages((m) => [...m, { from: 'ai', ...reply }])
      setHintsLeft((h) => h - 1)
      if (reply.level && reply.level >= nextLevel && reply.level < 4) setNextLevel((reply.level + 1) as HintLevel)
      setTyping(false)
    }, 700 + Math.random() * 500)
  }

  function askLevel(level: HintLevel) {
    const h = hintLevels[level - 1]
    respond(h.ask, () => getHint(level, ctx))
  }

  function send(e?: FormEvent, text = input) {
    e?.preventDefault()
    const t = text.trim()
    if (!t) return
    setInput('')
    respond(t, () => getReply(t, ctx, nextLevel))
  }

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <AiAvatar />
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              AI Instructor
              <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300">
                Preview
              </span>
            </div>
            <div className="text-xs text-subtle">Hints, not answers</div>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            hintsLeft > 3
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
          }`}
        >
          {hintsLeft} hints left
        </span>
      </div>

      {/* Messages */}
      <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((m, i) =>
          m.from === 'ai' ? (
            <div key={i} className="flex gap-3">
              <AiAvatar />
              <div className="max-w-[88%] space-y-2">
                {m.level && (
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400">
                    Hint · level {m.level} · {hintLevels[m.level - 1].name}
                  </div>
                )}
                <div className="rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-3 text-sm leading-relaxed text-fg-soft">
                  {m.text}
                  {m.code && (
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-300">
                      {m.code}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-3 text-sm text-white">{m.text}</div>
            </div>
          ),
        )}
        {typing && (
          <div className="flex items-center gap-3">
            <AiAvatar />
            <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-4">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-2 w-2 animate-bounce rounded-full bg-muted"
                  style={{ animationDelay: `${d * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hint ladder */}
      <div className="border-t border-line px-4 pt-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-subtle">Hint ladder</div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {hintLevels.map((h) => {
            const available = h.level <= nextLevel
            const used = h.level < nextLevel
            return (
              <button
                key={h.level}
                onClick={() => askLevel(h.level)}
                disabled={!available || typing}
                title={available ? h.ask : 'Try the earlier hints first'}
                className={`rounded-lg px-2 py-2 text-[11px] font-medium transition ${
                  h.level === nextLevel
                    ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-500'
                    : used
                      ? 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-200'
                      : 'cursor-not-allowed bg-surface text-faint'
                }`}
              >
                {h.level}. {h.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Suggestions + input */}
      <div className="px-4 pb-4 pt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(undefined, s)}
              disabled={typing}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted transition hover:border-line-strong hover:text-fg"
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your code…"
            maxLength={300}
            className="min-w-0 flex-1 rounded-xl border border-line-strong bg-page px-4 py-2.5 text-sm outline-none transition placeholder:text-faint focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/15"
          />
          <button
            disabled={!input.trim() || typing}
            className="rounded-xl bg-fuchsia-600 px-4 text-sm font-semibold text-white transition hover:bg-fuchsia-500 disabled:opacity-50"
            aria-label="Send"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  )
}
