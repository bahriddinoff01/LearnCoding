import { getTrack, trackItems } from '../data/tracks'
import type { Track } from '../data/types'

type Progress = {
  isDone: (trackId: string, itemId: string) => boolean
  isKnown: (trackId: string) => boolean
}

/** Finished every lesson, quiz and project step, or told us they already know it. */
export function isTrackComplete(track: Track, p: Progress) {
  if (p.isKnown(track.id)) return true
  const items = trackItems(track)
  return items.length > 0 && items.every((i) => p.isDone(track.id, i.id))
}

/** All tracks that come before this one, earliest first (HTML → CSS → …). */
export function prerequisiteChain(track: Track): Track[] {
  const chain: Track[] = []
  let current = getTrack(track.requires)
  while (current) {
    chain.unshift(current)
    current = getTrack(current.requires)
  }
  return chain
}

/** Earlier tracks the user hasn't finished or marked as known. */
export function missingPrerequisites(track: Track, p: Progress) {
  return prerequisiteChain(track).filter((t) => !isTrackComplete(t, p))
}

export function isTrackUnlocked(track: Track, p: Progress) {
  return missingPrerequisites(track, p).length === 0
}

/**
 * Lessons, quizzes and project steps open one at a time, in order.
 * A track the user already knows is fully open.
 */
export function isItemUnlocked(track: Track, itemId: string, p: Progress) {
  if (!isTrackUnlocked(track, p)) return false
  if (p.isKnown(track.id)) return true
  const items = trackItems(track)
  const index = items.findIndex((i) => i.id === itemId)
  if (index <= 0) return index === 0
  return p.isDone(track.id, items[index - 1].id)
}

/** The first item the learner hasn't finished yet (or the first one). */
export function nextItem(track: Track, p: Progress) {
  const items = trackItems(track)
  return items.find((i) => !p.isDone(track.id, i.id)) ?? items[0]
}
