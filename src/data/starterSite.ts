/**
 * A finished HTML personal site, offered to learners who skipped the HTML
 * course, so they can still do the CSS project steps.
 */
export const starterSiteHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Name — Personal Website</title>
    <meta name="description" content="Hi, I'm Your Name. I'm learning web development. See my skills and get in touch.">
    <meta property="og:title" content="Your Name — Personal Website">
    <meta property="og:description" content="My skills, projects and contacts.">
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header>
      <h1>Your Name</h1>
      <nav>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section id="about">
        <h2>About me</h2>
        <img src="https://i.pravatar.cc/200" alt="Portrait of me smiling" width="200" height="200">
        <p>Hi! I am learning web development and building this site step by step. I love making things people can use.</p>
        <p>Right now I am focused on <strong>HTML and CSS</strong>, and <em>JavaScript</em> is next.</p>
        <blockquote>The best way to learn is to build.</blockquote>
        <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=69.20,41.27,69.33,41.34" title="Map of my city" width="400" height="250" loading="lazy"></iframe>
        <p>
          <a href="https://github.com" target="_blank" rel="noopener">GitHub</a> ·
          <a href="https://t.me" target="_blank" rel="noopener">Telegram</a> ·
          <a href="mailto:me@example.com">Email me</a>
        </p>
      </section>

      <section id="skills">
        <h2>Skills</h2>
        <ul>
          <li>HTML</li>
          <li>CSS</li>
          <li>Git</li>
          <li>JavaScript (learning)</li>
        </ul>
        <table>
          <tr><th>Day</th><th>Topic</th></tr>
          <tr><td>Monday</td><td>HTML</td></tr>
          <tr><td>Wednesday</td><td>CSS</td></tr>
        </table>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <form>
          <label for="name">Name</label>
          <input id="name" name="name" type="text" required>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required>
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="4"></textarea>
          <button type="submit">Send</button>
        </form>
      </section>
    </main>

    <footer>
      <p>&copy; 2026 Your Name</p>
    </footer>
  </body>
</html>
`
