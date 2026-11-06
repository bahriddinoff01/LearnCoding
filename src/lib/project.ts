import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { supabase } from './supabase'

export type SaveStatus = 'loading' | 'saved' | 'saving' | 'unsaved' | 'error'

export type ProjectData = {
  html: string
  css: string
  // The theme the learner picked (null until they choose one)
  theme: string | null
  title: string
  idea: string
}

const empty: ProjectData = { html: '', css: '', theme: null, title: '', idea: '' }

/**
 * The signed-in user's website project: its files (index.html + style.css)
 * and what it is about. Code saves automatically a moment after typing
 * stops; project details save right away.
 */
export function useProject() {
  const { user } = useAuth()
  const userId = user?.id
  const [data, setData] = useState<ProjectData>(empty)
  const [status, setStatus] = useState<SaveStatus>('loading')
  const latest = useRef<ProjectData>(empty)
  const timer = useRef<number | undefined>(undefined)
  const pending = useRef(false)
  const owner = useRef<string | undefined>(undefined)
  useEffect(() => {
    owner.current = userId
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const run = { cancelled: false }
    supabase
      .from('projects')
      .select('html, css, theme, title, idea')
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (run.cancelled) return
        const loaded: ProjectData = {
          html: row?.html ?? '',
          css: row?.css ?? '',
          theme: row?.theme ?? null,
          title: row?.title ?? '',
          idea: row?.idea ?? '',
        }
        latest.current = loaded
        setData(loaded)
        setStatus(error ? 'error' : 'saved')
      })
    return () => {
      run.cancelled = true
    }
  }, [userId])

  const save = useCallback(async () => {
    pending.current = false
    window.clearTimeout(timer.current)
    setStatus('saving')
    const { error } = await supabase
      .from('projects')
      .upsert({ user_id: owner.current, ...latest.current, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setStatus(error ? 'error' : 'saved')
  }, [])

  const schedule = useCallback(() => {
    setStatus('unsaved')
    pending.current = true
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(save, 1000)
  }, [save])

  // Save right away when leaving the page with unsaved changes
  useEffect(() => {
    return () => {
      if (pending.current) void save()
    }
  }, [save])

  const update = useCallback(
    (changes: Partial<ProjectData>, now = false) => {
      latest.current = { ...latest.current, ...changes }
      setData(latest.current)
      if (now) return save()
      schedule()
    },
    [save, schedule],
  )

  const setHtml = useCallback((html: string) => update({ html }), [update])
  const setCss = useCallback((css: string) => update({ css }), [update])
  /** Saves the project's theme, name and idea immediately. */
  const setDetails = useCallback(
    (details: Pick<ProjectData, 'theme' | 'title' | 'idea'>, starterHtml?: string) =>
      update({ ...details, ...(starterHtml !== undefined ? { html: starterHtml } : {}) }, true),
    [update],
  )

  return { ...data, setHtml, setCss, setDetails, status }
}
