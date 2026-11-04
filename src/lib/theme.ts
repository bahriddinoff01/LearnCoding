import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

// The starting theme is set in index.html before React loads.
function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Storage blocked: the choice just won't be remembered
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme)
  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}
