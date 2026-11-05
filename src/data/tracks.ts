import { cssSections } from './css'
import { htmlSections } from './html'
import type { Lesson, Track, TrackItem } from './types'

export const tracks: Track[] = [
  {
    id: 'html',
    name: 'HTML',
    short: '</>',
    color: 'from-orange-500 to-red-500',
    description: 'The structure of every web page. Build your own personal website from the first lesson.',
    status: 'available',
    sections: htmlSections,
  },
  {
    id: 'css',
    name: 'CSS',
    short: '{ }',
    color: 'from-sky-500 to-blue-600',
    description: 'Make your website beautiful: colors, typography, Flexbox, Grid, responsive design and motion.',
    status: 'available',
    requires: 'html',
    sections: cssSections,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    short: 'JS',
    color: 'from-yellow-400 to-amber-500',
    description: 'Make pages interactive: logic, functions, the DOM, events and fetching data.',
    status: 'soon',
    requires: 'css',
    sections: [],
  },
  {
    id: 'react',
    name: 'React',
    short: '⚛',
    color: 'from-cyan-400 to-sky-600',
    description: 'Build modern apps with components, state, hooks and routing.',
    status: 'soon',
    requires: 'javascript',
    sections: [],
  },
  // Python and SQL don't depend on the web tracks, so anyone can start them
  {
    id: 'python',
    name: 'Python',
    short: 'Py',
    color: 'from-emerald-500 to-teal-600',
    description: 'The friendliest first language: logic, data, files and small scripts.',
    status: 'soon',
    sections: [],
  },
  {
    id: 'sql',
    name: 'SQL',
    short: 'DB',
    color: 'from-violet-500 to-purple-600',
    description: 'Ask questions of data: SELECT, filters, joins and grouping.',
    status: 'soon',
    sections: [],
  },
]

export function getTrack(id?: string) {
  return tracks.find((t) => t.id === id)
}

/** All lessons of a track in order, for next/previous buttons. */
export function flatLessons(track: Track): Lesson[] {
  return track.sections.flatMap((s) => s.lessons)
}

export function countLessons(track: Track) {
  return flatLessons(track).length
}

/** Every lesson, quiz and project step of a track, in learning order. */
export function trackItems(track: Track): TrackItem[] {
  return track.sections.flatMap((section) => [
    ...section.lessons.map((lesson) => ({ kind: 'lesson' as const, id: lesson.id, section, lesson })),
    { kind: 'quiz' as const, id: `quiz-${section.id}`, section },
    { kind: 'project' as const, id: `project-${section.id}`, section },
  ])
}

/** The page address for a track item. */
export function itemPath(track: Track, item: TrackItem) {
  if (item.kind === 'lesson') return `/tracks/${track.id}/${item.id}`
  if (item.kind === 'quiz') return `/tracks/${track.id}/${item.section.id}/quiz`
  return `/project/${track.id}/${item.section.id}`
}

/** Tracks whose project steps build the learner's website, in order. */
export function projectTracks() {
  return tracks.filter((t) => t.status === 'available')
}
