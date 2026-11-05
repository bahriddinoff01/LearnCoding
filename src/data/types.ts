export type Check = {
  label: string
  // Gets the page rendered with its styles applied, plus the raw code.
  // For project steps, code is index.html followed by style.css.
  test: (doc: Document, code: string) => boolean
}

export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'code'; code: string }
  | { type: 'tip'; text: string }

export type Lesson = {
  id: string
  title: string
  minutes: number
  // 'fix' lessons start with broken code the learner has to repair
  kind?: 'write' | 'fix'
  content: ContentBlock[]
  task: string
  starterCode: string
  checks: Check[]
}

export type QuizQuestion = {
  q: string
  code?: string
  options: string[]
  answer: number // index into options
  explain: string
}

/** The part of the learner's own website they build at the end of a section. */
export type ProjectStep = {
  title: string
  brief: string
  tips: string[]
  requirements: Check[]
}

export type Section = {
  id: string
  title: string
  // One line on what the section is about
  summary: string
  lessons: Lesson[]
  quiz: QuizQuestion[]
  project: ProjectStep
}

export type Track = {
  id: string
  name: string
  short: string
  color: string // Tailwind gradient classes
  description: string
  status: 'available' | 'soon'
  // The track to finish (or say you know) before starting this one
  requires?: string
  sections: Section[]
}

/** Everything in a track, in the order the learner goes through it. */
export type TrackItem =
  | { kind: 'lesson'; id: string; section: Section; lesson: Lesson }
  | { kind: 'quiz'; id: string; section: Section }
  | { kind: 'project'; id: string; section: Section }
