import { htmlSections } from './html'
import type { Lesson, Track } from './types'

export const tracks: Track[] = [
  {
    id: 'html',
    name: 'HTML',
    short: '</>',
    color: 'from-orange-500 to-red-500',
    description: 'The structure of every web page: tags, links, images, lists and forms.',
    status: 'available',
    sections: htmlSections,
  },
  {
    id: 'css',
    name: 'CSS',
    short: '{ }',
    color: 'from-sky-500 to-blue-600',
    description: 'Make pages beautiful: colors, Flexbox, Grid, responsive design and animations.',
    status: 'soon',
    sections: [],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    short: 'JS',
    color: 'from-yellow-400 to-amber-500',
    description: 'Make pages interactive: logic, functions, the DOM, events and fetching data.',
    status: 'soon',
    sections: [],
  },
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
    id: 'react',
    name: 'React',
    short: '⚛',
    color: 'from-cyan-400 to-sky-600',
    description: 'Build modern apps with components, state, hooks and routing.',
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
