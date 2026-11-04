import { useEffect, useState } from 'react'

const demoCode = `<h1>Hello, I'm Aziz 👋</h1>
<p>I'm learning to code.</p>
<button>Say hi</button>`

// Colors HTML tags in the typed code
function highlight(code: string) {
  return code.split(/(<\/?[a-z0-9]+>?)/gi).map((part, i) =>
    /^<\/?[a-z0-9]+>?$/i.test(part) ? (
      <span key={i} className="text-sky-400">
        {part}
      </span>
    ) : (
      <span key={i} className="text-slate-200">
        {part}
      </span>
    ),
  )
}

export default function CodeDemo() {
  const [length, setLength] = useState(0)
  const done = length >= demoCode.length

  useEffect(() => {
    // Pause at the end, then type it again
    const delay = done ? 3500 : 45 + Math.random() * 60
    const t = setTimeout(() => setLength(done ? 0 : length + 1), delay)
    return () => clearTimeout(t)
  }, [length, done])

  const typed = demoCode.slice(0, length)
  const lines = typed.split('\n')
  // Only show complete tags in the preview
  const safe = typed.replace(/<[^>]*$/, '')

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/30 to-fuchsia-500/20 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 text-slate-100 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-3 rounded-md bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">index.html</span>
        </div>

        <div className="grid sm:grid-cols-2">
          <pre className="min-h-[190px] border-white/10 p-4 font-mono text-[13px] leading-6 sm:border-r">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="mr-4 w-4 select-none text-right text-slate-600">{i + 1}</span>
                <span className="whitespace-pre-wrap break-all">
                  {highlight(line)}
                  {i === lines.length - 1 && <span className="ml-px inline-block h-4 w-2 translate-y-0.5 animate-blink bg-brand-400" />}
                </span>
              </div>
            ))}
          </pre>
          <div className="border-t border-white/10 bg-white p-5 text-slate-900 sm:border-t-0">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Live preview</div>
            {/* Only our own demo string is rendered here */}
            <div
              className="[&_button]:mt-3 [&_button]:rounded-md [&_button]:bg-indigo-600 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-sm [&_button]:text-white [&_h1]:text-xl [&_h1]:font-bold [&_p]:mt-1 [&_p]:text-sm [&_p]:text-slate-600"
              dangerouslySetInnerHTML={{ __html: safe }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs">
          <span className="flex items-center gap-2 text-slate-400">
            <span className={`h-2 w-2 rounded-full ${done ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {done ? '3 of 3 checks passed' : 'Typing…'}
          </span>
          <span className="rounded-md bg-brand-600 px-3 py-1 font-medium">Check my code</span>
        </div>
      </div>

      {/* Floating AI hint bubble */}
      <div className="absolute -bottom-8 -left-4 hidden max-w-[240px] animate-float rounded-2xl border border-white/10 bg-slate-900/95 p-4 text-slate-100 shadow-2xl backdrop-blur sm:block lg:-left-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-fuchsia-300">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-500 text-[11px]">
            AI
          </span>
          Hint · level 1
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Nice heading! What tag would you use to make the button do something when clicked? 🤔
        </p>
      </div>
    </div>
  )
}
