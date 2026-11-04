import type { Section } from './types'

export const htmlSections: Section[] = [
  {
    id: 'basics',
    title: 'HTML Basics',
    lessons: [
      {
        id: 'first-page',
        title: 'Your first web page',
        minutes: 5,
        content: [
          {
            type: 'text',
            text: 'HTML (HyperText Markup Language) describes the structure of a web page. You wrap content in tags, and the browser decides how to show it.',
          },
          {
            type: 'code',
            code: '<h1>This is a big heading</h1>\n<p>This is a paragraph of text.</p>',
          },
          {
            type: 'text',
            text: 'Most tags come in pairs: an opening tag like <p> and a closing tag like </p>. There are six heading levels, from <h1> (most important) to <h6>.',
          },
          { type: 'tip', text: 'Use only one <h1> per page. It tells search engines what the page is about.' },
        ],
        task: 'Add an <h1> heading with your name, and a <p> paragraph that says what you want to build.',
        starterCode: '<!-- Write your HTML below -->\n\n',
        checks: [
          { label: 'Page has an <h1> heading', test: (d) => !!d.querySelector('h1') },
          { label: 'The heading is not empty', test: (d) => (d.querySelector('h1')?.textContent ?? '').trim().length > 0 },
          { label: 'Page has a <p> paragraph with text', test: (d) => (d.querySelector('p')?.textContent ?? '').trim().length > 0 },
        ],
      },
      {
        id: 'links-images',
        title: 'Links and images',
        minutes: 6,
        content: [
          { type: 'text', text: 'Links use the <a> tag. The href attribute says where the link goes.' },
          { type: 'code', code: '<a href="https://developer.mozilla.org">Read the MDN docs</a>' },
          {
            type: 'text',
            text: 'Images use the <img> tag. It has no closing tag. The src attribute is the image address, and alt describes the image for screen readers and when it fails to load.',
          },
          { type: 'code', code: '<img src="https://picsum.photos/300/200" alt="A random landscape photo">' },
          { type: 'tip', text: 'Always write a useful alt text. It is required for accessibility.' },
        ],
        task: 'Add a link to any website, and an image with a descriptive alt text.',
        starterCode: '<h1>My favorite things</h1>\n\n',
        checks: [
          { label: 'Page has a link with an href', test: (d) => !!d.querySelector('a[href]:not([href=""])') },
          { label: 'The link has visible text', test: (d) => (d.querySelector('a')?.textContent ?? '').trim().length > 0 },
          { label: 'Page has an image with a src', test: (d) => !!d.querySelector('img[src]:not([src=""])') },
          { label: 'The image has alt text', test: (d) => (d.querySelector('img')?.getAttribute('alt') ?? '').trim().length > 0 },
        ],
      },
      {
        id: 'lists',
        title: 'Lists',
        minutes: 5,
        content: [
          { type: 'text', text: 'Use <ul> for an unordered (bulleted) list and <ol> for an ordered (numbered) list. Each item goes inside <li>.' },
          { type: 'code', code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>' },
          { type: 'tip', text: 'Lists can be nested: put a whole <ul> inside an <li>.' },
        ],
        task: 'Make a bulleted list of at least 3 things you want to learn, and a numbered list of 3 steps for your morning routine.',
        starterCode: '<h2>What I want to learn</h2>\n\n<h2>My morning routine</h2>\n\n',
        checks: [
          { label: 'Page has a <ul> list', test: (d) => !!d.querySelector('ul') },
          { label: 'The <ul> has at least 3 items', test: (d) => (d.querySelector('ul')?.querySelectorAll(':scope > li').length ?? 0) >= 3 },
          { label: 'Page has an <ol> list', test: (d) => !!d.querySelector('ol') },
          { label: 'The <ol> has at least 3 items', test: (d) => (d.querySelector('ol')?.querySelectorAll(':scope > li').length ?? 0) >= 3 },
        ],
      },
    ],
  },
  {
    id: 'forms',
    title: 'Forms',
    lessons: [
      {
        id: 'first-form',
        title: 'Your first form',
        minutes: 8,
        content: [
          { type: 'text', text: 'Forms collect input from users. A <form> holds inputs, and each input should have a <label> so people know what to type.' },
          {
            type: 'code',
            code: '<form>\n  <label for="email">Email</label>\n  <input id="email" type="email">\n  <button type="submit">Sign up</button>\n</form>',
          },
          { type: 'text', text: 'The for attribute on the label must match the id of the input. Clicking the label then focuses the input.' },
          { type: 'tip', text: 'Pick the right input type (email, password, number, date). Phones show a matching keyboard.' },
        ],
        task: 'Build a sign-up form with a name field, an email field (type="email"), both with labels, and a submit button.',
        starterCode: '<h1>Join LearnCoding</h1>\n\n',
        checks: [
          { label: 'Page has a <form>', test: (d) => !!d.querySelector('form') },
          { label: 'There is an email input', test: (d) => !!d.querySelector('form input[type="email"]') },
          { label: 'There are at least 2 inputs', test: (d) => d.querySelectorAll('form input').length >= 2 },
          {
            label: 'Every input has a matching <label>',
            test: (d) => {
              const inputs = [...d.querySelectorAll('form input')]
              return inputs.length > 0 && inputs.every((i) => i.id && d.querySelector(`label[for="${i.id}"]`))
            },
          },
          { label: 'There is a submit button', test: (d) => !!d.querySelector('form button, form input[type="submit"]') },
        ],
      },
    ],
  },
]
