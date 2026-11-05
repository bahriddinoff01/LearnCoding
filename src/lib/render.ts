import type { Check } from '../data/types'

const baseStyle = 'body{font-family:system-ui,sans-serif;padding:16px;line-height:1.5}'

/** A lesson's code as a full page. Code that already has <html> is used as-is. */
export function lessonDoc(code: string) {
  if (/<html[\s>]/i.test(code)) return code
  return `<!doctype html><html><head><style>${baseStyle}</style></head><body>${code}</body></html>`
}

/**
 * The learner's website as one page. Like a real browser, style.css only
 * applies when index.html links to it with <link rel="stylesheet" href="style.css">.
 */
export function projectDoc(html: string, css: string) {
  const link = /<link\b[^>]*href=["']?\.?\/?style\.css["']?[^>]*>/i
  const page = /<html[\s>]/i.test(html) ? html : `<!doctype html><html><head></head><body>${html}</body></html>`
  // A function replacement keeps "$" characters in the CSS from being treated as patterns
  return page.replace(link, () => `<style>${css}</style>`)
}

/** index.html followed by style.css: the code that project checks receive. */
export const projectCode = (html: string, css: string) => `${html}\n/* style.css */\n${css}`

/**
 * Renders a page in a hidden frame so checks can read real computed styles.
 * Scripts are not allowed to run in this frame.
 */
export function runChecks(doc: string, code: string, checks: Check[]): Promise<boolean[]> {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe')
    frame.setAttribute('sandbox', 'allow-same-origin')
    frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:1024px;height:768px;border:0'
    frame.onload = () => {
      const d = frame.contentDocument!
      resolve(
        checks.map((c) => {
          try {
            return c.test(d, code)
          } catch {
            return false
          }
        }),
      )
      frame.remove()
    }
    frame.srcdoc = doc
    document.body.appendChild(frame)
  })
}
