export type FaqItem = { q: string; a: string }
export type FaqGroup = { id: string; title: string; icon: string; items: FaqItem[] }

export const faqGroups: FaqGroup[] = [
  {
    id: 'start',
    title: 'Getting started',
    icon: '🚀',
    items: [
      { q: 'Do I need any experience?', a: 'No. The HTML track starts from zero. If you have never written code before, start there.' },
      {
        q: 'Do I need to install anything?',
        a: 'No. The editor, preview and checks all run in your browser. A laptop or desktop works best, but you can read lessons on your phone.',
      },
      {
        q: 'Why do I need an account?',
        a: 'Your account saves your progress, unlocks lessons in order, and keeps your projects. It is free and only needs an email.',
      },
      { q: 'Where should I start?', a: 'Start with HTML. It is the base of every web page, and the CSS and JavaScript tracks build on it.' },
    ],
  },
  {
    id: 'learning',
    title: 'Lessons and tracks',
    icon: '📚',
    items: [
      {
        q: 'Why are some tracks locked?',
        a: 'Tracks build on each other: HTML → CSS → JavaScript → React. Later projects use everything from earlier tracks, so we recommend going in order.',
      },
      {
        q: 'I already know HTML. Can I skip it?',
        a: 'Yes. Open the track you want, and when we ask "Do you already know HTML?", choose "Yes, skip ahead". You can still review the skipped track anytime.',
      },
      {
        q: 'Why do lessons unlock one by one?',
        a: 'Each lesson uses what the previous one taught. Finishing a lesson\'s task unlocks the next one, so you never get stuck on something you have not learned yet.',
      },
      {
        q: 'How are my answers checked?',
        a: 'When you click "Check my code", we render your page and run automatic checks, for example "does the page have an <h1>?" or "is the font size 20px?". You see which checks passed right away.',
      },
      {
        q: 'What is "My website"?',
        a: 'Every section ends with a step that adds to your own personal website. In HTML you build its structure, then the CSS course styles that same site. Open it anytime from "My website" in the menu. It saves automatically.',
      },
      {
        q: 'How long does a track take?',
        a: 'Most lessons take 5–10 minutes. With 20–30 minutes a day, you can finish a track in a few weeks.',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI Instructor',
    icon: '✨',
    items: [
      {
        q: 'Will the AI just give me the answers?',
        a: 'No, on purpose. It gives hints in steps, asks guiding questions and points you to lessons. You always write the code yourself, which is how you actually learn.',
      },
      {
        q: 'What are hint levels?',
        a: 'There are four: a nudge, the concept behind it, a direction pointing at your code, and a small example on a different problem. You only go to the next level if you still need help.',
      },
      {
        q: 'Who sees what I send to the AI instructor?',
        a: 'Your question, your code and the lesson details are sent to Google Gemini to write a reply. On the free tier we use while testing, Google may use this to improve its products, so please do not type personal information into the chat.',
      },
      {
        q: 'Is there a limit on hints?',
        a: 'Yes, a daily number of hints. It keeps the service free and encourages you to think first before asking.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account and pricing',
    icon: '👤',
    items: [
      { q: 'Is it free?', a: 'Yes. Lessons, exercises and projects are free while we build the platform.' },
      {
        q: 'What will I have at the end?',
        a: 'Your own personal website, built step by step across the HTML and CSS courses. You can download its files anytime and publish it, so it becomes the first project in your portfolio.',
      },
      {
        q: 'I did not get the confirmation email.',
        a: 'Check your spam folder and wait a few minutes. If it still has not arrived, try signing up again later.',
      },
    ],
  },
]

export const allFaqs = faqGroups.flatMap((g) => g.items)
