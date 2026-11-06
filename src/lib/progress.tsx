import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { supabase } from './supabase'

type ProgressContextValue = {
  ready: boolean
  isDone: (trackId: string, lessonId: string) => boolean
  isKnown: (trackId: string) => boolean
  markDone: (trackId: string, lessonId: string) => Promise<void>
  markKnown: (trackIds: string[]) => Promise<void>
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

const key = (trackId: string, lessonId: string) => `${trackId}/${lessonId}`

/* Visitors who are not logged in keep their progress in this browser. */
const GUEST_KEY = 'learncoding-guest-progress'

function readGuest(): { done: string[]; known: string[] } {
  try {
    const data = JSON.parse(localStorage.getItem(GUEST_KEY) ?? '{}')
    return { done: data.done ?? [], known: data.known ?? [] }
  } catch {
    return { done: [], known: [] }
  }
}

function writeGuest(done: Set<string>, known: Set<string>) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify({ done: [...done], known: [...known] }))
  } catch {
    // Storage blocked (private mode): progress lasts until the page closes
  }
}

/**
 * Finished lessons and "I already know this" tracks: from the database for
 * signed-in users, from the browser for guests.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const userId = user?.id
  const [loadedFor, setLoadedFor] = useState<string | null>(null)
  const [done, setDone] = useState<Set<string>>(new Set())
  const [known, setKnown] = useState<Set<string>>(new Set())
  const [guestDone, setGuestDone] = useState(() => new Set(readGuest().done))
  const [guestKnown, setGuestKnown] = useState(() => new Set(readGuest().known))

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    Promise.all([
      supabase.from('lesson_progress').select('track_id, lesson_id'),
      supabase.from('known_tracks').select('track_id'),
    ]).then(([lessons, tracks]) => {
      if (cancelled) return
      setDone(new Set((lessons.data ?? []).map((r) => key(r.track_id, r.lesson_id))))
      setKnown(new Set((tracks.data ?? []).map((r) => r.track_id)))
      setLoadedFor(userId)
    })
    return () => {
      cancelled = true
    }
  }, [userId])

  const markDone = useCallback(
    async (trackId: string, lessonId: string) => {
      if (!userId) {
        const next = new Set(guestDone).add(key(trackId, lessonId))
        setGuestDone(next)
        writeGuest(next, guestKnown)
        return
      }
      setDone((d) => new Set(d).add(key(trackId, lessonId)))
      await supabase
        .from('lesson_progress')
        .upsert({ track_id: trackId, lesson_id: lessonId }, { onConflict: 'user_id,track_id,lesson_id', ignoreDuplicates: true })
    },
    [userId, guestDone, guestKnown],
  )

  const markKnown = useCallback(
    async (trackIds: string[]) => {
      if (!userId) {
        const next = new Set([...guestKnown, ...trackIds])
        setGuestKnown(next)
        writeGuest(guestDone, next)
        return
      }
      setKnown((k) => new Set([...k, ...trackIds]))
      await supabase
        .from('known_tracks')
        .upsert(trackIds.map((track_id) => ({ track_id })), { onConflict: 'user_id,track_id', ignoreDuplicates: true })
    },
    [userId, guestDone, guestKnown],
  )

  const doneSet = userId ? done : guestDone
  const knownSet = userId ? known : guestKnown

  const value: ProgressContextValue = {
    ready: userId ? loadedFor === userId : !loading,
    isDone: (t, l) => doneSet.has(key(t, l)),
    isKnown: (t) => knownSet.has(t),
    markDone,
    markKnown,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
