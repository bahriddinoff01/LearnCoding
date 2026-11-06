import { codeMatches, count, has, hasAttr, hasText } from '../checks'
import type { Section } from '../types'

export const htmlPart1: Section[] = [
  /* ---------------------------------------------------------------- 1 */
  {
    id: 'first-page',
    title: 'Your first page',
    summary: 'Write real HTML in the first minute: headings, paragraphs and how tags work.',
    lessons: [
      {
        id: 'hello-html',
        title: 'Hello, HTML',
        minutes: 4,
        content: [
          {
            type: 'text',
            text: 'HTML (HyperText Markup Language) describes what is on a web page. You wrap content in tags, and the browser decides how to show it. Type this and watch it appear on the right:',
          },
          { type: 'code', code: '<h1>Hello, world!</h1>' },
          { type: 'text', text: '<h1> is the opening tag, </h1> is the closing tag, and everything between them is the content. Together they make an element.' },
          { type: 'tip', text: 'Right-click any website and choose "View page source". It is all HTML like this!' },
        ],
        task: 'Write an <h1> heading that says hello to the world (or to anyone you like).',
        starterCode: '',
        checks: [
          { label: 'Page has an <h1> heading', test: has('h1') },
          { label: 'The heading has text inside', test: hasText('h1') },
        ],
      },
      {
        id: 'headings',
        title: 'Six levels of headings',
        minutes: 5,
        content: [
          { type: 'text', text: 'HTML has six heading levels, from <h1> (most important) to <h6> (least important). They work like titles and subtitles in a book.' },
          { type: 'code', code: '<h1>My Travel Blog</h1>\n<h2>Japan</h2>\n<h3>Tokyo</h3>\n<h3>Kyoto</h3>\n<h2>Italy</h2>' },
          { type: 'text', text: 'Pick a heading level by importance, not by size. You will change how big they look later with CSS.' },
          { type: 'tip', text: 'Use one <h1> per page. Search engines and screen readers use it to understand what the page is about.' },
        ],
        task: 'Build an outline for a recipe page: one <h1> with the dish name, and two <h2> headings ("Ingredients" and "Steps").',
        starterCode: '',
        checks: [
          { label: 'Exactly one <h1>', test: (d) => d.querySelectorAll('h1').length === 1 },
          { label: 'At least two <h2> headings', test: count('h2', 2) },
          { label: 'All headings have text', test: (d) => [...d.querySelectorAll('h1,h2')].every((h) => h.textContent!.trim()) },
        ],
      },
      {
        id: 'paragraphs',
        title: 'Paragraphs and whitespace',
        minutes: 5,
        content: [
          { type: 'text', text: 'Text goes inside <p> paragraphs. Each paragraph starts on a new line with space around it.' },
          { type: 'code', code: '<p>This is the first paragraph.</p>\n<p>This is the second one.</p>' },
          {
            type: 'text',
            text: 'Browsers collapse whitespace: extra spaces and line breaks in your code become a single space on the page. To make a new paragraph, you need a new <p>, not more Enter presses.',
          },
          { type: 'tip', text: 'Write code on separate lines with indentation. It makes HTML easier to read, and the browser ignores it anyway.' },
        ],
        task: 'Write a heading and two paragraphs about your favorite hobby.',
        starterCode: '',
        checks: [
          { label: 'Page has a heading', test: has('h1, h2') },
          { label: 'At least two paragraphs', test: count('p', 2) },
          { label: 'Paragraphs have text', test: (d) => [...d.querySelectorAll('p')].filter((p) => p.textContent!.trim()).length >= 2 },
        ],
      },
      {
        id: 'nesting',
        title: 'Nesting and closing tags',
        minutes: 5,
        kind: 'fix',
        content: [
          { type: 'text', text: 'Elements can go inside other elements. This is called nesting. The rule: close tags in the reverse order you opened them, like boxes inside boxes.' },
          { type: 'code', code: '<!-- Correct -->\n<p>I <em>really</em> like HTML.</p>\n\n<!-- Wrong: tags cross each other -->\n<p>I <em>really</p></em>' },
          { type: 'text', text: 'Text between <!-- and --> is a comment. The browser ignores it, so you can leave notes for yourself.' },
          { type: 'tip', text: 'A missing closing tag can break everything after it. When a page looks strange, check your closing tags first.' },
        ],
        task: 'This code has two bugs: a heading that is never closed, and tags that cross each other. Fix them so the page shows a heading and a paragraph.',
        starterCode: '<!-- Fix the bugs below -->\n<h1>Why I love coding\n<p>Because I can <em>build anything</p></em>\n',
        checks: [
          { label: 'The <h1> is closed (it has only its own text)', test: (d) => !!d.querySelector('h1') && !d.querySelector('h1 p') },
          { label: 'The paragraph is not inside the heading', test: (d) => !!d.querySelector('body > p') },
          { label: '<em> is closed inside the paragraph', test: codeMatches(/<p>[^]*<em>[^]*<\/em>[^]*<\/p>/i) },
        ],
      },
    ],
    quiz: [
      {
        q: 'What does HTML describe?',
        options: ['How a page looks', 'What is on a page (its structure)', 'How a page behaves when clicked', 'Where a page is hosted'],
        answer: 1,
        explain: 'HTML describes structure and content. CSS handles looks, and JavaScript handles behavior.',
      },
      {
        q: 'Which heading is the most important?',
        options: ['<h6>', '<head>', '<h1>', '<header>'],
        answer: 2,
        explain: '<h1> is the top-level heading. <head> and <header> are different elements you will meet later.',
      },
      {
        q: 'What will the browser show?',
        code: '<p>Hello      world</p>',
        options: ['Hello      world (with all the spaces)', 'Hello world', 'Helloworld', 'Nothing'],
        answer: 1,
        explain: 'Browsers collapse extra whitespace into a single space.',
      },
      {
        q: 'Which nesting is correct?',
        options: ['<p><em>Hi</p></em>', '<p><em>Hi</em></p>', '<em><p>Hi</em></p>', '<p>Hi<em></p>'],
        answer: 1,
        explain: 'Close tags in reverse order: the last one opened (<em>) closes first.',
      },
    ],
    project: {
      title: 'Start your website',
      brief: 'This is the first page of your own website. Over the next sections you will keep adding to it, and in the CSS course you will make it beautiful. Start simple: the name of your site and a short intro.',
      tips: ['The <h1> is the name of your site: your name, your café, your blog…', 'The intro says in one or two sentences what visitors will find here.'],
      requirements: [
        { label: 'An <h1> with the name of your site', test: hasText('h1') },
        { label: 'An intro paragraph', test: hasText('p') },
        { label: 'The intro is at least 10 words', test: (d) => (d.querySelector('p')?.textContent ?? '').trim().split(/\s+/).length >= 10 },
      ],
    },
  },

  /* ---------------------------------------------------------------- 2 */
  {
    id: 'skeleton',
    title: 'The page skeleton',
    summary: 'Every real web page has the same skeleton. Learn why each part matters.',
    lessons: [
      {
        id: 'doctype-structure',
        title: 'The HTML skeleton',
        minutes: 6,
        content: [
          { type: 'text', text: 'So far the browser has been filling in the gaps for you. A real page has a fixed structure:' },
          {
            type: 'code',
            code: '<!DOCTYPE html>\n<html>\n  <head>\n    <!-- information ABOUT the page -->\n  </head>\n  <body>\n    <!-- what you SEE on the page -->\n  </body>\n</html>',
          },
          {
            type: 'text',
            text: '<!DOCTYPE html> tells the browser to use modern HTML. <html> wraps everything. <head> holds settings and information that are not shown. <body> holds everything visible.',
          },
          { type: 'tip', text: 'Without the doctype, browsers switch to an old "quirks mode" and layouts can break in strange ways.' },
        ],
        task: 'Write the full skeleton: doctype, <html>, <head> and <body>. Put an <h1> inside the body.',
        starterCode: '',
        checks: [
          { label: 'Starts with <!DOCTYPE html>', test: codeMatches(/^\s*<!doctype html>/i) },
          { label: 'Has <head> and <body> inside <html>', test: codeMatches(/<html[^>]*>[^]*<head>[^]*<\/head>[^]*<body>[^]*<\/body>[^]*<\/html>/i) },
          { label: 'The <h1> is inside the body', test: has('body h1') },
        ],
      },
      {
        id: 'title-tag',
        title: 'The page title',
        minutes: 4,
        content: [
          { type: 'text', text: 'The <title> goes in the <head>. It is not shown on the page. It appears in the browser tab, in bookmarks and as the headline in search results.' },
          { type: 'code', code: '<head>\n  <title>Aziz — Web Developer</title>\n</head>' },
          { type: 'tip', text: 'Keep titles short (under 60 characters) and descriptive. "Home" is a bad title, "Aziz — Web Developer" is a good one.' },
        ],
        task: 'Add a descriptive <title> to the head of this page.',
        starterCode: '<!DOCTYPE html>\n<html>\n  <head>\n\n  </head>\n  <body>\n    <h1>My Coffee Shop</h1>\n  </body>\n</html>\n',
        checks: [
          { label: 'The page has a <title>', test: has('head title') },
          { label: 'The title is at least 3 characters', test: (d) => d.title.trim().length >= 3 },
        ],
      },
      {
        id: 'charset',
        title: 'Why emojis turn into garbage',
        minutes: 5,
        kind: 'fix',
        content: [
          {
            type: 'text',
            text: 'Computers store text as numbers. The character set says how to turn those numbers back into letters. Without it, some browsers show "Ã©" instead of "é" and strange symbols instead of emojis.',
          },
          { type: 'code', code: '<head>\n  <meta charset="UTF-8">\n</head>' },
          { type: 'text', text: 'UTF-8 covers every language and every emoji. Put this line first inside <head> on every page you make.' },
          { type: 'tip', text: '<meta> has no closing tag. Elements like this are called void (or empty) elements.' },
        ],
        task: 'This page has no character set, so its Uzbek, Russian and emoji text could break. Add the UTF-8 meta tag as the first thing in <head>.',
        starterCode:
          '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Salom! Привет! 👋</title>\n  </head>\n  <body>\n    <h1>Salom, dunyo! 🌍</h1>\n    <p>Привет, мир! Café ☕</p>\n  </body>\n</html>\n',
        checks: [
          { label: 'Has <meta charset="UTF-8">', test: codeMatches(/<meta\s+charset=["']?utf-8["']?\s*\/?>/i) },
          { label: 'It comes before the <title>', test: codeMatches(/<meta\s+charset[^>]*>[^]*<title>/i) },
        ],
      },
      {
        id: 'viewport-lang',
        title: 'Phones and languages',
        minutes: 5,
        content: [
          {
            type: 'text',
            text: 'Without the viewport tag, phones pretend to be a wide desktop screen and shrink your page until the text is tiny. This line tells them to use their real width:',
          },
          { type: 'code', code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
          {
            type: 'text',
            text: 'The lang attribute on <html> says which language the page is in. Screen readers use it to pronounce words correctly, and browsers use it to offer translation.',
          },
          { type: 'code', code: '<html lang="en">   <!-- English -->\n<html lang="uz">   <!-- Uzbek -->' },
          { type: 'tip', text: 'charset + viewport + title + lang: these four go in every page you ever build.' },
        ],
        task: 'Complete this skeleton: add lang to <html>, and add the viewport meta tag to the head.',
        starterCode:
          '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8">\n    <title>My page</title>\n  </head>\n  <body>\n    <h1>Works on phones too</h1>\n  </body>\n</html>\n',
        checks: [
          { label: '<html> has a lang attribute', test: (d) => !!d.documentElement.getAttribute('lang')?.trim() },
          { label: 'Has the viewport meta tag', test: has('meta[name="viewport"]') },
          { label: 'Viewport uses width=device-width', test: (d) => /width=device-width/.test(d.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? '') },
        ],
      },
    ],
    quiz: [
      {
        q: 'Where does visible content go?',
        options: ['<head>', '<body>', '<title>', '<meta>'],
        answer: 1,
        explain: 'Everything you see is in <body>. <head> holds information about the page.',
      },
      {
        q: 'Where does the <title> text appear?',
        options: ['At the top of the page as a big heading', 'In the browser tab and search results', 'In the footer', 'Nowhere'],
        answer: 1,
        explain: 'The title shows in the tab, bookmarks and search results, not on the page itself.',
      },
      {
        q: 'What does <meta charset="UTF-8"> fix?',
        options: ['Slow loading', 'Broken letters and emojis', 'Missing images', 'Small text on phones'],
        answer: 1,
        explain: 'It tells the browser how to read the characters, so all languages and emojis show correctly.',
      },
      {
        q: 'Which tag makes a page display properly on phones?',
        options: ['<meta name="viewport" ...>', '<meta charset="UTF-8">', '<html lang="en">', '<!DOCTYPE html>'],
        answer: 0,
        explain: 'The viewport meta tag tells phones to use their real screen width.',
      },
    ],
    project: {
      title: 'Give your site a real skeleton',
      brief: 'Turn your page into a proper HTML document. Wrap your heading and intro in the full skeleton, and add the four things every page needs.',
      tips: ['Keep your <h1> and intro, just move them inside <body>.', 'Make the title the site name plus a short tagline, like "Brew & Bean — Coffee in Tashkent".'],
      requirements: [
        { label: 'Starts with <!DOCTYPE html>', test: codeMatches(/^\s*<!doctype html>/i) },
        { label: '<html> has a lang attribute', test: (d) => !!d.documentElement.getAttribute('lang')?.trim() },
        { label: 'Has <meta charset="UTF-8">', test: codeMatches(/<meta\s+charset=["']?utf-8/i) },
        { label: 'Has the viewport meta tag', test: has('meta[name="viewport"]') },
        { label: 'Has a descriptive <title>', test: (d) => d.title.trim().length >= 3 },
        { label: 'Your <h1> and intro are inside <body>', test: (d) => !!d.querySelector('body h1') && !!d.querySelector('body p') },
      ],
    },
  },

  /* ---------------------------------------------------------------- 3 */
  {
    id: 'text',
    title: 'Text that means something',
    summary: 'Emphasis, quotes, code, special characters, and how block and inline elements differ.',
    lessons: [
      {
        id: 'strong-em',
        title: 'Strong and emphasis',
        minutes: 5,
        content: [
          { type: 'text', text: '<strong> marks something important (shown bold). <em> adds emphasis, like stressing a word when you speak (shown italic).' },
          { type: 'code', code: '<p><strong>Warning:</strong> the oven is <em>very</em> hot.</p>\n<p>Use <mark>highlight</mark> for search matches.</p>' },
          {
            type: 'text',
            text: '<b> and <i> also make text bold and italic, but only visually. Prefer <strong> and <em>: they also tell screen readers and search engines the text matters.',
          },
          { type: 'tip', text: '<mark> highlights text, <small> is for fine print like copyright notes.' },
        ],
        task: 'Write a paragraph with one important phrase in <strong> and one stressed word in <em>.',
        starterCode: '<h2>Safety rules</h2>\n',
        checks: [
          { label: 'Has a paragraph', test: hasText('p') },
          { label: 'Uses <strong> inside the paragraph', test: hasText('p strong') },
          { label: 'Uses <em> inside the paragraph', test: hasText('p em') },
        ],
      },
      {
        id: 'breaks-quotes',
        title: 'Line breaks, lines and quotes',
        minutes: 6,
        content: [
          { type: 'text', text: '<br> forces a line break inside a paragraph (great for addresses and poems). <hr> draws a line to separate topics. Both are void elements with no closing tag.' },
          { type: 'code', code: '<p>Amir Temur Street 1<br>Tashkent<br>Uzbekistan</p>\n<hr>' },
          { type: 'text', text: 'Long quotes use <blockquote>. Short quotes inside a sentence use <q>, which adds quote marks for you. <cite> names the source.' },
          {
            type: 'code',
            code: '<blockquote>\n  The best way to learn is to build.\n</blockquote>\n<p>As my teacher said, <q>practice beats theory</q>.</p>\n<p>— <cite>LearnCoding</cite></p>',
          },
          { type: 'tip', text: "Don't use <br> to make space between paragraphs. Use separate <p> elements instead." },
        ],
        task: 'Write an address with <br> line breaks, then an <hr>, then a <blockquote> with your favorite quote.',
        starterCode: '<h2>Contact</h2>\n',
        checks: [
          { label: 'Uses at least two <br> tags', test: count('br', 2) },
          { label: 'Has an <hr>', test: has('hr') },
          { label: 'Has a <blockquote> with text', test: hasText('blockquote') },
        ],
      },
      {
        id: 'code-entities',
        title: 'Code and special characters',
        minutes: 6,
        content: [
          { type: 'text', text: '<code> shows a piece of code inline. <pre> keeps spaces and line breaks exactly as you typed them.' },
          { type: 'code', code: '<p>Use the <code>&lt;h1&gt;</code> tag for titles.</p>' },
          {
            type: 'text',
            text: 'Wait, why &lt; and &gt;? Because < starts a tag! To show special characters, use entities: &lt; for <, &gt; for >, &amp; for &, &copy; for ©, and &nbsp; for a space that never breaks.',
          },
          { type: 'tip', text: 'Every entity starts with & and ends with a semicolon.' },
        ],
        task: 'Write a paragraph that shows the text "<p>" on the page using <code> and entities, and add a copyright line with &copy;.',
        starterCode: '<h2>HTML cheat sheet</h2>\n',
        checks: [
          { label: 'Uses a <code> element', test: has('code') },
          { label: 'The page shows the text "<p>"', test: (d) => (d.body.textContent ?? '').includes('<p>') },
          { label: 'Shows a © symbol', test: (d) => (d.body.textContent ?? '').includes('©') },
        ],
      },
      {
        id: 'block-inline',
        title: 'Block vs inline elements',
        minutes: 5,
        content: [
          {
            type: 'text',
            text: 'Block elements start on a new line and take the full width: <h1>, <p>, <blockquote>, <hr>. Inline elements sit inside a line of text: <strong>, <em>, <code>, <a>.',
          },
          { type: 'code', code: '<p>This <strong>stays</strong> on the same line.</p>\n<p>This starts a new line.</p>' },
          { type: 'text', text: 'The rule of thumb: inline elements go inside block elements, not the other way around. Never put a <p> inside a <strong>.' },
          { type: 'tip', text: 'You will control this yourself in CSS with the display property.' },
        ],
        task: 'Write a heading and two paragraphs. Inside the paragraphs, use at least three different inline elements (for example <strong>, <em>, <code>, <mark>).',
        starterCode: '',
        checks: [
          { label: 'Has a heading and two paragraphs', test: (d) => !!d.querySelector('h1,h2,h3') && d.querySelectorAll('p').length >= 2 },
          {
            label: 'Uses 3 different inline elements inside paragraphs',
            test: (d) => new Set([...d.querySelectorAll('p *')].map((e) => e.tagName)).size >= 3,
          },
          { label: 'No paragraph inside an inline element', test: (d) => !d.querySelector('strong p, em p, code p, mark p, span p') },
        ],
      },
    ],
    quiz: [
      {
        q: 'Why prefer <strong> over <b>?',
        options: ['It is bolder', 'It also tells screen readers the text is important', 'It loads faster', '<b> no longer works'],
        answer: 1,
        explain: '<strong> carries meaning, not just looks. Screen readers and search engines understand it.',
      },
      {
        q: 'How do you show a "<" character on the page?',
        options: ['<', '&lt;', '\\<', '<lt>'],
        answer: 1,
        explain: '&lt; is the entity for "less than". A plain < would start a tag.',
      },
      {
        q: 'Which element is inline?',
        options: ['<p>', '<h2>', '<em>', '<blockquote>'],
        answer: 2,
        explain: '<em> sits inside a line of text. The others are block elements.',
      },
      {
        q: 'When should you use <br>?',
        options: ['To add space between paragraphs', 'For line breaks inside an address or poem', 'To end every line of code', 'Never'],
        answer: 1,
        explain: '<br> is for line breaks that are part of the content. Spacing between paragraphs comes from separate <p> elements and CSS.',
      },
    ],
    project: {
      title: 'Tell your story',
      brief: 'Tell visitors more. Add a new part under your intro (an About section, the story behind your project, or a first post) using what you learned about meaningful text.',
      tips: ['Use <strong> for the most important sentence.', 'A quote in a <blockquote> adds personality: a motto, a review, or a favorite saying.'],
      requirements: [
        { label: 'An <h2> heading (for example "About me")', test: hasText('h2') },
        { label: 'At least 2 more paragraphs (3 in total)', test: count('p', 3) },
        { label: 'Uses <strong> somewhere', test: hasText('strong') },
        { label: 'Uses <em> somewhere', test: hasText('em') },
        { label: 'Has a <blockquote>', test: hasText('blockquote') },
      ],
    },
  },

  /* ---------------------------------------------------------------- 4 */
  {
    id: 'links-images',
    title: 'Links and images',
    summary: 'Connect pages together, link to email and sections, and add images the right way.',
    lessons: [
      {
        id: 'links',
        title: 'Your first link',
        minutes: 5,
        content: [
          { type: 'text', text: 'Links are what make the web a web. They use the <a> (anchor) tag, and the href attribute says where the link goes.' },
          { type: 'code', code: '<a href="https://developer.mozilla.org">Learn on MDN</a>' },
          { type: 'text', text: 'An attribute is extra information inside the opening tag: name="value". The text between the tags is what people click.' },
          { type: 'tip', text: 'Write link text that makes sense on its own. "Read the HTML guide" beats "click here".' },
        ],
        task: 'Add two links to websites you like, each with descriptive link text.',
        starterCode: '<h2>My favorite sites</h2>\n',
        checks: [
          { label: 'At least two links with an href', test: count('a[href]:not([href=""])', 2) },
          { label: 'Every link has text', test: (d) => [...d.querySelectorAll('a')].every((a) => a.textContent!.trim()) },
          { label: 'No "click here" link text', test: (d) => ![...d.querySelectorAll('a')].some((a) => /click here/i.test(a.textContent!)) },
        ],
      },
      {
        id: 'paths-targets',
        title: 'Paths and new tabs',
        minutes: 6,
        content: [
          { type: 'text', text: 'An absolute URL is a full address: https://example.com/about. A relative path points to a file on your own site, starting from the current page:' },
          { type: 'code', code: '<a href="about.html">About</a>          <!-- same folder -->\n<a href="blog/post.html">Post</a>     <!-- inside a folder -->\n<a href="../index.html">Home</a>      <!-- one folder up -->' },
          { type: 'text', text: 'target="_blank" opens a link in a new tab. Add rel="noopener" for safety, so the new page cannot control yours.' },
          { type: 'code', code: '<a href="https://github.com" target="_blank" rel="noopener">GitHub</a>' },
        ],
        task: 'Add a relative link to "projects.html", and an external link that opens in a new tab safely.',
        starterCode: '<h2>Menu</h2>\n',
        checks: [
          { label: 'A link to projects.html', test: has('a[href="projects.html"], a[href="./projects.html"]') },
          { label: 'An external https:// link', test: has('a[href^="https://"]') },
          { label: 'The external link opens in a new tab', test: has('a[href^="https://"][target="_blank"]') },
          { label: 'It has rel="noopener"', test: has('a[target="_blank"][rel~="noopener"]') },
        ],
      },
      {
        id: 'mail-anchors',
        title: 'Email links and jump links',
        minutes: 5,
        content: [
          { type: 'text', text: 'Links can do more than open pages. mailto: opens an email app, tel: starts a phone call on mobile.' },
          { type: 'code', code: '<a href="mailto:hello@example.com">Email me</a>\n<a href="tel:+998901234567">Call me</a>' },
          { type: 'text', text: 'Give any element an id, and you can link straight to it with #. This is how "Back to top" and table-of-contents links work.' },
          { type: 'code', code: '<a href="#contact">Go to contact</a>\n...\n<h2 id="contact">Contact</h2>' },
          { type: 'tip', text: 'Each id must be unique on the page. No two elements can share one.' },
        ],
        task: 'Make a link that jumps to a heading with id="contact", and put a mailto: link under that heading.',
        starterCode: '<a href="">Jump to contact</a>\n\n<p>Lots of content here...</p>\n\n<h2>Contact</h2>\n',
        checks: [
          { label: 'An element with id="contact"', test: has('#contact') },
          { label: 'A link to #contact', test: has('a[href="#contact"]') },
          { label: 'A mailto: link', test: has('a[href^="mailto:"]') },
        ],
      },
      {
        id: 'images',
        title: 'Images and alt text',
        minutes: 6,
        content: [
          { type: 'text', text: 'Images use the <img> tag. It has no closing tag. src is the image address, and alt describes the image for screen readers and when it fails to load.' },
          { type: 'code', code: '<img src="https://picsum.photos/300/200" alt="A mountain lake at sunrise" width="300" height="200">' },
          { type: 'text', text: 'Setting width and height lets the browser save space for the image before it loads, so the page does not jump around.' },
          { type: 'tip', text: 'Good alt text describes what matters: "Aziz smiling at his laptop", not "image" or "photo123.jpg".' },
        ],
        task: 'Add an image with a descriptive alt text, a width and a height. Use https://picsum.photos/400/250 if you need one.',
        starterCode: '<h2>My view</h2>\n',
        checks: [
          { label: 'An image with a src', test: hasAttr('img', 'src') },
          { label: 'The image has alt text (at least 2 words)', test: (d) => (d.querySelector('img')?.getAttribute('alt') ?? '').trim().split(/\s+/).length >= 2 },
          { label: 'It has width and height', test: has('img[width][height]') },
        ],
      },
      {
        id: 'figure',
        title: 'Figures and captions',
        minutes: 4,
        content: [
          { type: 'text', text: 'When an image needs a caption, wrap both in <figure> and put the caption in <figcaption>. This links them together for everyone, including screen readers.' },
          { type: 'code', code: '<figure>\n  <img src="https://picsum.photos/400/250" alt="Old town street at night">\n  <figcaption>Bukhara, summer 2025</figcaption>\n</figure>' },
          { type: 'tip', text: 'Images can be links too: put the <img> inside an <a>.' },
        ],
        task: 'Make a <figure> with an image (with alt text) and a <figcaption>.',
        starterCode: '<h2>Photo of the day</h2>\n',
        checks: [
          { label: 'Has a <figure>', test: has('figure') },
          { label: 'An image with alt text inside the figure', test: hasAttr('figure img', 'alt') },
          { label: 'A <figcaption> with text', test: hasText('figure figcaption') },
        ],
      },
    ],
    quiz: [
      {
        q: 'Which attribute sets where a link goes?',
        options: ['src', 'link', 'href', 'to'],
        answer: 2,
        explain: 'href (hypertext reference) holds the link address. src is for images and media.',
      },
      {
        q: 'What does href="#contact" do?',
        options: ['Opens a contact app', 'Jumps to the element with id="contact"', 'Sends an email', 'Nothing'],
        answer: 1,
        explain: 'A # link jumps to the element with that id on the page.',
      },
      {
        q: 'Why is alt text important?',
        options: ['It makes images load faster', 'Screen readers read it, and it shows if the image fails', 'It adds a caption under the image', 'It is required for the image to show'],
        answer: 1,
        explain: 'alt text describes the image for people who cannot see it, and appears when it fails to load.',
      },
      {
        q: 'Which path goes one folder up?',
        options: ['/index.html', './index.html', '../index.html', 'up/index.html'],
        answer: 2,
        explain: '../ means "the folder above this one".',
      },
      {
        q: 'Why add rel="noopener" to target="_blank" links?',
        options: ['To make them load faster', 'So the new page cannot control your page', 'To open them in the same tab', 'It is required for links to work'],
        answer: 1,
        explain: 'noopener stops the opened page from accessing the page that opened it.',
      },
    ],
    project: {
      title: 'Add images and links',
      brief: 'Bring your site to life with an image, and add links so visitors can find you elsewhere and get in touch.',
      tips: [
        'No image yet? Use https://picsum.photos/600/400 for a random photo.',
        'Link to your social pages (Instagram, Telegram, GitHub…). Open them in a new tab.',
      ],
      requirements: [
        { label: 'An image with descriptive alt text', test: (d) => (d.querySelector('img')?.getAttribute('alt') ?? '').trim().length >= 3 },
        { label: 'At least 2 external links', test: count('a[href^="http"]', 2) },
        { label: 'External links open in a new tab with rel="noopener"', test: (d) => [...d.querySelectorAll('a[href^="http"]')].every((a) => a.getAttribute('target') === '_blank' && /noopener/.test(a.getAttribute('rel') ?? '')) },
        { label: 'A mailto: link so people can email you', test: has('a[href^="mailto:"]') },
      ],
    },
  },
]
