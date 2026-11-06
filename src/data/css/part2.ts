import { count, px, style, styleAtLeast, styleIs } from '../checks'
import type { Section } from '../types'

const cssOf = (code: string) => code.split('/* style.css */')[1] ?? code
const inCss = (re: RegExp) => (_d: Document, code: string) => re.test(cssOf(code))

/** Number of columns in a computed grid-template-columns value. */
const columns = (d: Document, selector: string) => (style(d, selector)?.gridTemplateColumns ?? 'none').split(' ').filter((v) => v && v !== 'none').length

/** The first list on the page that is not part of the navigation. */
function contentList(d: Document) {
  return [...d.querySelectorAll('main ul, main ol')].find((l) => !l.closest('nav'))
}

export const cssPart2: Section[] = [
  /* ---------------------------------------------------------------- 5 */
  {
    id: 'flexbox',
    title: 'Flexbox',
    summary: 'Line things up in rows and columns: menus, cards and centering made easy.',
    lessons: [
      {
        id: 'flex-container',
        title: 'Your first flex container',
        minutes: 6,
        content: [
          { type: 'text', text: 'Put display: flex on a parent, and its children line up in a row. Add flex-direction: column to stack them instead.' },
          { type: 'code', code: '.row { display: flex; }                         /* side by side */\n.stack { display: flex; flex-direction: column; } /* on top of each other */' },
          { type: 'tip', text: 'Flexbox always works on the direct children of the flex container, not grandchildren.' },
        ],
        task: 'Make .row a flex container so the three boxes sit side by side.',
        starterCode:
          '<style>\n  .box { padding: 20px; background: #e0e7ff; border-radius: 8px; }\n  .row {\n\n  }\n</style>\n\n<div class="row">\n  <div class="box">HTML</div>\n  <div class="box">CSS</div>\n  <div class="box">JS</div>\n</div>\n',
        checks: [
          { label: '.row uses display: flex', test: styleIs('.row', 'display', 'flex') },
          { label: 'The boxes sit side by side', test: (d) => { const b = [...d.querySelectorAll('.box')].map((e) => e.getBoundingClientRect().top); return b.length === 3 && b.every((t) => Math.abs(t - b[0]) < 2) } },
        ],
      },
      {
        id: 'justify-align',
        title: 'Justify and align',
        minutes: 7,
        content: [
          { type: 'text', text: 'justify-content spreads items along the main direction (a row: left to right). align-items lines them up across it (a row: top to bottom).' },
          { type: 'code', code: 'justify-content: flex-start | center | flex-end | space-between | space-around;\nalign-items: stretch | center | flex-start | flex-end;' },
          { type: 'text', text: 'The famous "center anything" trick:' },
          { type: 'code', code: '.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}' },
        ],
        task: 'Make the .bar a flex row with the logo on the left and the button on the right (space-between), both centered vertically.',
        starterCode:
          '<style>\n  .bar { height: 80px; padding: 0 20px; background: #1e293b; color: white; }\n\n</style>\n\n<div class="bar">\n  <strong>Logo</strong>\n  <button>Sign up</button>\n</div>\n',
        checks: [
          { label: '.bar is a flex container', test: styleIs('.bar', 'display', 'flex') },
          { label: 'Items are spread with space-between', test: styleIs('.bar', 'justifyContent', 'space-between') },
          { label: 'Items are centered vertically', test: styleIs('.bar', 'alignItems', 'center') },
        ],
      },
      {
        id: 'gap-wrap',
        title: 'Gap and wrapping',
        minutes: 5,
        content: [
          { type: 'text', text: 'gap adds space between flex items (no more margin tricks). flex-wrap: wrap lets items move to a new line when they run out of room.' },
          { type: 'code', code: '.tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}' },
          { type: 'tip', text: 'Wrapping is the first step to layouts that work on phones without extra code.' },
        ],
        task: 'Make .tags a flex container that wraps, with a gap of at least 8px between tags.',
        starterCode:
          '<style>\n  .tag { padding: 6px 12px; background: #fde68a; border-radius: 99px; }\n  .tags { max-width: 260px; }\n\n</style>\n\n<div class="tags">\n  <span class="tag">HTML</span><span class="tag">CSS</span><span class="tag">JavaScript</span>\n  <span class="tag">React</span><span class="tag">Git</span><span class="tag">Figma</span>\n</div>\n',
        checks: [
          { label: '.tags uses display: flex', test: styleIs('.tags', 'display', 'flex') },
          { label: 'Items wrap', test: styleIs('.tags', 'flexWrap', 'wrap') },
          { label: 'Gap is at least 8px', test: styleAtLeast('.tags', 'columnGap', 8) },
        ],
      },
      {
        id: 'flex-grow',
        title: 'Growing and shrinking',
        minutes: 6,
        content: [
          { type: 'text', text: 'flex: 1 tells an item to grow and fill the free space. Give several items flex: 1 and they share the space equally.' },
          { type: 'code', code: '.sidebar { width: 200px; }\n.content { flex: 1; }   /* takes everything left */' },
          { type: 'tip', text: 'flex: 2 on one item and flex: 1 on another makes the first twice as wide.' },
        ],
        task: 'Keep the .sidebar at 150px, and make .content grow to fill the rest of the row.',
        starterCode:
          '<style>\n  .layout { display: flex; gap: 12px; }\n  .sidebar, .content { padding: 20px; background: #e0e7ff; }\n\n</style>\n\n<div class="layout">\n  <aside class="sidebar">Sidebar</aside>\n  <main class="content">Main content</main>\n</div>\n',
        checks: [
          { label: '.sidebar is 150px wide', test: (d) => Math.round(d.querySelector('.sidebar')!.getBoundingClientRect().width) === 150 },
          { label: '.content grows (flex-grow 1 or more)', test: (d) => Number(style(d, '.content')?.flexGrow) >= 1 },
        ],
      },
    ],
    quiz: [
      {
        q: 'Where do you put display: flex?',
        options: ['On each item', 'On the parent container', 'On the body only', 'On the first child'],
        answer: 1,
        explain: 'The parent becomes the flex container, and its direct children become flex items.',
      },
      {
        q: 'In a row, which property centers items vertically?',
        options: ['justify-content', 'align-items', 'text-align', 'vertical-align'],
        answer: 1,
        explain: 'align-items works across the main direction, which is vertical for a row.',
      },
      {
        q: 'What does justify-content: space-between do?',
        options: ['Adds equal margins', 'Puts the first item at the start, the last at the end, and spreads the rest', 'Centers everything', 'Stacks items'],
        answer: 1,
        explain: 'It pushes items to the edges and shares the space between them.',
      },
      {
        q: 'What does flex: 1 do?',
        options: ['Sets width to 1px', 'Makes the item grow to fill free space', 'Hides the item', 'Makes it the first item'],
        answer: 1,
        explain: 'flex: 1 lets the item grow and share the free space.',
      },
    ],
    project: {
      title: 'Build a real navigation bar',
      brief: 'Turn your header into a proper top bar: your site name on one side, the menu on the other, with the menu links in a row.',
      tips: [
        'header { display: flex; justify-content: space-between; align-items: center; }',
        'Remove the bullets: nav ul { list-style: none; display: flex; gap: 24px; }',
      ],
      requirements: [
        { label: 'Your <header> is a flex container', test: styleIs('header', 'display', 'flex') },
        { label: 'Header items are centered vertically', test: styleIs('header', 'alignItems', 'center') },
        { label: 'The menu list is a flex row', test: styleIs('nav ul, nav ol', 'display', 'flex') },
        { label: 'The menu has no bullets', test: styleIs('nav ul, nav ol', 'listStyleType', 'none') },
        { label: 'Menu links have a gap between them', test: styleAtLeast('nav ul, nav ol', 'columnGap', 4) },
      ],
    },
  },

  /* ---------------------------------------------------------------- 6 */
  {
    id: 'grid-position',
    title: 'Grid and positioning',
    summary: 'Two-dimensional layouts with CSS Grid, and placing elements exactly with position.',
    lessons: [
      {
        id: 'grid-basics',
        title: 'CSS Grid basics',
        minutes: 7,
        content: [
          { type: 'text', text: 'Flexbox handles one direction. Grid handles rows and columns at the same time. Define the columns on the parent:' },
          { type: 'code', code: '.gallery {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;   /* 3 equal columns */\n  gap: 16px;\n}' },
          { type: 'text', text: 'fr means "a fraction of the free space". repeat(3, 1fr) is a shorter way to write 1fr 1fr 1fr.' },
          { type: 'tip', text: 'Use flexbox for a row of things, grid for a page layout or a gallery.' },
        ],
        task: 'Make .gallery a grid with 3 equal columns and a gap.',
        starterCode:
          '<style>\n  .item { background: #e0e7ff; padding: 30px; text-align: center; border-radius: 8px; }\n\n</style>\n\n<div class="gallery">\n  <div class="item">1</div><div class="item">2</div><div class="item">3</div>\n  <div class="item">4</div><div class="item">5</div><div class="item">6</div>\n</div>\n',
        checks: [
          { label: '.gallery uses display: grid', test: styleIs('.gallery', 'display', 'grid') },
          { label: 'It has 3 columns', test: (d) => columns(d, '.gallery') === 3 },
          { label: 'It has a gap', test: styleAtLeast('.gallery', 'columnGap', 4) },
        ],
      },
      {
        id: 'grid-span',
        title: 'Spanning and responsive grids',
        minutes: 7,
        content: [
          { type: 'text', text: 'Items can stretch across several columns or rows:' },
          { type: 'code', code: '.featured {\n  grid-column: span 2;   /* 2 columns wide */\n  grid-row: span 2;      /* 2 rows tall */\n}' },
          { type: 'text', text: 'This one line makes a grid that fits as many columns as there is room for, with no media queries:' },
          { type: 'code', code: 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));' },
        ],
        task: 'Make the .featured card span 2 columns in the 3-column grid.',
        starterCode:
          '<style>\n  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }\n  .card { background: #e0e7ff; padding: 24px; border-radius: 8px; }\n  .featured { background: #c7d2fe; }\n\n</style>\n\n<div class="grid">\n  <div class="card featured">Featured</div>\n  <div class="card">A</div><div class="card">B</div><div class="card">C</div>\n</div>\n',
        checks: [
          { label: '.featured spans 2 columns', test: (d) => { const f = d.querySelector('.featured')!.getBoundingClientRect().width; const c = d.querySelector('.card:not(.featured)')!.getBoundingClientRect().width; return f > c * 1.8 } },
        ],
      },
      {
        id: 'position',
        title: 'Relative and absolute position',
        minutes: 7,
        content: [
          {
            type: 'text',
            text: 'position: absolute takes an element out of the normal flow and places it with top, right, bottom and left, measured from the nearest parent that has position: relative.',
          },
          { type: 'code', code: '.card { position: relative; }\n.badge {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}' },
          { type: 'tip', text: 'Forgot position: relative on the parent? The absolute element jumps to the corner of the whole page.' },
        ],
        task: 'Place the "NEW" .badge in the top-right corner of the .card.',
        starterCode:
          '<style>\n  .card { width: 260px; padding: 24px; background: #e0e7ff; border-radius: 12px; }\n  .badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 6px; font-size: 12px; }\n\n</style>\n\n<div class="card">\n  <span class="badge">NEW</span>\n  <h3>Product</h3>\n  <p>A great product.</p>\n</div>\n',
        checks: [
          { label: '.card is position: relative', test: styleIs('.card', 'position', 'relative') },
          { label: '.badge is position: absolute', test: styleIs('.badge', 'position', 'absolute') },
          { label: 'The badge sits in the card\'s top-right corner', test: (d) => { const c = d.querySelector('.card')!.getBoundingClientRect(); const b = d.querySelector('.badge')!.getBoundingClientRect(); return b.top - c.top < 30 && c.right - b.right < 30 } },
        ],
      },
      {
        id: 'sticky-fixed',
        title: 'Sticky, fixed and z-index',
        minutes: 5,
        content: [
          { type: 'code', code: 'header { position: sticky; top: 0; }   /* sticks when you scroll past it */\n.chat-button { position: fixed; bottom: 20px; right: 20px; }  /* always on screen */' },
          { type: 'text', text: 'When elements overlap, z-index decides which is on top. Higher numbers come forward. It only works on positioned elements.' },
          { type: 'tip', text: 'Sticky headers usually need a background color, or the content scrolls visibly behind them.' },
        ],
        task: 'Make the header sticky at the top with a z-index, and fix the .help button to the bottom-right corner.',
        starterCode:
          '<style>\n  header { background: #1e293b; color: white; padding: 16px; }\n  .help { background: #6366f1; color: white; border: 0; padding: 12px 16px; border-radius: 99px; }\n  .long { height: 1200px; }\n\n</style>\n\n<header>Sticky header</header>\n<div class="long">Scroll down…</div>\n<button class="help">? Help</button>\n',
        checks: [
          { label: 'header is sticky', test: styleIs('header', 'position', 'sticky') },
          { label: 'header sticks at top: 0', test: (d) => px(style(d, 'header')?.top) === 0 },
          { label: 'header has a z-index', test: (d) => (style(d, 'header')?.zIndex ?? 'auto') !== 'auto' },
          { label: '.help is fixed', test: styleIs('.help', 'position', 'fixed') },
        ],
      },
    ],
    quiz: [
      {
        q: 'What does 1fr mean in grid-template-columns?',
        options: ['1 pixel', 'One fraction of the free space', '1 frame', 'The first row'],
        answer: 1,
        explain: 'fr units share the available space.',
      },
      {
        q: 'How do you make a grid item 2 columns wide?',
        options: ['width: 2', 'grid-column: span 2', 'columns: 2', 'flex: 2'],
        answer: 1,
        explain: 'grid-column: span 2 stretches the item across two columns.',
      },
      {
        q: 'An absolute element is positioned relative to…',
        options: ['The page always', 'Its nearest positioned ancestor', 'The previous element', 'The screen'],
        answer: 1,
        explain: 'It uses the nearest ancestor with position set (usually relative), or the page if none.',
      },
      {
        q: 'Which keeps an element on screen even while scrolling?',
        options: ['position: relative', 'position: static', 'position: fixed', 'display: block'],
        answer: 2,
        explain: 'fixed elements stay in the same spot on the screen.',
      },
    ],
    project: {
      title: 'Grid your content and pin your header',
      brief: 'Turn a list on your site into a neat grid of cards, and make your header stay at the top while visitors scroll.',
      tips: [
        'Give the list a class, then: .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; list-style: none; }',
        'header { position: sticky; top: 0; z-index: 10; }',
      ],
      requirements: [
        { label: 'A list in your main content uses display: grid', test: (d) => { const l = contentList(d); return !!l && d.defaultView!.getComputedStyle(l).display === 'grid' } },
        { label: 'The grid has at least 2 columns', test: (d) => { const l = contentList(d); return !!l && d.defaultView!.getComputedStyle(l).gridTemplateColumns.split(' ').filter(Boolean).length >= 2 } },
        { label: 'Your header is sticky', test: styleIs('header', 'position', 'sticky') },
        { label: 'It sticks at top: 0', test: (d) => px(style(d, 'header')?.top) === 0 },
        { label: 'Your header has a z-index', test: (d) => (style(d, 'header')?.zIndex ?? 'auto') !== 'auto' },
      ],
    },
  },

  /* ---------------------------------------------------------------- 7 */
  {
    id: 'responsive',
    title: 'Responsive and interactive',
    summary: 'Look great on every screen, react to the mouse and keyboard, and add smooth motion.',
    lessons: [
      {
        id: 'media-queries',
        title: 'Media queries',
        minutes: 7,
        content: [
          { type: 'text', text: 'Media queries apply CSS only when a condition is true, usually the screen width. Write the phone version first, then add rules for bigger screens:' },
          { type: 'code', code: '.cards { display: grid; grid-template-columns: 1fr; }\n\n@media (min-width: 768px) {\n  .cards { grid-template-columns: 1fr 1fr 1fr; }\n}' },
          { type: 'tip', text: 'Common breakpoints: 640px (large phones), 768px (tablets), 1024px (laptops). The live preview here is about 800px wide.' },
        ],
        task: 'Make .cards 1 column by default, and 3 columns at min-width: 600px.',
        starterCode:
          '<style>\n  .card { background: #e0e7ff; padding: 20px; border-radius: 8px; }\n  .cards { display: grid; gap: 12px; }\n\n</style>\n\n<div class="cards">\n  <div class="card">One</div><div class="card">Two</div><div class="card">Three</div>\n</div>\n',
        checks: [
          { label: 'Has a @media (min-width: …) rule', test: (_d, code) => /@media[^{]*min-width/.test(code) },
          { label: 'Shows 3 columns on a wide screen', test: (d) => columns(d, '.cards') === 3 },
        ],
      },
      {
        id: 'pseudo-classes',
        title: 'Hover, focus and more',
        minutes: 6,
        content: [
          { type: 'text', text: 'Pseudo-classes style elements in a certain state:' },
          {
            type: 'code',
            code: 'a:hover { color: tomato; }             /* mouse over */\nbutton:focus-visible { outline: 3px solid gold; } /* keyboard focus */\ninput:focus { border-color: #6366f1; }\nli:nth-child(odd) { background: #f1f5f9; }  /* zebra stripes */\nli:first-child { font-weight: bold; }',
          },
          { type: 'tip', text: 'Never remove focus outlines without adding a replacement. Keyboard users need to see where they are.' },
        ],
        task: 'Add a :hover style for the button, a :focus style for the input, and zebra stripes on the list with :nth-child.',
        starterCode:
          '<style>\n  button { background: #6366f1; color: white; border: 0; padding: 10px 16px; border-radius: 8px; }\n\n</style>\n\n<input placeholder="Type here">\n<button>Hover me</button>\n<ul><li>One</li><li>Two</li><li>Three</li><li>Four</li></ul>\n',
        checks: [
          { label: 'A button:hover rule', test: (_d, code) => /button:hover\s*\{/.test(code) },
          { label: 'An input:focus rule', test: (_d, code) => /input:focus(-visible)?\s*\{/.test(code) },
          { label: 'Zebra stripes with :nth-child', test: (d, code) => /li:nth-child\((odd|even|2n\+?1?)\)/.test(code) && style(d, 'li:nth-child(1)')?.backgroundColor !== style(d, 'li:nth-child(2)')?.backgroundColor },
        ],
      },
      {
        id: 'transitions',
        title: 'Transitions and transforms',
        minutes: 6,
        content: [
          { type: 'text', text: 'transform moves, scales or rotates an element without affecting the layout. transition animates changes smoothly instead of jumping.' },
          { type: 'code', code: '.card {\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n.card:hover {\n  transform: translateY(-4px) scale(1.02);\n  box-shadow: 0 12px 24px rgb(0 0 0 / 15%);\n}' },
          { type: 'tip', text: 'Keep UI transitions short: 150–300ms feels snappy. Longer feels slow.' },
        ],
        task: 'Give .card a transition, and make it move up with transform on :hover.',
        starterCode: '<style>\n  .card { width: 200px; padding: 24px; background: #e0e7ff; border-radius: 12px; }\n\n</style>\n\n<div class="card">Hover me</div>\n',
        checks: [
          { label: '.card has a transition', test: (d) => px(style(d, '.card')?.transitionDuration) > 0 },
          { label: 'A .card:hover rule with transform', test: (_d, code) => /\.card:hover\s*\{[^}]*transform\s*:/.test(code) },
        ],
      },
      {
        id: 'animations',
        title: 'Keyframe animations',
        minutes: 6,
        content: [
          { type: 'text', text: '@keyframes describes an animation step by step; the animation property plays it.' },
          { type: 'code', code: '@keyframes pulse {\n  from { transform: scale(1); }\n  to   { transform: scale(1.1); }\n}\n.dot {\n  animation: pulse 1s ease-in-out infinite alternate;\n}' },
          { type: 'tip', text: 'Respect users who prefer less motion: wrap big animations in @media (prefers-reduced-motion: no-preference).' },
        ],
        task: 'Create a @keyframes animation and apply it to the .dot so it plays forever (infinite).',
        starterCode: '<style>\n  .dot { width: 40px; height: 40px; border-radius: 50%; background: #ec4899; }\n\n</style>\n\n<div class="dot"></div>\n',
        checks: [
          { label: 'Has a @keyframes rule', test: (_d, code) => /@keyframes\s+[\w-]+/.test(code) },
          { label: '.dot uses an animation', test: (d) => (style(d, '.dot')?.animationName ?? 'none') !== 'none' },
          { label: 'It repeats forever', test: styleIs('.dot', 'animationIterationCount', 'infinite') },
        ],
      },
    ],
    quiz: [
      {
        q: 'When does this apply? @media (min-width: 768px) { … }',
        options: ['Screens narrower than 768px', 'Screens 768px wide or wider', 'Only on phones', 'Always'],
        answer: 1,
        explain: 'min-width means "at least this wide".',
      },
      {
        q: 'Which pseudo-class styles a link when the mouse is over it?',
        options: [':focus', ':active', ':hover', ':visited'],
        answer: 2,
        explain: ':hover applies while the pointer is over the element.',
      },
      {
        q: 'What does transition do?',
        options: ['Moves an element', 'Animates property changes smoothly', 'Changes the page', 'Rotates text'],
        answer: 1,
        explain: 'transition animates between the old and new value when a property changes.',
      },
      {
        q: 'Why keep :focus styles visible?',
        options: ['They look nice', 'Keyboard users need to see where they are', 'They are required for links to work', 'They improve speed'],
        answer: 1,
        explain: 'Without a visible focus, keyboard users get lost on the page.',
      },
    ],
    project: {
      title: 'Make it responsive and alive',
      brief: 'The final step! Make your site work beautifully on phones, and add small interactions that make it feel polished. After this, your website is complete.',
      tips: [
        'Stack the header on phones: @media (max-width: 600px) { header { flex-direction: column; } }',
        'Add a smooth hover to links and buttons with transition.',
        'Show keyboard focus: a:focus-visible { outline: 2px solid var(--brand); }',
      ],
      requirements: [
        { label: 'At least one @media rule', test: inCss(/@media[^{]*\((max|min)-width/) },
        { label: 'A :hover style', test: inCss(/:hover\s*\{/) },
        { label: 'A :focus or :focus-visible style', test: inCss(/:focus(-visible)?\s*\{/) },
        { label: 'A transition on something', test: inCss(/transition\s*:/) },
        { label: 'Your site still has all its sections', test: count('main section', 3) },
      ],
    },
  },
]
