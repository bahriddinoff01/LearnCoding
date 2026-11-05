import { codeMatches, colorIsNot, has, hasBackground, px, style, styleAtLeast, styleIs } from '../checks'
import type { Section } from '../types'

// Splits the project code back into its CSS part (see projectCode in ProjectPage)
const cssOf = (code: string) => code.split('/* style.css */')[1] ?? code
const inCss = (re: RegExp) => (_d: Document, code: string) => re.test(cssOf(code))

export const cssPart1: Section[] = [
  /* ---------------------------------------------------------------- 1 */
  {
    id: 'css-basics',
    title: 'CSS basics',
    summary: 'What CSS is, how to connect it, selectors, colors and how the cascade decides who wins.',
    lessons: [
      {
        id: 'what-is-css',
        title: 'Your first CSS rule',
        minutes: 5,
        content: [
          { type: 'text', text: 'HTML builds the page, CSS (Cascading Style Sheets) makes it look good. A CSS rule has a selector (which elements) and declarations (what to change):' },
          { type: 'code', code: 'h1 {\n  color: tomato;\n  font-size: 40px;\n}' },
          { type: 'text', text: 'Each declaration is property: value; and ends with a semicolon. In these lessons, CSS goes inside a <style> tag:' },
          { type: 'code', code: '<style>\n  h1 { color: tomato; }\n</style>\n<h1>Hello CSS</h1>' },
          { type: 'tip', text: 'A missing semicolon or brace can silently break the next rules. Check those first when styles do not apply.' },
        ],
        task: 'Make the <h1> any color except black, and give the paragraph a font-size of 20px.',
        starterCode: '<style>\n\n</style>\n\n<h1>My styled page</h1>\n<p>CSS makes the web beautiful.</p>\n',
        checks: [
          { label: 'The <h1> is not black', test: colorIsNot('h1') },
          { label: 'The paragraph is 20px', test: (d) => px(style(d, 'p')?.fontSize) === 20 },
        ],
      },
      {
        id: 'three-ways',
        title: 'Three ways to add CSS',
        minutes: 5,
        content: [
          {
            type: 'text',
            text: '1) Inline: a style attribute on one element. 2) Internal: a <style> tag in the page. 3) External: a separate .css file linked in the <head>. Real sites use external files, so one stylesheet styles every page.',
          },
          { type: 'code', code: '<!-- 1. Inline -->\n<p style="color: red">Hi</p>\n\n<!-- 2. Internal -->\n<style> p { color: red; } </style>\n\n<!-- 3. External (best) -->\n<link rel="stylesheet" href="style.css">' },
          { type: 'tip', text: 'Your personal website will use an external style.css file. You will link it in this section\'s project step.' },
        ],
        task: 'Style the first paragraph with an inline style (any color), and the second one with a rule in the <style> tag using its class.',
        starterCode: '<style>\n\n</style>\n\n<p>Styled inline</p>\n<p class="second">Styled from the style tag</p>\n',
        checks: [
          { label: 'The first paragraph has an inline style', test: has('p[style]') },
          { label: 'The .second paragraph has a color set in <style>', test: (d, code) => /\.second\s*\{[^}]*color/.test(code) && colorIsNot('.second')(d, code) },
        ],
      },
      {
        id: 'selectors',
        title: 'Selectors',
        minutes: 7,
        content: [
          {
            type: 'code',
            code: 'p { }            /* every <p> */\n.card { }        /* every element with class="card" */\n#hero { }        /* the element with id="hero" */\nh1, h2 { }       /* group: h1 AND h2 */\nnav a { }        /* <a> inside <nav> (descendant) */\nul > li { }      /* <li> directly inside <ul> (child) */',
          },
          { type: 'text', text: 'Most of the time you will use classes. They are reusable and easy to read.' },
          { type: 'tip', text: '* selects every element. It is often used for resets like * { box-sizing: border-box; }.' },
        ],
        task: 'Use 3 kinds of selectors: make all .tag elements have a background color, the #title element any color but black, and links inside nav any color but black.',
        starterCode:
          '<style>\n\n</style>\n\n<h1 id="title">Selectors</h1>\n<nav><a href="#">Home</a> <a href="#">Blog</a></nav>\n<p>Topics: <span class="tag">HTML</span> <span class="tag">CSS</span></p>\n<a href="#">This link is not in the nav</a>\n',
        checks: [
          { label: '.tag elements have a background color', test: hasBackground('.tag') },
          { label: '#title is not black', test: colorIsNot('#title') },
          { label: 'Links inside nav are recolored', test: (d) => { const n = style(d, 'nav a')?.color; const o = style(d, 'body > a')?.color; return !!n && n !== o } },
        ],
      },
      {
        id: 'colors',
        title: 'Colors',
        minutes: 5,
        content: [
          {
            type: 'code',
            code: 'color: tomato;                 /* name */\ncolor: #ff6347;                /* hex */\ncolor: rgb(255, 99, 71);       /* red, green, blue */\ncolor: rgb(255 99 71 / 50%);   /* 50% see-through */\ncolor: hsl(9, 100%, 64%);      /* hue, saturation, lightness */',
          },
          { type: 'text', text: 'color sets the text color, background-color sets the background. Hex codes are most common in real projects; hsl is easiest to tweak by hand.' },
          { type: 'tip', text: 'Keep enough contrast between text and background. Light gray text on white is hard to read.' },
        ],
        task: 'Give the body a background color using a hex code, and the .box a background using rgb().',
        starterCode: '<style>\n\n</style>\n\n<div class="box">I am a box</div>\n',
        checks: [
          { label: 'The body uses a hex background', test: (d, code) => /body\s*\{[^}]*background(-color)?\s*:\s*#[0-9a-f]{3,8}/i.test(code) && hasBackground('body')(d, code) },
          { label: '.box uses an rgb() background', test: (d, code) => /\.box\s*\{[^}]*background(-color)?\s*:\s*rgba?\(/i.test(code) && hasBackground('.box')(d, code) },
        ],
      },
      {
        id: 'cascade',
        title: 'The cascade: who wins?',
        minutes: 6,
        kind: 'fix',
        content: [
          { type: 'text', text: 'When two rules set the same property, CSS picks one. First by specificity (how precise the selector is), then by order (the later rule wins).' },
          { type: 'code', code: 'p { color: black; }      /* weakest */\n.note { color: blue; }   /* class beats element */\n#tip { color: green; }   /* id beats class */' },
          { type: 'text', text: 'Inline styles beat all of these. !important beats everything, but avoid it: it makes CSS very hard to change later.' },
          { type: 'tip', text: 'Some properties like color and font are inherited: children get them from their parents automatically.' },
        ],
        task: 'The .warning paragraph should be red, but it stays black. Fix the CSS without using !important and without inline styles.',
        starterCode:
          '<style>\n  .warning { color: red; }\n  #notes p { color: black; }\n</style>\n\n<div id="notes">\n  <p>Normal note</p>\n  <p class="warning">Warning: this should be red!</p>\n</div>\n',
        checks: [
          { label: 'The .warning paragraph is red', test: styleIs('.warning', 'color', 'rgb(255, 0, 0)') },
          { label: 'The normal note stays black', test: styleIs('#notes p:not(.warning)', 'color', 'rgb(0, 0, 0)') },
          { label: 'No !important or inline style', test: (d, code) => !/!important/.test(code) && !d.querySelector('[style]') },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which part of this rule is the selector?',
        code: 'h1 { color: red; }',
        options: ['color', 'red', 'h1', '{ }'],
        answer: 2,
        explain: 'The selector (h1) chooses which elements the rule applies to.',
      },
      {
        q: 'What is the best way to add CSS to a real website?',
        options: ['Inline style attributes', 'A <style> tag on every page', 'An external .css file linked in <head>', 'Inside <body>'],
        answer: 2,
        explain: 'One external stylesheet can style every page and is easy to maintain.',
      },
      {
        q: 'Which selector is the most specific?',
        options: ['p', '.note', '#tip', 'div p'],
        answer: 2,
        explain: 'id selectors beat classes, which beat element selectors.',
      },
      {
        q: 'Two rules have equal specificity. Which wins?',
        options: ['The first one', 'The later one', 'The shorter one', 'Neither'],
        answer: 1,
        explain: 'With equal specificity, the rule that comes later wins.',
      },
    ],
    project: {
      title: 'Connect your stylesheet',
      brief: 'Time to make your website beautiful! Your site now has a style.css file. Link it in your <head>, then set the basics: a font and background for the whole page, and a color for your name.',
      tips: [
        'Add <link rel="stylesheet" href="style.css"> inside <head> in index.html.',
        'Switch to the style.css tab to write your CSS.',
        'Try font-family: system-ui, sans-serif; for a clean modern font.',
      ],
      requirements: [
        { label: 'index.html links style.css', test: codeMatches(/<link\b[^>]*rel=["']?stylesheet[^>]*href=["']?\.?\/?style\.css|<link\b[^>]*href=["']?\.?\/?style\.css[^>]*rel=["']?stylesheet/i) },
        { label: 'body has a font-family', test: inCss(/body\s*\{[^}]*font-family/i) },
        { label: 'body has a background color', test: hasBackground('body') },
        { label: 'Your <h1> has a color (not black)', test: colorIsNot('h1') },
      ],
    },
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: 'box-model',
    title: 'The box model',
    summary: 'Every element is a box. Control its size, spacing and how boxes flow on the page.',
    lessons: [
      {
        id: 'padding-border-margin',
        title: 'Padding, border and margin',
        minutes: 7,
        content: [
          { type: 'text', text: 'Every element is a box with four layers, from the inside out: content, padding (space inside the border), border, and margin (space outside, pushing other boxes away).' },
          { type: 'code', code: '.card {\n  padding: 16px;              /* all sides */\n  border: 2px solid #ddd;     /* width style color */\n  margin: 24px 0;             /* top/bottom 24px, left/right 0 */\n}' },
          { type: 'text', text: 'Shorthands go clockwise from the top: margin: 10px 20px 30px 40px means top, right, bottom, left.' },
          { type: 'tip', text: 'Open your browser\'s DevTools (F12) and hover an element to see its box model in color.' },
        ],
        task: 'Give the .card at least 16px padding, a solid border, and a margin of at least 20px.',
        starterCode: '<style>\n  .card {\n\n  }\n</style>\n\n<div class="card">\n  <h2>Profile card</h2>\n  <p>I am learning the box model.</p>\n</div>\n',
        checks: [
          { label: 'At least 16px padding', test: styleAtLeast('.card', 'paddingTop', 16) },
          { label: 'A solid border', test: (d) => { const s = style(d, '.card'); return !!s && px(s.borderTopWidth) > 0 && s.borderTopStyle === 'solid' } },
          { label: 'At least 20px margin', test: styleAtLeast('.card', 'marginTop', 20) },
        ],
      },
      {
        id: 'units',
        title: 'Units: px, %, rem, vw',
        minutes: 6,
        content: [
          {
            type: 'code',
            code: 'width: 300px;    /* fixed pixels */\nwidth: 50%;      /* half of the parent */\nfont-size: 1.5rem; /* 1.5 × the root font size (16px → 24px) */\npadding: 1em;    /* relative to this element\'s font size */\nheight: 100vh;   /* full height of the screen */',
          },
          {
            type: 'text',
            text: 'Use rem for font sizes (they respect the user\'s browser settings), % and vw for widths that adapt to the screen, and px for small fixed details like borders.',
          },
          { type: 'tip', text: '1rem is usually 16px. So 2rem = 32px, 0.875rem = 14px.' },
        ],
        task: 'Make the .banner 100% wide, set the h1 font-size to 2.5rem, and the paragraph font-size to 1.25rem.',
        starterCode: '<style>\n\n</style>\n\n<div class="banner">\n  <h1>Units</h1>\n  <p>rem, %, vw and px</p>\n</div>\n',
        checks: [
          { label: '.banner width uses 100%', test: (_d, code) => /\.banner\s*\{[^}]*width\s*:\s*100%/.test(code) },
          { label: 'h1 is 2.5rem (40px)', test: (d) => px(style(d, 'h1')?.fontSize) === 40 },
          { label: 'Paragraph is 1.25rem (20px)', test: (d) => px(style(d, 'p')?.fontSize) === 20 },
        ],
      },
      {
        id: 'width-centering',
        title: 'Width, max-width and centering',
        minutes: 6,
        content: [
          { type: 'text', text: 'max-width stops a box from getting too wide on big screens, and margin: 0 auto centers it. This combo is on almost every website:' },
          { type: 'code', code: '.container {\n  max-width: 800px;\n  margin: 0 auto;\n}' },
          {
            type: 'text',
            text: 'By default, padding and border are added on top of width, so a 300px box with 20px padding is really 340px wide. box-sizing: border-box fixes that:',
          },
          { type: 'code', code: '* { box-sizing: border-box; }' },
        ],
        task: 'Center the .container with a max-width of 600px, and add the border-box rule for every element.',
        starterCode: '<style>\n  .container { background: #e0e7ff; padding: 20px; }\n\n</style>\n\n<div class="container">\n  <h2>Centered content</h2>\n  <p>Readable width on any screen.</p>\n</div>\n',
        checks: [
          { label: '.container max-width is 600px', test: (d) => style(d, '.container')?.maxWidth === '600px' },
          { label: '.container is centered (equal side margins)', test: (d) => { const s = style(d, '.container'); return !!s && px(s.marginLeft) > 0 && s.marginLeft === s.marginRight } },
          { label: 'Every element uses box-sizing: border-box', test: (d) => style(d, 'p')?.boxSizing === 'border-box' },
        ],
      },
      {
        id: 'display',
        title: 'Display: block, inline and none',
        minutes: 5,
        content: [
          {
            type: 'text',
            text: 'Remember block and inline elements from HTML? display lets you change them. block takes a full line, inline flows in text, inline-block flows in text but accepts width, height and padding. none hides the element completely.',
          },
          { type: 'code', code: '.badge { display: inline-block; padding: 4px 8px; }\n.hidden { display: none; }' },
          { type: 'tip', text: 'Later you will learn display: flex and display: grid, the two layout superpowers of CSS.' },
        ],
        task: 'Make the .badge elements inline-block with padding, and hide the .secret element.',
        starterCode: '<style>\n  .badge { background: #fde68a; }\n\n</style>\n\n<p>Skills: <span class="badge">HTML</span> <span class="badge">CSS</span></p>\n<p class="secret">You should not see this.</p>\n',
        checks: [
          { label: '.badge is inline-block', test: styleIs('.badge', 'display', 'inline-block') },
          { label: '.badge has padding', test: styleAtLeast('.badge', 'paddingLeft', 2) },
          { label: '.secret is hidden', test: styleIs('.secret', 'display', 'none') },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which layer is space INSIDE the border?',
        options: ['margin', 'padding', 'outline', 'content'],
        answer: 1,
        explain: 'Padding is inside the border; margin is outside it.',
      },
      {
        q: 'What does margin: 0 auto do to a box with a max-width?',
        options: ['Removes all space', 'Centers it horizontally', 'Makes it full width', 'Hides it'],
        answer: 1,
        explain: 'auto side margins split the free space equally, centering the box.',
      },
      {
        q: 'If the root font size is 16px, what is 2rem?',
        options: ['2px', '16px', '32px', '20px'],
        answer: 2,
        explain: '2rem = 2 × 16px = 32px.',
      },
      {
        q: 'Why use box-sizing: border-box?',
        options: ['To add borders everywhere', 'So padding and border are included in the width', 'To make boxes round', 'To center boxes'],
        answer: 1,
        explain: 'With border-box, a 300px wide box stays 300px even with padding.',
      },
    ],
    project: {
      title: 'Give your content room to breathe',
      brief: 'Make your site readable on big screens. Keep your content at a comfortable width in the middle of the page, and add space inside your sections.',
      tips: [
        'Start style.css with * { box-sizing: border-box; }.',
        'main { max-width: 800px; margin: 0 auto; } is a great start.',
        'Rounded photo: img { border-radius: 50%; } makes it a circle.',
      ],
      requirements: [
        { label: 'Every element uses box-sizing: border-box', test: (d) => style(d, 'main, body')?.boxSizing === 'border-box' },
        { label: '<main> has a max-width', test: (d) => (style(d, 'main')?.maxWidth ?? 'none') !== 'none' },
        { label: '<main> is centered', test: (d) => { const s = style(d, 'main'); return !!s && px(s.marginLeft) > 0 && Math.abs(px(s.marginLeft) - px(s.marginRight)) < 2 } },
        { label: 'Your sections have padding', test: styleAtLeast('main section', 'paddingTop', 8) },
        { label: 'Your photo has rounded corners', test: styleAtLeast('img', 'borderTopLeftRadius', 1) },
      ],
    },
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: 'typography',
    title: 'Typography',
    summary: 'Fonts, sizes, weights and spacing: the difference between amateur and professional.',
    lessons: [
      {
        id: 'fonts',
        title: 'Fonts and font stacks',
        minutes: 6,
        content: [
          { type: 'text', text: 'font-family takes a list. The browser uses the first font it has, so always end with a generic family (serif, sans-serif or monospace).' },
          { type: 'code', code: 'body { font-family: "Inter", system-ui, sans-serif; }\ncode { font-family: "JetBrains Mono", monospace; }' },
          {
            type: 'text',
            text: 'To use a web font like Inter, load it from Google Fonts with a <link> in the <head> (or @import in CSS), then use its name in font-family.',
          },
          { type: 'code', code: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">' },
          { type: 'tip', text: 'Two fonts are plenty: one for headings, one for text. More looks messy.' },
        ],
        task: 'Give the body a sans-serif font stack, and the h1 a different font stack ending in serif.',
        starterCode: '<style>\n\n</style>\n\n<h1>Typography matters</h1>\n<p>Good fonts make reading easy.</p>\n',
        checks: [
          { label: 'body font-family ends with sans-serif', test: (d) => /sans-serif\s*$/.test(style(d, 'body')?.fontFamily ?? '') },
          { label: 'h1 font-family ends with serif', test: (d) => /(^|[\s,])serif\s*$/.test(style(d, 'h1')?.fontFamily ?? '') },
        ],
      },
      {
        id: 'size-weight',
        title: 'Size, weight and style',
        minutes: 5,
        content: [
          { type: 'code', code: 'h1 { font-size: 3rem; font-weight: 800; }\n.caption { font-size: 0.875rem; font-style: italic; }\nstrong { font-weight: 700; }' },
          { type: 'text', text: 'font-weight goes from 100 (thin) to 900 (black). 400 is normal and 700 is bold. A web font only has the weights you load.' },
          { type: 'tip', text: 'A strong size difference between headings and text creates clear hierarchy. Try headings at least 2× the text size.' },
        ],
        task: 'Make the h1 at least 48px and weight 800, and the .caption 14px and italic.',
        starterCode: '<style>\n\n</style>\n\n<h1>Big bold title</h1>\n<p class="caption">A small italic caption</p>\n',
        checks: [
          { label: 'h1 is at least 48px', test: styleAtLeast('h1', 'fontSize', 48) },
          { label: 'h1 weight is 800', test: styleIs('h1', 'fontWeight', '800') },
          { label: '.caption is 14px italic', test: (d) => px(style(d, '.caption')?.fontSize) === 14 && style(d, '.caption')?.fontStyle === 'italic' },
        ],
      },
      {
        id: 'spacing-align',
        title: 'Line height, spacing and alignment',
        minutes: 5,
        content: [
          { type: 'code', code: 'p {\n  line-height: 1.6;       /* space between lines */\n  letter-spacing: 0.02em; /* space between letters */\n  max-width: 65ch;        /* about 65 characters per line */\n}\nh1 { text-align: center; }' },
          { type: 'text', text: 'line-height around 1.5–1.7 makes body text much easier to read. Lines longer than about 75 characters are tiring, so limit width with ch units.' },
          { type: 'tip', text: 'Write line-height without a unit (1.6, not 1.6em). It then scales correctly with every font size.' },
        ],
        task: 'Give paragraphs a line-height of at least 1.5, center the h1, and limit paragraphs to a max-width in ch.',
        starterCode:
          '<style>\n\n</style>\n\n<h1>Readable text</h1>\n<p>Good typography is invisible. When line height, letter spacing and line length are right, readers simply enjoy the content without noticing why it feels so comfortable to read.</p>\n',
        checks: [
          { label: 'Paragraph line-height is at least 1.5', test: (d) => { const s = style(d, 'p'); return !!s && px(s.lineHeight) / px(s.fontSize) >= 1.49 } },
          { label: 'h1 is centered', test: styleIs('h1', 'textAlign', 'center') },
          { label: 'Paragraph max-width uses ch', test: (_d, code) => /p\s*\{[^}]*max-width\s*:\s*[\d.]+ch/.test(code) },
        ],
      },
      {
        id: 'decoration-transform',
        title: 'Decoration and transform',
        minutes: 4,
        content: [
          { type: 'code', code: 'a { text-decoration: none; }            /* remove underline */\na:hover { text-decoration: underline; }\n.label { text-transform: uppercase; }   /* ALL CAPS */' },
          { type: 'tip', text: 'Use text-transform instead of typing in capitals. The HTML stays readable, and screen readers do not spell it out.' },
        ],
        task: 'Remove the underline from the links, and make the .label uppercase with some letter-spacing.',
        starterCode: '<style>\n\n</style>\n\n<p class="label">New feature</p>\n<a href="#">Read more</a> · <a href="#">Docs</a>\n',
        checks: [
          { label: 'Links have no underline', test: (d) => !(style(d, 'a')?.textDecorationLine ?? '').includes('underline') },
          { label: '.label is uppercase', test: styleIs('.label', 'textTransform', 'uppercase') },
          { label: '.label has letter-spacing', test: (d) => (style(d, '.label')?.letterSpacing ?? 'normal') !== 'normal' },
        ],
      },
    ],
    quiz: [
      {
        q: 'Why end a font stack with a generic family like sans-serif?',
        options: ['It is required syntax', 'As a fallback if no other font is available', 'It makes text bold', 'It loads faster'],
        answer: 1,
        explain: 'If none of the named fonts are available, the browser uses its default for that family.',
      },
      {
        q: 'Which font-weight is normal text?',
        options: ['100', '400', '700', '900'],
        answer: 1,
        explain: '400 is normal, 700 is bold.',
      },
      {
        q: 'What is a comfortable line-height for body text?',
        options: ['0.8', '1', 'about 1.5–1.7', '3'],
        answer: 2,
        explain: 'Around 1.5–1.7 gives lines room to breathe.',
      },
      {
        q: 'How do you remove the underline from links?',
        options: ['font-style: none', 'text-decoration: none', 'underline: false', 'text-transform: none'],
        answer: 1,
        explain: 'text-decoration controls underlines.',
      },
    ],
    project: {
      title: 'Make your text look professional',
      brief: 'Typography is most of design. Give your site a comfortable reading rhythm, a confident heading, and clean navigation links.',
      tips: ['Try a Google Font for your name, like "Poppins" or "Playfair Display".', 'body { line-height: 1.6; } instantly improves readability.'],
      requirements: [
        { label: 'Body text line-height is at least 1.4', test: (d) => { const s = style(d, 'p'); return !!s && px(s.lineHeight) / px(s.fontSize) >= 1.39 } },
        { label: 'Your <h1> is at least 32px', test: styleAtLeast('h1', 'fontSize', 32) },
        { label: 'Headings use a font-weight of 600 or more', test: (d) => Number(style(d, 'h1')?.fontWeight) >= 600 },
        { label: 'Navigation links have no underline', test: (d) => !!d.querySelector('nav a') && !(style(d, 'nav a')?.textDecorationLine ?? '').includes('underline') },
      ],
    },
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: 'colors-backgrounds',
    title: 'Colors, backgrounds and depth',
    summary: 'Gradients, borders, shadows and CSS variables for a consistent color theme.',
    lessons: [
      {
        id: 'backgrounds',
        title: 'Backgrounds and gradients',
        minutes: 6,
        content: [
          { type: 'code', code: '.hero {\n  background: linear-gradient(135deg, #6366f1, #ec4899);\n}\n.photo {\n  background-image: url("bg.jpg");\n  background-size: cover;      /* fill, crop if needed */\n  background-position: center;\n}' },
          { type: 'text', text: 'Gradients are images made by CSS. linear-gradient goes in a direction; radial-gradient spreads from a point.' },
          { type: 'tip', text: 'Put text on a busy background? Add a dark see-through layer so the text stays readable.' },
        ],
        task: 'Give the .hero a linear-gradient background and white text.',
        starterCode: '<style>\n  .hero { padding: 40px; }\n\n</style>\n\n<div class="hero">\n  <h1>Gradients!</h1>\n</div>\n',
        checks: [
          { label: '.hero has a linear-gradient', test: (d) => (style(d, '.hero')?.backgroundImage ?? '').includes('linear-gradient') },
          { label: '.hero text is white', test: (d) => style(d, '.hero h1')?.color === 'rgb(255, 255, 255)' },
        ],
      },
      {
        id: 'borders-shadows',
        title: 'Rounded corners and shadows',
        minutes: 5,
        content: [
          { type: 'code', code: '.card {\n  border-radius: 16px;\n  box-shadow: 0 10px 30px rgb(0 0 0 / 15%);\n}\n.avatar { border-radius: 50%; }   /* circle */' },
          { type: 'text', text: 'box-shadow takes: x offset, y offset, blur, color. Soft, large, see-through shadows look modern; hard black ones look dated.' },
          { type: 'tip', text: 'text-shadow works the same way for text.' },
        ],
        task: 'Give the .card rounded corners and a box-shadow, and make the .avatar a circle.',
        starterCode:
          '<style>\n  .card { padding: 24px; max-width: 300px; background: white; }\n  .avatar { width: 80px; height: 80px; }\n\n</style>\n\n<div class="card">\n  <img class="avatar" src="https://i.pravatar.cc/80" alt="Avatar">\n  <h3>Shadow card</h3>\n</div>\n',
        checks: [
          { label: '.card has rounded corners', test: styleAtLeast('.card', 'borderTopLeftRadius', 4) },
          { label: '.card has a box-shadow', test: (d) => (style(d, '.card')?.boxShadow ?? 'none') !== 'none' },
          { label: '.avatar is a circle (50%)', test: (_d, code) => /\.avatar\s*\{[^}]*border-radius\s*:\s*50%/.test(code) },
        ],
      },
      {
        id: 'variables',
        title: 'CSS variables',
        minutes: 6,
        content: [
          { type: 'text', text: 'Custom properties (variables) store a value once and reuse it everywhere. Change one line, and the whole theme updates.' },
          { type: 'code', code: ':root {\n  --brand: #6366f1;\n  --radius: 12px;\n}\nbutton {\n  background: var(--brand);\n  border-radius: var(--radius);\n}' },
          { type: 'tip', text: 'This very website uses CSS variables for its light and dark mode!' },
        ],
        task: 'Create a --brand variable on :root and use it for both the h1 color and the button background.',
        starterCode: '<style>\n\n</style>\n\n<h1>Variables</h1>\n<button>Click me</button>\n',
        checks: [
          { label: 'A --brand variable on :root', test: (_d, code) => /:root\s*\{[^}]*--brand\s*:/.test(code) },
          { label: 'h1 uses var(--brand)', test: (_d, code) => /h1\s*\{[^}]*var\(--brand\)/.test(code) },
          { label: 'button uses var(--brand)', test: (_d, code) => /button\s*\{[^}]*var\(--brand\)/.test(code) },
        ],
      },
      {
        id: 'opacity',
        title: 'Opacity and transparent colors',
        minutes: 4,
        kind: 'fix',
        content: [
          { type: 'text', text: 'opacity makes a whole element see-through, including its text. To make only the background see-through, use a transparent color instead:' },
          { type: 'code', code: '.overlay { opacity: 0.5; }                      /* text fades too */\n.overlay { background: rgb(0 0 0 / 50%); }      /* only the background */' },
        ],
        task: 'The banner text is faded because of opacity. Make only the background see-through: remove the opacity and use a transparent background color instead.',
        starterCode:
          '<style>\n  body { background: url("https://picsum.photos/600/300") center / cover; }\n  .banner { background: black; color: white; padding: 30px; opacity: 0.5; }\n</style>\n\n<div class="banner"><h2>Readable text, see-through box</h2></div>\n',
        checks: [
          { label: 'The banner has no opacity', test: (d) => style(d, '.banner')?.opacity === '1' },
          {
            label: 'The background is see-through',
            test: (d) => {
              // Browsers report transparent colors as rgba(r, g, b, alpha)
              const alpha = Number((style(d, '.banner')?.backgroundColor ?? '').match(/rgba\([^)]*,\s*([\d.]+)\)/)?.[1] ?? 1)
              return alpha > 0 && alpha < 1
            },
          },
        ],
      },
    ],
    quiz: [
      {
        q: 'How do you make a circle from a square image?',
        options: ['border-radius: 50%', 'shape: circle', 'border: round', 'radius: 100px'],
        answer: 0,
        explain: '50% radius on a square turns it into a circle.',
      },
      {
        q: 'How do you use a variable named --brand?',
        options: ['$brand', 'var(--brand)', '--brand()', '@brand'],
        answer: 1,
        explain: 'Read variables with var(--name).',
      },
      {
        q: 'Which keeps the text fully visible while the background is see-through?',
        options: ['opacity: 0.5', 'background: rgb(0 0 0 / 50%)', 'visibility: half', 'filter: blur()'],
        answer: 1,
        explain: 'opacity fades everything, a transparent background color fades only the background.',
      },
      {
        q: 'In box-shadow: 0 10px 30px black, what is 30px?',
        options: ['The x offset', 'The y offset', 'The blur', 'The spread'],
        answer: 2,
        explain: 'The order is x offset, y offset, blur, then color.',
      },
    ],
    project: {
      title: 'Create your color theme',
      brief: 'Give your website a personality. Define your colors as CSS variables, give the header a background, and add depth with a shadow.',
      tips: [
        'Pick 2–3 colors: a brand color, a light background, and dark text. coolors.co helps you choose.',
        'Try a gradient for the header: linear-gradient(135deg, var(--brand), var(--accent)).',
      ],
      requirements: [
        { label: 'At least 2 color variables on :root', test: inCss(/:root\s*\{(?:[^}]*--[\w-]+\s*:){2}/) },
        { label: 'Variables are used with var()', test: inCss(/var\(--[\w-]+\)/) },
        { label: 'Your <header> has a background', test: hasBackground('header') },
        { label: 'Something has a box-shadow', test: (d) => [...d.querySelectorAll('body *')].some((el) => d.defaultView!.getComputedStyle(el).boxShadow !== 'none') },
        { label: 'Your submit button is styled with rounded corners', test: styleAtLeast('form button, form input[type="submit"]', 'borderTopLeftRadius', 2) },
      ],
    },
  },
]
