import { projectTracks } from '../data/tracks'
import type { Section, Track } from '../data/types'
import { isItemUnlocked } from './access'

export type Step = { track: Track; section: Section; number: number }

type Progress = Parameters<typeof isItemUnlocked>[2]

/** Every project step across the tracks, numbered in order (they all build one site). */
export function allSteps(): Step[] {
  let n = 0
  return projectTracks().flatMap((track) => track.sections.map((section) => ({ track, section, number: ++n })))
}

export const stepId = (s: Step) => `project-${s.section.id}`

export const stepPath = (s: Step) => `/project/${s.track.id}/${s.section.id}`

export const isStepDone = (s: Step, p: Progress) => p.isDone(s.track.id, stepId(s))

export const isStepOpen = (s: Step, p: Progress) => isItemUnlocked(s.track, stepId(s), p)

/** The learner's next step to work on: the first one not done yet. */
export function nextStep(steps: Step[], p: Progress) {
  return steps.find((s) => !isStepDone(s, p)) ?? null
}

/** Opens the website in a new browser tab. */
export function openInNewTab(doc: string) {
  const url = URL.createObjectURL(new Blob([doc], { type: 'text/html' }))
  window.open(url, '_blank', 'noopener')
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
