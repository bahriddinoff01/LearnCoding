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

/** Loads the signed-in user's finished lessons and "I already know this" tracks. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id
  const [loadedFor, setLoadedFor] = useState<string | null>(null)
  const [done, setDone] = useState<Set<string>>(new Set())
  const [known, setKnown] = useState<Set<string>>(new Set())

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

  const markDone = useCallback(async (trackId: string, lessonId: string) => {
    setDone((d) => new Set(d).add(key(trackId, lessonId)))
    await supabase
      .from('lesson_progress')
      .upsert({ track_id: trackId, lesson_id: lessonId }, { onConflict: 'user_id,track_id,lesson_id', ignoreDuplicates: true })
  }, [])

  const markKnown = useCallback(async (trackIds: string[]) => {
    setKnown((k) => new Set([...k, ...trackIds]))
    await supabase
      .from('known_tracks')
      .upsert(trackIds.map((track_id) => ({ track_id })), { onConflict: 'user_id,track_id', ignoreDuplicates: true })
  }, [])

  const value: ProgressContextValue = {
    ready: !!userId && loadedFor === userId,
    isDone: (t, l) => done.has(key(t, l)),
    isKnown: (t) => known.has(t),
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
