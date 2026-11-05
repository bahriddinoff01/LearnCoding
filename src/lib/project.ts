import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { supabase } from './supabase'

export type SaveStatus = 'loading' | 'saved' | 'saving' | 'unsaved' | 'error'

/**
 * The signed-in user's personal website (index.html + style.css).
 * Changes save automatically a moment after the user stops typing.
 */
export function useProject() {
  const { user } = useAuth()
  const userId = user?.id
  const [html, setHtmlState] = useState('')
  const [css, setCssState] = useState('')
  const [status, setStatus] = useState<SaveStatus>('loading')
  const latest = useRef({ html: '', css: '' })
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
      .select('html, css')
      .maybeSingle()
      .then(({ data, error }) => {
        if (run.cancelled) return
        const files = { html: data?.html ?? '', css: data?.css ?? '' }
        latest.current = files
        setHtmlState(files.html)
        setCssState(files.css)
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
      .upsert(
        { user_id: owner.current, ...latest.current, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      )
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

  const setHtml = useCallback(
    (v: string) => {
      latest.current = { ...latest.current, html: v }
      setHtmlState(v)
      schedule()
    },
    [schedule],
  )

  const setCss = useCallback(
    (v: string) => {
      latest.current = { ...latest.current, css: v }
      setCssState(v)
      schedule()
    },
    [schedule],
  )

  return { html, css, setHtml, setCss, status, saveNow: save }
}
