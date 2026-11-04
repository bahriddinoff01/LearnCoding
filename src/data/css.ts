import type { Section } from './types'

// Computed style of the first element matching the selector
function style(doc: Document, selector: string) {
  const el = doc.querySelector(selector)
  return el ? doc.defaultView!.getComputedStyle(el) : null
}

const px = (v?: string | null) => parseFloat(v ?? '') || 0

export const cssSections: Section[] = [
  {
    id: 'basics',
    title: 'CSS Basics',
    lessons: [
      {
        id: 'colors-fonts',
        title: 'Colors and fonts',
        minutes: 6,
        content: [
          {
            type: 'text',
            text: 'CSS (Cascading Style Sheets) controls how HTML looks. A rule has a selector (which elements) and declarations (what to change).',
          },
          {
            type: 'code',
            code: '<style>\n  h1 {\n    color: tomato;\n    font-family: Georgia, serif;\n  }\n  body {\n    background-color: #fdf6e3;\n  }\n</style>\n\n<h1>Styled heading</h1>',
          },
          {
            type: 'text',
            text: 'Colors can be names (tomato), hex codes (#ff6347) or rgb(255, 99, 71). Put your CSS inside a <style> tag for now.',
          },
          { type: 'tip', text: 'Set a font-family list with a fallback at the end, like "Georgia, serif".' },
        ],
        task: 'Give the page a background color, make the <h1> a color other than black, and change the paragraph font size to 20px.',
        starterCode: '<style>\n\n</style>\n\n<h1>My styled page</h1>\n<p>CSS makes the web beautiful.</p>\n',
        checks: [
          {
            label: 'The body has a background color',
            test: (d) => {
              const bg = style(d, 'body')?.backgroundColor
              return !!bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
            },
          },
          {
            label: 'The <h1> is not black',
            test: (d) => {
              const c = style(d, 'h1')?.color
              return !!c && c !== 'rgb(0, 0, 0)'
            },
          },
          { label: 'The paragraph font size is 20px', test: (d) => px(style(d, 'p')?.fontSize) === 20 },
        ],
      },
      {
        id: 'box-model',
        title: 'The box model',
        minutes: 8,
        content: [
          {
            type: 'text',
            text: 'Every element is a box. From the inside out: content, padding (space inside), border, and margin (space outside).',
          },
          {
            type: 'code',
            code: '.card {\n  padding: 16px;\n  border: 2px solid #ddd;\n  border-radius: 12px;\n  margin: 24px;\n}',
          },
          { type: 'text', text: 'A dot before a name selects by class: .card matches <div class="card">.' },
          { type: 'tip', text: 'Add box-sizing: border-box so padding does not make boxes wider than you set.' },
        ],
        task: 'Style the .card: at least 16px padding, a visible border, and rounded corners (border-radius).',
        starterCode:
          '<style>\n  .card {\n\n  }\n</style>\n\n<div class="card">\n  <h2>Profile card</h2>\n  <p>I am learning CSS.</p>\n</div>\n',
        checks: [
          { label: '.card has at least 16px padding', test: (d) => px(style(d, '.card')?.paddingTop) >= 16 },
          {
            label: '.card has a visible border',
            test: (d) => {
              const s = style(d, '.card')
              return !!s && px(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none'
            },
          },
          { label: '.card has rounded corners', test: (d) => px(style(d, '.card')?.borderTopLeftRadius) > 0 },
        ],
      },
      {
        id: 'flexbox',
        title: 'Flexbox layouts',
        minutes: 10,
        content: [
          { type: 'text', text: 'Flexbox lines up elements in a row or column. Turn it on with display: flex on the parent.' },
          {
            type: 'code',
            code: '.row {\n  display: flex;\n  gap: 16px;\n  justify-content: space-between;\n  align-items: center;\n}',
          },
          {
            type: 'text',
            text: 'gap adds space between items, justify-content spreads them along the row, and align-items lines them up across it.',
          },
          { type: 'tip', text: 'Use flex-direction: column to stack items vertically instead.' },
        ],
        task: 'Make .row a flex container with a gap between the three boxes, and center the items vertically.',
        starterCode:
          '<style>\n  .box { padding: 20px; background: #e0e7ff; border-radius: 8px; }\n  .row {\n\n  }\n</style>\n\n<div class="row">\n  <div class="box">HTML</div>\n  <div class="box">CSS</div>\n  <div class="box">JS</div>\n</div>\n',
        checks: [
          { label: '.row uses display: flex', test: (d) => style(d, '.row')?.display === 'flex' },
          { label: 'There is a gap between the boxes', test: (d) => px(style(d, '.row')?.columnGap) > 0 },
          { label: 'Items are centered vertically', test: (d) => style(d, '.row')?.alignItems === 'center' },
        ],
      },
    ],
  },
]
