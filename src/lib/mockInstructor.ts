import type { Lesson } from '../data/types'

/*
 * A stand-in for the real AI instructor. It follows the same rules the real
 * one will (hints in steps, never the full solution) using simple templates
 * built from the lesson, the learner's code and the failing checks.
 * Later, replace getReply with a call to a server function that asks the AI model.
 */

export type HintLevel = 1 | 2 | 3 | 4

export const hintLevels: { level: HintLevel; name: string; ask: string }[] = [
  { level: 1, name: 'Nudge', ask: 'Give me a nudge' },
  { level: 2, name: 'Concept', ask: 'Explain the idea' },
  { level: 3, name: 'Direction', ask: 'Where should I look?' },
  { level: 4, name: 'Example', ask: 'Show a similar example' },
]

export type InstructorContext = {
  lesson: Lesson
  code: string
  // Result of each check, or null if the learner hasn't clicked "Check my code" yet
  results: boolean[] | null
}

export type Reply = { text: string; code?: string; level?: HintLevel }

/** The check the learner should work on next, or null if there's nothing to fix. */
export function focusCheck(ctx: InstructorContext) {
  if (!ctx.results) return null
  const i = ctx.results.findIndex((r) => !r)
  return i === -1 ? null : { index: i, label: ctx.lesson.checks[i].label }
}

// Plain words in check labels that point to an HTML tag
const tagWords: [RegExp, string][] = [
  [/\bimage\b/i, 'img'],
  [/\blink\b/i, 'a'],
  [/\bheading\b/i, 'h1'],
  [/\bparagraph\b/i, 'p'],
  [/\bform\b/i, 'form'],
  [/\binput/i, 'input'],
  [/\bbutton\b/i, 'button'],
  [/\blabel\b/i, 'label'],
]

function tagIn(label: string) {
  const explicit = label.match(/<([a-z0-9]+)>/i)?.[1]?.toLowerCase()
  if (explicit) return explicit
  // CSS checks mention elements too ("The <h1> is not black"), so only guess for HTML-style labels
  if (isCssLabel(label)) return undefined
  return tagWords.find(([re]) => re.test(label))?.[1]
}
const isCssLabel = (label: string) => /(\.[a-z]|color|font|padding|border|corner|flex|gap|center|background|margin)/i.test(label)

function words(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9<>. ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

/** The lesson paragraph that best matches the check, for concept hints. */
function relatedText(lesson: Lesson, label: string) {
  const want = new Set(words(label))
  let best = ''
  let bestScore = -1
  for (const b of lesson.content) {
    if (b.type === 'code') continue
    const score = words(b.text).filter((w) => want.has(w)).length
    if (score > bestScore) {
      best = b.text
      bestScore = score
    }
  }
  return best
}

// Tags that have no closing tag
const voidTags = new Set(['img', 'input', 'br', 'hr', 'meta', 'link'])

/** A code example from the lesson, preferring one that uses the given tag. */
function lessonExample(lesson: Lesson, tag?: string) {
  const blocks = lesson.content.flatMap((b) => (b.type === 'code' ? [b.code] : []))
  return (tag && blocks.find((c) => c.toLowerCase().includes(`<${tag}`))) || blocks[0]
}

function hint(level: HintLevel, ctx: InstructorContext): Reply {
  const focus = focusCheck(ctx)

  if (!ctx.results)
    return {
      level,
      text: `Click "Check my code" first, so I can see which part needs work. Meanwhile, read the task again: "${ctx.lesson.task}" What is the very first thing it asks for?`,
    }

  if (!focus)
    return {
      text: 'All checks pass, great job! 🎉 Want an extra challenge? Try changing your solution so it looks good on a phone screen too.',
    }

  const { label } = focus
  const tag = tagIn(label)

  switch (level) {
    case 1:
      return {
        level,
        text: `Let's focus on one check: "${label}". In your own words, what does it ask your page to have? ${
          tag
            ? 'Which tag or attribute do you think is involved?'
            : isCssLabel(label)
              ? 'Which CSS property do you think controls that?'
              : 'Which part of your code do you think is involved?'
        }`,
      }
    case 2:
      return {
        level,
        text: `Here's the idea behind it: ${relatedText(ctx.lesson, label)} You covered this in "${ctx.lesson.title}". How could you apply it here?`,
      }
    case 3: {
      if (tag && !ctx.code.toLowerCase().includes(`<${tag}`))
        return { level, text: `I can't find a <${tag}> tag in your code yet. Where on the page should it go?` }
      if (tag && voidTags.has(tag))
        return {
          level,
          text: `You do have an <${tag}>. Remember, it has no closing tag, so everything lives in its attributes. Look at them one by one: is the attribute the check asks for there, and does it have a value?`,
        }
      if (tag)
        return {
          level,
          text: `You do have a <${tag}>, so look closely at it. Is it closed properly with </${tag}>? Does it have what the check asks for, like text inside or a needed attribute?`,
        }
      if (isCssLabel(label))
        return {
          level,
          text: 'Find the CSS rule for that element. Does the selector match exactly (a dot for classes, like .card)? Is the property name spelled right, with a colon after it and a semicolon at the end?',
        }
      return { level, text: 'Compare your code with the task line by line. Which requirement is not in your code yet?' }
    }
    case 4: {
      const example = lessonExample(ctx.lesson, tag)
      return example
        ? { level, text: "Here's the example from the lesson. It's not your exact task, but it shows the same pattern:", code: example }
        : { level, text: 'Look back at the examples in the lesson. They show the same pattern you need here.' }
    }
  }
}

/** Reply to a hint button press. */
export function getHint(level: HintLevel, ctx: InstructorContext): Reply {
  return hint(level, ctx)
}

/** Reply to a typed message. nextLevel is the hint level the learner would get next. */
export function getReply(message: string, ctx: InstructorContext, nextLevel: HintLevel): Reply {
  const m = message.toLowerCase()

  if (/(give|write|show|tell|send).{0,25}(code|answer|solution)|do it for me|just do it|full solution/.test(m))
    return {
      text: "I can't write it for you. You learn the most by writing it yourself! 💪 Let's break it down instead. " +
        hint(1, ctx).text,
    }

  if (/^(hi|hello|hey|salom|assalomu)/.test(m))
    return { text: `Hi! 👋 I'm here to help with "${ctx.lesson.title}". Tell me where you're stuck, or press a hint button.` }

  if (/(why|explain|what does|what is|meaning)/.test(m)) return hint(2, ctx)

  if (/(stuck|not work|doesn.?t work|help|error|wrong|fail|confus)/.test(m)) return hint(nextLevel, ctx)

  return {
    text: 'Good question! Before I answer, what do you think should happen, and what happens instead? Comparing those two usually shows where the problem is. You can also press a hint button below.',
  }
}
