import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <div className="font-mono text-6xl font-bold text-brand-500">404</div>
      <h1 className="mt-4 text-2xl font-semibold">This page doesn't exist (yet)</h1>
      <Link to="/" className="mt-8 inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-medium hover:bg-brand-500">
        Back home
      </Link>
    </div>
  )
}
