export type Check = {
  label: string
  // Gets the learner's code parsed as a page, plus the raw code
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
  content: ContentBlock[]
  task: string
  starterCode: string
  checks: Check[]
}

export type Section = {
  id: string
  title: string
  lessons: Lesson[]
}

export type Track = {
  id: string
  name: string
  short: string
  color: string // Tailwind gradient classes
  description: string
  status: 'available' | 'soon'
  sections: Section[]
}
