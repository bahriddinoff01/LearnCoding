import { codeMatches, count, has, hasAttr, hasText } from '../checks'
import type { Section } from '../types'

const labelled = (d: Document) => {
  const inputs = [...d.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="hidden"]), textarea, select')]
  return inputs.length > 0 && inputs.every((i) => (i.id && d.querySelector(`label[for="${i.id}"]`)) || i.closest('label'))
}

export const htmlPart2: Section[] = [
  /* ---------------------------------------------------------------- 5 */
  {
    id: 'lists-tables',
    title: 'Lists and tables',
    summary: 'Organize information with bulleted, numbered and description lists, and data tables.',
    lessons: [
      {
        id: 'ul-ol',
        title: 'Bulleted and numbered lists',
        minutes: 5,
        content: [
          { type: 'text', text: '<ul> makes an unordered (bulleted) list. <ol> makes an ordered (numbered) list. Every item goes inside <li>.' },
          { type: 'code', code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>\n\n<ol>\n  <li>Wake up</li>\n  <li>Code</li>\n</ol>' },
          { type: 'text', text: 'Ordered lists can start at any number with start="5", or use letters with type="A".' },
          { type: 'tip', text: 'Use <ol> when order matters (steps, rankings) and <ul> when it does not (features, ingredients).' },
        ],
        task: 'Make a bulleted list of 3 ingredients and a numbered list of 3 cooking steps.',
        starterCode: '<h2>Ingredients</h2>\n\n<h2>Steps</h2>\n',
        checks: [
          { label: 'A <ul> with at least 3 items', test: (d) => (d.querySelector('ul')?.querySelectorAll(':scope > li').length ?? 0) >= 3 },
          { label: 'An <ol> with at least 3 items', test: (d) => (d.querySelector('ol')?.querySelectorAll(':scope > li').length ?? 0) >= 3 },
          { label: 'Every list item has text', test: (d) => [...d.querySelectorAll('li')].every((li) => li.textContent!.trim()) },
        ],
      },
      {
        id: 'nested-dl',
        title: 'Nested and description lists',
        minutes: 5,
        content: [
          { type: 'text', text: 'Put a whole list inside an <li> to make sub-items. This is how menus with submenus are built.' },
          { type: 'code', code: '<ul>\n  <li>Frontend\n    <ul>\n      <li>HTML</li>\n      <li>CSS</li>\n    </ul>\n  </li>\n</ul>' },
          { type: 'text', text: 'A description list pairs terms with descriptions: <dl> wraps it, <dt> is the term, <dd> is the description. Great for glossaries and FAQs.' },
          { type: 'code', code: '<dl>\n  <dt>HTML</dt>\n  <dd>The structure of a page</dd>\n</dl>' },
        ],
        task: 'Make a list with a nested list inside one of its items, and a <dl> with 2 terms and descriptions.',
        starterCode: '<h2>My skills</h2>\n\n<h2>Glossary</h2>\n',
        checks: [
          { label: 'A list nested inside an <li>', test: has('li > ul, li > ol') },
          { label: 'A <dl> with at least 2 <dt> terms', test: count('dl dt', 2) },
          { label: 'Each term has a <dd> description', test: (d) => d.querySelectorAll('dl dd').length >= d.querySelectorAll('dl dt').length && d.querySelectorAll('dl dd').length > 0 },
        ],
      },
      {
        id: 'tables',
        title: 'Tables',
        minutes: 6,
        content: [
          { type: 'text', text: 'Tables show data in rows and columns. <table> wraps it, <tr> is a row, <th> is a header cell and <td> is a normal cell.' },
          {
            type: 'code',
            code: '<table>\n  <tr>\n    <th>Day</th>\n    <th>Topic</th>\n  </tr>\n  <tr>\n    <td>Monday</td>\n    <td>HTML</td>\n  </tr>\n</table>',
          },
          { type: 'tip', text: 'Use tables only for data, never to arrange a page layout. Layout is CSS\'s job.' },
        ],
        task: 'Build a weekly timetable with a header row (2+ columns) and at least 3 data rows.',
        starterCode: '<h2>My study week</h2>\n',
        checks: [
          { label: 'Has a <table>', test: has('table') },
          { label: 'At least 2 header cells (<th>)', test: count('th', 2) },
          { label: 'At least 3 rows with data cells', test: (d) => [...d.querySelectorAll('tr')].filter((r) => r.querySelector('td')).length >= 3 },
        ],
      },
      {
        id: 'table-structure',
        title: 'Table structure and merged cells',
        minutes: 6,
        content: [
          {
            type: 'text',
            text: 'Bigger tables use <caption> for a title, <thead> for header rows, <tbody> for data and <tfoot> for totals. colspan="2" stretches a cell across two columns; rowspan does the same down rows.',
          },
          {
            type: 'code',
            code: '<table>\n  <caption>Prices</caption>\n  <thead>\n    <tr><th>Item</th><th>Price</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Coffee</td><td>$3</td></tr>\n  </tbody>\n  <tfoot>\n    <tr><td colspan="2">Prices include tax</td></tr>\n  </tfoot>\n</table>',
          },
        ],
        task: 'Build a menu table with a <caption>, <thead>, <tbody>, and a <tfoot> row that uses colspan.',
        starterCode: '',
        checks: [
          { label: 'Has a <caption>', test: hasText('caption') },
          { label: 'Has <thead> and <tbody>', test: (d) => !!d.querySelector('thead') && !!d.querySelector('tbody') },
          { label: 'A cell uses colspan', test: has('[colspan]') },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which list fits "steps to install an app"?',
        options: ['<ul>', '<ol>', '<dl>', '<li>'],
        answer: 1,
        explain: 'Steps have an order, so use a numbered <ol>.',
      },
      {
        q: 'What goes directly inside <ul>?',
        options: ['<p>', '<li>', '<dt>', 'Any text'],
        answer: 1,
        explain: 'Only <li> items go directly inside <ul> and <ol>.',
      },
      {
        q: 'Which cell is a table header?',
        options: ['<td>', '<tr>', '<th>', '<thead>'],
        answer: 2,
        explain: '<th> is a header cell. <thead> groups header rows, and <tr> is a row.',
      },
      {
        q: 'What does colspan="3" do?',
        options: ['Makes 3 columns', 'Stretches a cell across 3 columns', 'Repeats a cell 3 times', 'Sets column width to 3px'],
        answer: 1,
        explain: 'colspan merges a cell across that many columns.',
      },
    ],
    project: {
      title: 'Show your skills',
      brief: 'Add a "Skills" part to your site with a list of what you know or are learning, and a small table (for example your weekly learning plan or experience).',
      tips: ['Mark what you are learning right now, like "CSS (learning)".', 'The table could show Day / Topic, or Year / What I did.'],
      requirements: [
        { label: 'A "Skills" heading', test: (d) => [...d.querySelectorAll('h2,h3')].some((h) => /skill/i.test(h.textContent!)) },
        { label: 'A list with at least 3 skills', test: (d) => [...d.querySelectorAll('ul, ol')].some((l) => l.querySelectorAll(':scope > li').length >= 3) },
        { label: 'A table with header cells', test: has('table th') },
        { label: 'The table has at least 2 data rows', test: (d) => [...d.querySelectorAll('table tr')].filter((r) => r.querySelector('td')).length >= 2 },
      ],
    },
  },

  /* ---------------------------------------------------------------- 6 */
  {
    id: 'forms',
    title: 'Forms',
    summary: 'Collect information from people: inputs, choices, labels and built-in validation.',
    lessons: [
      {
        id: 'form-basics',
        title: 'Forms, inputs and labels',
        minutes: 6,
        content: [
          { type: 'text', text: 'A <form> groups inputs that get sent together. Every input needs a <label> so people (and screen readers) know what to type.' },
          { type: 'code', code: '<form>\n  <label for="name">Your name</label>\n  <input id="name" name="name" type="text">\n  <button type="submit">Send</button>\n</form>' },
          {
            type: 'text',
            text: 'The label\'s for must match the input\'s id. Then clicking the label focuses the input. The name attribute is the key the data is sent with.',
          },
          { type: 'tip', text: 'placeholder text is a hint, not a label. It disappears when typing, so always use a real <label>.' },
        ],
        task: 'Build a form with a labelled text input for a name and a submit button.',
        starterCode: '<h2>Join the newsletter</h2>\n',
        checks: [
          { label: 'Has a <form>', test: has('form') },
          { label: 'A text input with a name', test: has('form input[name]:not([type="submit"])') },
          { label: 'Every input has a matching <label>', test: labelled },
          { label: 'A submit button', test: has('form button, form input[type="submit"]') },
        ],
      },
      {
        id: 'input-types',
        title: 'Input types',
        minutes: 6,
        content: [
          { type: 'text', text: 'The type attribute changes what an input accepts, and phones show a matching keyboard.' },
          {
            type: 'code',
            code: '<input type="email">     <!-- checks for @ -->\n<input type="password">  <!-- hides typing -->\n<input type="number">    <!-- digits only -->\n<input type="date">      <!-- date picker -->\n<input type="tel">       <!-- phone keypad -->\n<input type="color">     <!-- color picker -->',
          },
          { type: 'tip', text: 'Choosing the right type is free validation and a better experience on mobile.' },
        ],
        task: 'Build a sign-up form with labelled email, password and date-of-birth inputs.',
        starterCode: '<h2>Create account</h2>\n<form>\n\n</form>\n',
        checks: [
          { label: 'An email input', test: has('input[type="email"]') },
          { label: 'A password input', test: has('input[type="password"]') },
          { label: 'A date input', test: has('input[type="date"]') },
          { label: 'Every input has a matching <label>', test: labelled },
        ],
      },
      {
        id: 'choices',
        title: 'Checkboxes, radios and dropdowns',
        minutes: 7,
        content: [
          { type: 'text', text: 'Radio buttons let people pick one option. Give every radio in a group the same name. Checkboxes allow many choices.' },
          {
            type: 'code',
            code: '<input type="radio" id="tea" name="drink" value="tea">\n<label for="tea">Tea</label>\n<input type="radio" id="coffee" name="drink" value="coffee">\n<label for="coffee">Coffee</label>',
          },
          { type: 'text', text: '<select> makes a dropdown, with each choice in an <option>. <textarea> is a multi-line text box for longer messages.' },
          { type: 'code', code: '<select id="city" name="city">\n  <option>Tashkent</option>\n  <option>Samarkand</option>\n</select>\n<textarea id="msg" name="message" rows="4"></textarea>' },
          { type: 'tip', text: 'Group related choices in <fieldset> with a <legend> title. Screen readers read the legend with each option.' },
        ],
        task: 'Build an order form with 2+ radio buttons sharing one name inside a <fieldset> with a <legend>, a <select> with 2+ options, and a <textarea>. Label everything.',
        starterCode: '<h2>Order a drink</h2>\n<form>\n\n</form>\n',
        checks: [
          { label: 'At least 2 radios with the same name', test: (d) => { const n = [...d.querySelectorAll('input[type="radio"]')].map((r) => r.getAttribute('name')); return n.length >= 2 && new Set(n).size === 1 && !!n[0] } },
          { label: 'A <fieldset> with a <legend>', test: hasText('fieldset legend') },
          { label: 'A <select> with at least 2 options', test: count('select option', 2) },
          { label: 'A <textarea>', test: has('textarea') },
          { label: 'Every input has a label', test: labelled },
        ],
      },
      {
        id: 'validation',
        title: 'Built-in validation',
        minutes: 5,
        kind: 'fix',
        content: [
          { type: 'text', text: 'HTML can check input before it is sent, with no JavaScript:' },
          {
            type: 'code',
            code: '<input type="email" required>              <!-- must be filled -->\n<input type="number" min="1" max="10">      <!-- range -->\n<input type="text" minlength="3" maxlength="20">\n<input type="text" pattern="[0-9]{5}">      <!-- 5 digits -->',
          },
          { type: 'tip', text: 'Browser validation helps users, but a real server must always check the data again. Never trust only the browser.' },
        ],
        task: 'This booking form accepts anything, even empty fields. Make name and email required, the email a real email field, and limit guests to between 1 and 10.',
        starterCode:
          '<form>\n  <label for="name">Name</label>\n  <input id="name" name="name" type="text">\n\n  <label for="email">Email</label>\n  <input id="email" name="email" type="text">\n\n  <label for="guests">Guests</label>\n  <input id="guests" name="guests" type="number">\n\n  <button type="submit">Book</button>\n</form>\n',
        checks: [
          { label: 'Name is required', test: has('#name[required]') },
          { label: 'Email uses type="email" and is required', test: has('#email[type="email"][required]') },
          { label: 'Guests has min="1"', test: has('#guests[min="1"]') },
          { label: 'Guests has max="10"', test: has('#guests[max="10"]') },
        ],
      },
    ],
    quiz: [
      {
        q: 'How does a <label> connect to its input?',
        options: ['label name = input name', 'label for = input id', 'label id = input for', 'By being next to it'],
        answer: 1,
        explain: 'The label\'s for attribute must match the input\'s id (or the input sits inside the label).',
      },
      {
        q: 'Radio buttons in the same group must share the same…',
        options: ['id', 'value', 'name', 'label'],
        answer: 2,
        explain: 'The same name makes them one group, so only one can be selected.',
      },
      {
        q: 'Which input shows a phone number keypad on mobile?',
        options: ['type="number"', 'type="tel"', 'type="phone"', 'type="text"'],
        answer: 1,
        explain: 'type="tel" shows the phone keypad.',
      },
      {
        q: 'What does the required attribute do?',
        options: ['Hides the field', 'Stops the form being sent while the field is empty', 'Makes the text bold', 'Saves the value'],
        answer: 1,
        explain: 'The browser blocks submission and shows a message until required fields are filled.',
      },
      {
        q: 'Why is placeholder not enough instead of a label?',
        options: ['It is not supported', 'It disappears when typing, and screen readers may skip it', 'It is too small', 'It cannot have text'],
        answer: 1,
        explain: 'Placeholders vanish as you type, so users forget what the field was for.',
      },
    ],
    project: {
      title: 'Add a contact form',
      brief: 'Let visitors send you a message. Add a contact form to your site with everything you learned: labels, the right input types and validation.',
      tips: ['Give the form (or its section) id="contact" so you can link to it later.', 'A message box should be a <textarea>.'],
      requirements: [
        { label: 'A <form>', test: has('form') },
        { label: 'A required name field', test: has('form input[type="text"][required], form input:not([type])[required]') },
        { label: 'A required email field (type="email")', test: has('form input[type="email"][required]') },
        { label: 'A <textarea> for the message', test: has('form textarea') },
        { label: 'Every field has a label', test: labelled },
        { label: 'A submit button', test: has('form button, form input[type="submit"]') },
      ],
    },
  },

  /* ---------------------------------------------------------------- 7 */
  {
    id: 'semantic',
    title: 'Semantic layout and accessibility',
    summary: 'Structure pages like a professional, and make them usable for everyone.',
    lessons: [
      {
        id: 'div-span',
        title: 'Div, span, id and class',
        minutes: 6,
        content: [
          {
            type: 'text',
            text: '<div> is a plain block box and <span> is a plain inline box. They have no meaning on their own; they exist to group things so you can style them with CSS.',
          },
          { type: 'code', code: '<div class="card">\n  <h3>HTML</h3>\n  <p>Level: <span class="badge">Beginner</span></p>\n</div>' },
          {
            type: 'text',
            text: 'class names a group (many elements can share it). id names one unique element. data-* attributes store your own extra information, like data-level="2".',
          },
          { type: 'tip', text: 'Use a class for styling and reuse. Use an id for one-of-a-kind things like #contact.' },
        ],
        task: 'Make two <div class="card"> boxes, each with a heading and a <span class="badge">. Give the first card a data-level attribute.',
        starterCode: '',
        checks: [
          { label: 'Two elements with class="card"', test: count('.card', 2) },
          { label: 'Each card has a heading', test: (d) => [...d.querySelectorAll('.card')].every((c) => c.querySelector('h1,h2,h3,h4')) },
          { label: 'Each card has a <span class="badge">', test: (d) => [...d.querySelectorAll('.card')].every((c) => c.querySelector('span.badge')) },
          { label: 'A data-level attribute', test: has('[data-level]') },
        ],
      },
      {
        id: 'semantic-tags',
        title: 'Semantic layout tags',
        minutes: 7,
        content: [
          { type: 'text', text: 'Instead of a page full of <div>s, HTML has tags that say what each part is:' },
          {
            type: 'code',
            code: '<header>   top of the page: logo, title\n  <nav>    main links\n<main>     the main content (one per page)\n  <section>  a themed group with a heading\n  <article>  self-contained: a post, a card\n  <aside>    side info: tips, related links\n<footer>   bottom: copyright, contacts',
          },
          {
            type: 'code',
            code: '<header>\n  <h1>My Blog</h1>\n  <nav><a href="#posts">Posts</a></nav>\n</header>\n<main>\n  <section id="posts">\n    <h2>Posts</h2>\n    <article><h3>First post</h3></article>\n  </section>\n</main>\n<footer>&copy; 2026</footer>',
          },
          { type: 'tip', text: 'Screen reader users can jump straight to <nav> or <main>. Semantic tags make your site faster to use for them, and help search engines.' },
        ],
        task: 'Build a page skeleton with <header> (containing <nav>), <main> with a <section> and an <article>, and a <footer>.',
        starterCode: '',
        checks: [
          { label: 'A <header> with a <nav> inside', test: has('header nav') },
          { label: 'A <main>', test: has('main') },
          { label: 'A <section> and an <article> inside main', test: (d) => !!d.querySelector('main section') && !!d.querySelector('main article') },
          { label: 'A <footer>', test: has('footer') },
        ],
      },
      {
        id: 'nav-menu',
        title: 'Building a navigation menu',
        minutes: 5,
        content: [
          { type: 'text', text: 'A navigation menu is a list of links inside <nav>. Using a list tells screen readers how many links there are.' },
          { type: 'code', code: '<nav>\n  <ul>\n    <li><a href="#about">About</a></li>\n    <li><a href="#skills">Skills</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>' },
          { type: 'tip', text: 'In the CSS course you will turn this vertical list into a horizontal menu bar.' },
        ],
        task: 'Build a <nav> with a list of 3 links that jump to sections, and add those 3 sections with matching ids.',
        starterCode: '',
        checks: [
          { label: 'A <nav> with a list', test: has('nav ul, nav ol') },
          { label: 'At least 3 links in the menu', test: count('nav li a', 3) },
          {
            label: 'Every menu link points to a section on the page',
            test: (d) => { const links = [...d.querySelectorAll('nav a[href^="#"]')]; return links.length >= 3 && links.every((a) => d.getElementById(a.getAttribute('href')!.slice(1))) },
          },
        ],
      },
      {
        id: 'accessibility',
        title: 'Accessibility basics',
        minutes: 6,
        kind: 'fix',
        content: [
          {
            type: 'text',
            text: 'Accessibility means everyone can use your site, including people using screen readers or only a keyboard. Most of it is just good HTML: alt text, labels, a lang, and headings in order (h1 → h2 → h3, no skipping).',
          },
          {
            type: 'text',
            text: 'When a button or link has only an icon, give it a name with aria-label, so a screen reader says "Search" instead of nothing.',
          },
          { type: 'code', code: '<button aria-label="Search">🔍</button>' },
          { type: 'tip', text: 'Try using your page with only the Tab key. Can you reach every link and button?' },
        ],
        task: 'This page has 4 accessibility problems: an image without alt, an input without a label, an icon button without a name, and a heading that skips from h1 to h4. Fix all four.',
        starterCode:
          '<h1>Weather</h1>\n<img src="https://picsum.photos/300/150">\n\n<h4>Search a city</h4>\n<input id="city" type="text">\n<button>🔍</button>\n',
        checks: [
          { label: 'The image has alt text', test: hasAttr('img', 'alt') },
          { label: 'The input has a label', test: labelled },
          { label: 'The icon button has an aria-label', test: hasAttr('button', 'aria-label') },
          { label: 'No heading level is skipped after <h1>', test: (d) => !d.querySelector('h4, h5, h6') || !!d.querySelector('h2') },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which element should hold the main content of the page?',
        options: ['<section>', '<div id="main">', '<main>', '<body>'],
        answer: 2,
        explain: '<main> marks the main content. Use it once per page.',
      },
      {
        q: 'Which is right for a blog post that makes sense on its own?',
        options: ['<aside>', '<article>', '<nav>', '<span>'],
        answer: 1,
        explain: '<article> is for self-contained content like posts, cards and comments.',
      },
      {
        q: 'What is the difference between class and id?',
        options: ['No difference', 'id is unique, class can be shared by many elements', 'class is unique, id can be shared', 'id is only for CSS'],
        answer: 1,
        explain: 'An id must be unique on the page. Many elements can share a class.',
      },
      {
        q: 'A button shows only "✕". How do you give it a name for screen readers?',
        options: ['title="close"', 'aria-label="Close"', 'alt="Close"', 'name="close"'],
        answer: 1,
        explain: 'aria-label gives an accessible name to elements with no readable text.',
      },
    ],
    project: {
      title: 'Give your site a professional structure',
      brief: 'Reorganize your site the way professionals do. Wrap the top in <header> with a navigation menu, put your content in <main> with a <section> for each part, and end with a <footer>.',
      tips: [
        'Sections: about, skills and contact, each with an id the menu links to.',
        'Your footer can have "© 2026 Your Name".',
      ],
      requirements: [
        { label: 'A <header> containing your <h1>', test: has('header h1') },
        { label: 'A <nav> with at least 3 links', test: count('nav a', 3) },
        { label: 'Every menu link jumps to a section on the page', test: (d) => { const l = [...d.querySelectorAll('nav a[href^="#"]')]; return l.length >= 3 && l.every((a) => d.getElementById(a.getAttribute('href')!.slice(1))) } },
        { label: 'A <main> with at least 3 <section>s', test: count('main section', 3) },
        { label: 'A <footer>', test: hasText('footer') },
      ],
    },
  },

  /* ---------------------------------------------------------------- 8 */
  {
    id: 'media-meta',
    title: 'Media and going live',
    summary: 'Video, audio and embeds, plus everything a page needs before you publish it.',
    lessons: [
      {
        id: 'video-audio',
        title: 'Video and audio',
        minutes: 6,
        content: [
          { type: 'text', text: '<video> and <audio> play media right in the page. The controls attribute shows play, pause and volume buttons.' },
          {
            type: 'code',
            code: '<video controls width="400" poster="cover.jpg">\n  <source src="intro.mp4" type="video/mp4">\n  Your browser does not support video.\n</video>\n\n<audio controls>\n  <source src="song.mp3" type="audio/mpeg">\n</audio>',
          },
          { type: 'text', text: '<source> lets you offer several formats; the browser picks the first one it can play. The text inside shows only in very old browsers.' },
          { type: 'tip', text: 'Avoid autoplay with sound. It annoys users, and most browsers block it anyway.' },
        ],
        task: 'Add a <video> with controls and a <source>, and an <audio> with controls. You can use https://www.w3schools.com/html/mov_bbb.mp4 for the video.',
        starterCode: '<h2>Media</h2>\n',
        checks: [
          { label: 'A <video> with controls', test: has('video[controls]') },
          { label: 'The video has a <source>', test: has('video source[src]') },
          { label: 'An <audio> with controls', test: has('audio[controls]') },
        ],
      },
      {
        id: 'iframes',
        title: 'Embedding YouTube and maps',
        minutes: 5,
        content: [
          { type: 'text', text: '<iframe> shows another web page inside yours. It is how you embed YouTube videos, Google Maps and more.' },
          { type: 'code', code: '<iframe\n  src="https://www.youtube.com/embed/dQw4w9WgXcQ"\n  title="Intro video"\n  width="400" height="225"\n  loading="lazy"\n  allowfullscreen>\n</iframe>' },
          { type: 'text', text: 'Always give an iframe a title for screen readers. loading="lazy" waits to load it until the visitor scrolls near it.' },
          { type: 'tip', text: 'On YouTube, click Share → Embed to copy a ready-made iframe.' },
        ],
        task: 'Embed a YouTube video or a map with an <iframe> that has a title and loading="lazy".',
        starterCode: '<h2>Watch this</h2>\n',
        checks: [
          { label: 'An <iframe> with a src', test: hasAttr('iframe', 'src') },
          { label: 'The iframe has a title', test: hasAttr('iframe', 'title') },
          { label: 'It uses loading="lazy"', test: has('iframe[loading="lazy"]') },
        ],
      },
      {
        id: 'seo-meta',
        title: 'Meta tags for search and sharing',
        minutes: 6,
        content: [
          { type: 'text', text: 'The meta description is the short text under your title in Google results. Write it like an ad for your page.' },
          { type: 'code', code: '<meta name="description" content="Aziz, a web developer from Tashkent. See my projects and get in touch.">' },
          {
            type: 'text',
            text: 'Open Graph tags control the preview card when your link is shared on Telegram, LinkedIn or X: the title, description and image.',
          },
          {
            type: 'code',
            code: '<meta property="og:title" content="Aziz — Web Developer">\n<meta property="og:description" content="My projects and contacts.">\n<meta property="og:image" content="https://example.com/preview.jpg">\n<link rel="icon" href="favicon.png">',
          },
        ],
        task: 'Add a meta description, og:title and og:description, and a favicon link to the head of this page.',
        starterCode:
          '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>Coffee Corner</title>\n\n  </head>\n  <body>\n    <h1>Coffee Corner</h1>\n  </body>\n</html>\n',
        checks: [
          { label: 'A meta description (20+ characters)', test: (d) => (d.querySelector('meta[name="description"]')?.getAttribute('content') ?? '').length >= 20 },
          { label: 'An og:title tag', test: hasAttr('meta[property="og:title"]', 'content') },
          { label: 'An og:description tag', test: hasAttr('meta[property="og:description"]', 'content') },
          { label: 'A favicon <link rel="icon">', test: has('link[rel~="icon"]') },
        ],
      },
      {
        id: 'validate',
        title: 'Finding mistakes before you publish',
        minutes: 6,
        kind: 'fix',
        content: [
          {
            type: 'text',
            text: 'Browsers try hard to show broken HTML, so mistakes hide. Before publishing, check your page with the free validator at validator.w3.org. The most common mistakes:',
          },
          {
            type: 'text',
            text: '1) Unclosed tags. 2) The same id used twice. 3) Missing alt text. 4) Block elements inside inline ones. 5) Attribute quotes that do not match.',
          },
          { type: 'tip', text: 'Publishing is just putting your files on a server. GitHub Pages and Netlify host simple sites for free.' },
        ],
        task: 'This page has 4 bugs: a duplicate id, a missing alt, an unclosed <strong>, and a link with mismatched quotes. Fix them all.',
        starterCode:
          '<h1 id="top">My page</h1>\n<p id="top">I am <strong>learning HTML.</p>\n<img src="https://picsum.photos/200">\n<a href="#top\'>Back to top</a>\n',
        checks: [
          { label: 'No duplicate ids', test: (d) => { const ids = [...d.querySelectorAll('[id]')].map((e) => e.id); return new Set(ids).size === ids.length } },
          { label: 'The image has alt text', test: hasAttr('img', 'alt') },
          { label: '<strong> is closed inside the paragraph', test: codeMatches(/<strong>[^<]*<\/strong>/i) },
          { label: 'The link goes to #top', test: has('a[href="#top"]') },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which attribute shows play and pause buttons on a video?',
        options: ['play', 'buttons', 'controls', 'autoplay'],
        answer: 2,
        explain: 'controls shows the browser\'s built-in media controls.',
      },
      {
        q: 'What is an <iframe> for?',
        options: ['Framing images with a border', 'Showing another web page inside yours', 'Making a table', 'Loading CSS'],
        answer: 1,
        explain: 'iframes embed other pages, like YouTube players and maps.',
      },
      {
        q: 'Where does the meta description show up?',
        options: ['At the top of your page', 'Under your title in search results', 'In the browser tab', 'Nowhere'],
        answer: 1,
        explain: 'Search engines often show it as the snippet under your page title.',
      },
      {
        q: 'What do og: (Open Graph) tags control?',
        options: ['Page speed', 'The preview card when your link is shared', 'Fonts', 'Form validation'],
        answer: 1,
        explain: 'Telegram, LinkedIn, X and others read og: tags to build link previews.',
      },
    ],
    project: {
      title: 'Get your site ready to publish',
      brief: 'Finish the HTML version of your website. Add a meta description and sharing tags so it looks great in search and on Telegram, and embed a video or map that says something about you.',
      tips: ['Embed a video you made, a talk you liked, or a map of your city.', 'Your HTML site is complete after this. Next, the CSS course makes it beautiful!'],
      requirements: [
        { label: 'A meta description (20+ characters)', test: (d) => (d.querySelector('meta[name="description"]')?.getAttribute('content') ?? '').length >= 20 },
        { label: 'An og:title tag', test: hasAttr('meta[property="og:title"]', 'content') },
        { label: 'An og:description tag', test: hasAttr('meta[property="og:description"]', 'content') },
        { label: 'An embedded <iframe> or <video>', test: has('iframe[src], video') },
        { label: 'The embed has a title or controls', test: (d) => !!d.querySelector('iframe[title], video[controls]') },
        { label: 'No duplicate ids', test: (d) => { const ids = [...d.querySelectorAll('[id]')].map((e) => e.id); return new Set(ids).size === ids.length } },
      ],
    },
  },
]
