import { flatLessons, getTrack } from '../data/tracks'
import type { Track } from '../data/types'

type Progress = {
  isDone: (trackId: string, lessonId: string) => boolean
  isKnown: (trackId: string) => boolean
}

/** Finished every lesson here, or told us they already know it. */
export function isTrackComplete(track: Track, p: Progress) {
  if (p.isKnown(track.id)) return true
  const lessons = flatLessons(track)
  return lessons.length > 0 && lessons.every((l) => p.isDone(track.id, l.id))
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

/** Lessons open one at a time. A track the user already knows is fully open. */
export function isLessonUnlocked(track: Track, lessonId: string, p: Progress) {
  if (!isTrackUnlocked(track, p)) return false
  if (p.isKnown(track.id)) return true
  const lessons = flatLessons(track)
  const index = lessons.findIndex((l) => l.id === lessonId)
  if (index <= 0) return index === 0
  return p.isDone(track.id, lessons[index - 1].id)
}
