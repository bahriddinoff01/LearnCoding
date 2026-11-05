import type { Check } from './types'

/*
 * Small helpers for writing lesson checks. Each returns the `test` function
 * of a Check. The document they receive is the learner's page, rendered
 * with styles applied.
 */

type Test = Check['test']

export const has =
  (selector: string): Test =>
  (d) =>
    !!d.querySelector(selector)

export const count =
  (selector: string, min: number): Test =>
  (d) =>
    d.querySelectorAll(selector).length >= min

export const hasText =
  (selector: string): Test =>
  (d) =>
    [...d.querySelectorAll(selector)].some((el) => (el.textContent ?? '').trim().length > 0)

export const hasAttr =
  (selector: string, attr: string): Test =>
  (d) =>
    [...d.querySelectorAll(selector)].some((el) => (el.getAttribute(attr) ?? '').trim().length > 0)

export const codeMatches =
  (re: RegExp): Test =>
  (_d, code) =>
    re.test(code)

/** Computed style of the first element matching the selector. */
export function style(d: Document, selector: string) {
  const el = d.querySelector(selector)
  return el ? d.defaultView!.getComputedStyle(el) : null
}

export const px = (v?: string | null) => parseFloat(v ?? '') || 0

const transparent = (c?: string) => !c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)'

export const hasBackground =
  (selector: string): Test =>
  (d) => {
    const s = style(d, selector)
    return !!s && (!transparent(s.backgroundColor) || s.backgroundImage !== 'none')
  }

export const colorIsNot =
  (selector: string, color = 'rgb(0, 0, 0)'): Test =>
  (d) => {
    const c = style(d, selector)?.color
    return !!c && c !== color
  }

export const styleIs =
  (selector: string, prop: keyof CSSStyleDeclaration, value: string): Test =>
  (d) =>
    String(style(d, selector)?.[prop] ?? '') === value

export const styleAtLeast =
  (selector: string, prop: keyof CSSStyleDeclaration, min: number): Test =>
  (d) =>
    px(String(style(d, selector)?.[prop] ?? '')) >= min

/** True when the stylesheet (or <style> block) contains a rule matching the pattern. */
export const cssMatches = codeMatches
