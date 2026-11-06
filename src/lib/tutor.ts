import type { HintLevel, InstructorContext } from './mockInstructor'
import { supabase } from './supabase'

export type TutorTurn = { role: 'user' | 'assistant'; text: string }
export type ProjectInfo = { theme?: string | null; title?: string; idea?: string }

export type TutorResult =
  | { ok: true; reply: string; remaining: number | null }
  // limit: daily messages used up; unavailable: no key, AI error or network problem
  | { ok: false; reason: 'limit' | 'unavailable' }

/**
 * Asks the real AI instructor (the "tutor" Supabase Edge Function, which calls Claude).
 * Sends the lesson, the learner's code, which checks pass, and the recent chat.
 */
export async function askTutor(
  ctx: InstructorContext,
  history: TutorTurn[],
  request: { level: HintLevel } | { message: string },
  project?: ProjectInfo,
): Promise<TutorResult> {
  const { lesson, code, results } = ctx
  const body = {
    lesson: {
      title: lesson.title,
      task: lesson.task,
      notes: lesson.content.flatMap((b) => (b.type === 'code' ? [] : [b.text])),
      checks: lesson.checks.map((c, i) => ({ label: c.label, passed: results ? results[i] : null })),
    },
    project: project?.title ? project : undefined,
    code,
    history,
    ...request,
  }

  try {
    const { data, error } = await supabase.functions.invoke('tutor', { body })
    if (error) {
      // The function answered with an error status: read its reason
      const reason = await (error as { context?: Response }).context?.json?.().catch(() => null)
      return { ok: false, reason: reason?.error === 'limit' ? 'limit' : 'unavailable' }
    }
    if (typeof data?.reply !== 'string') return { ok: false, reason: 'unavailable' }
    return { ok: true, reply: data.reply, remaining: typeof data.remaining === 'number' ? data.remaining : null }
  } catch {
    return { ok: false, reason: 'unavailable' }
  }
}
