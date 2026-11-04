import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/** Small colored label above a heading. */
export function Eyebrow({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'fuchsia' }) {
  const color = tone === 'brand' ? 'text-brand-600 dark:text-brand-400' : 'text-fuchsia-600 dark:text-fuchsia-400'
  return <div className={`text-sm font-semibold uppercase tracking-wider ${color}`}>{children}</div>
}

/** Centered section heading. */
export function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-muted">{text}</p>}
    </div>
  )
}

/** Big header at the top of an inner page. */
export function PageHeader({
  eyebrow,
  title,
  text,
  tone = 'brand',
  children,
}: {
  eyebrow: string
  title: ReactNode
  text: string
  tone?: 'brand' | 'fuchsia'
  children?: ReactNode
}) {
  const glow = tone === 'brand' ? 'bg-brand-600/20' : 'bg-fuchsia-600/20'
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className={`pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full ${glow} blur-3xl`} />
      <div className="relative mx-auto max-w-4xl animate-fade-up px-4 py-20 text-center sm:py-24">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">{text}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}

/** Gradient text for highlighting words in headings. */
export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-brand-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
      {children}
    </span>
  )
}

export function AiAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs'
  return (
    <span
      className={`grid ${s} shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-500 font-bold text-white`}
    >
      AI
    </span>
  )
}

/** Chat message bubble for the AI instructor. */
export function Bubble({ from, children }: { from: 'you' | 'ai'; children: ReactNode }) {
  const ai = from === 'ai'
  return (
    <div className={`flex gap-3 ${ai ? '' : 'flex-row-reverse'}`}>
      {ai ? (
        <AiAvatar />
      ) : (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
          You
        </span>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          ai ? 'rounded-tl-sm bg-surface-2 text-fg-soft' : 'rounded-tr-sm bg-brand-600 text-white'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

/** Gradient call-to-action banner used at the bottom of pages. */
export function CtaBanner({
  title = 'Write your first line of code today',
  text = 'Your first lesson takes 5 minutes. Free account, nothing to install.',
  to = '/tracks/html/first-page',
  label = 'Start lesson 1 →',
}: {
  title?: string
  text?: string
  to?: string
  label?: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center text-white sm:px-16">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-brand-100">{text}</p>
        <Link
          to={to}
          className="relative mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-brand-700 shadow-xl transition hover:-translate-y-0.5"
        >
          {label}
        </Link>
      </div>
    </section>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-6 ${className}`}>{children}</div>
}
