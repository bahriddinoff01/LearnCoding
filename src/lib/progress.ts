// Lesson progress kept in the browser until accounts are added.
const KEY = 'learncoding-progress'

function read(): Record<string, true> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function isDone(trackId: string, lessonId: string) {
  return !!read()[`${trackId}/${lessonId}`]
}

export function markDone(trackId: string, lessonId: string) {
  try {
    const data = read()
    data[`${trackId}/${lessonId}`] = true
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Storage can be blocked (private mode). Progress just won't be saved.
  }
}
