import { Link, NavLink, Outlet } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-bold text-lg">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-sm">
        &lt;/&gt;
      </span>
      LearnCoding
    </Link>
  )
}

export default function Layout() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-6">
            <NavLink to="/tracks" className={link}>
              Tracks
            </NavLink>
            <Link
              to="/tracks/html"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500"
            >
              Start learning
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © 2026 LearnCoding. Learn by building.
      </footer>
    </div>
  )
}
