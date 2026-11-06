import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import ThemeToggle from './ThemeToggle'

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-xs font-bold uppercase text-white">
      {name.charAt(0) || '?'}
    </span>
  )
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-lg font-bold">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white font-mono text-xs shadow-lg shadow-brand-500/30">
        &lt;/&gt;
      </span>
      Learn<span className="-ml-2 text-brand-600 dark:text-brand-400">Coding</span>
    </Link>
  )
}

const navItems = [
  { label: 'Tracks', to: '/tracks' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'AI Instructor', to: '/ai-instructor' },
  { label: 'FAQ', to: '/faq' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = () => setOpen(false)
  const { user, signOut } = useAuth()
  const displayName = (user?.user_metadata?.display_name as string | undefined) || user?.email?.split('@')[0] || ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm transition ${isActive ? 'text-fg' : 'text-muted hover:text-fg'}`

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors ${
        scrolled || open ? 'border-line bg-page/85 backdrop-blur-lg' : 'border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/project" className={linkClass}>
              🌐 My website
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <span className="flex items-center gap-2 px-2 text-sm text-fg-soft">
                <Avatar name={displayName} />
                {displayName}
              </span>
              <button onClick={signOut} className="rounded-lg px-3 py-2 text-sm text-muted hover:text-fg">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-fg-soft hover:text-fg">
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
              >
                Sign up free
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-lg text-fg-soft hover:bg-surface"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line px-4 pb-4 md:hidden">
          <div className="flex flex-col py-2">
            {user && (
              <Link to="/project" onClick={close} className="rounded-lg px-3 py-3 font-semibold text-fg hover:bg-surface">
                🌐 My website
              </Link>
            )}
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={close}
                className="rounded-lg px-3 py-3 text-fg-soft hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {user ? (
            <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-3">
              <span className="flex items-center gap-2 text-sm">
                <Avatar name={displayName} />
                {displayName}
              </span>
              <button
                onClick={() => {
                  close()
                  signOut()
                }}
                className="text-sm text-muted hover:text-fg"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={close}
                className="rounded-lg border border-line-strong px-4 py-3 text-center font-semibold hover:bg-surface"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={close}
                className="rounded-lg bg-brand-600 px-4 py-3 text-center font-semibold text-white hover:bg-brand-500"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

const footerLinks = [
  {
    title: 'Learn',
    links: [
      { label: 'HTML', to: '/tracks/html' },
      { label: 'CSS', to: '/tracks/css' },
      { label: 'All tracks', to: '/tracks' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'How it works', to: '/how-it-works' },
      { label: 'AI Instructor', to: '/ai-instructor' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
]

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Learn to code by building. Lessons, challenges and real projects, with an AI instructor that helps you
            think instead of thinking for you.
          </p>
        </div>
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line py-6 text-center text-sm text-subtle">
        © 2026 LearnCoding. Built with React.
      </div>
    </footer>
  )
}

/**
 * Start each new page at the top. For links to a #section, scroll to it once
 * it exists: pages load on demand, so it may appear a moment later.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    const timer = window.setInterval(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) target.scrollIntoView()
      if (target || ++tries > 30) window.clearInterval(timer)
    }, 100)
    return () => window.clearInterval(timer)
  }, [pathname, hash])
  return null
}

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
