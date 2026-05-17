# Open Source Launch Checklist

## 🔴 Security — Do These First

- [ ] **Rotate your Gemini API key** — Go to https://aistudio.google.com/apikey, delete the current one, create a new one, update `.env.local`. The `.env.local` file won't be committed (it's in `.gitignore`) but rotating before going public is clean practice.

- [ ] **Create a `.env.example` file** in the project root — This is what people who clone your repo will use as a template:
  ```
  GEMINI_API_KEY=your_gemini_api_key_here
  SYSTEME_IO_FORM_URL=optional_your_systeme_io_form_url
  ```

- [ ] **Delete or move personal/unrelated files** — These are in the project root and shouldn't be public:
  - `redditdetails.md` — personal research notes
  - `retro-travel-poster-DESIGN.md` — unrelated to the project
  - `next_debug.log` — debug log, delete it
  - `settings.json` (the one in the root, not `.claude/`) — shouldn't be there

- [ ] **Update `.gitignore`** to include:
  ```
  .claude/
  *.log
  redditdetails.md
  retro-travel-poster-DESIGN.md
  settings.json
  ```

---

## 🟡 Prepare Before Publishing

- [ ] **Write a README.md** — This is your storefront. People land on GitHub and see this first. A good README includes:
  - What the app does (1-2 sentences)
  - A screenshot or demo GIF at the top
  - How to run it locally (clone, install, set env vars, `npm run dev`)
  - List of required env vars (point to `.env.example`)
  - Tech stack (Next.js, Gemini API, Tailwind, TypeScript)

- [ ] **Pick a license** — Create a `LICENSE` file. Two options:
  - **MIT** — "Do whatever you want, just credit me." Most permissive, gets the most stars and forks. Good for visibility.
  - **AGPL-3.0** — If someone builds a product using your code, they must also open source it. Protects you from companies just taking it.
  - For a "GitHub popping" goal → go with **MIT**.

- [ ] **Record a demo GIF or short video** — People don't read, they watch. A 30-second screen recording of the full flow (input → loading → personas → session → results) embedded at the top of your README is what makes people star and fork instead of bouncing.

- [ ] **Add a `CONTRIBUTING.md`** (optional but nice) — Even one paragraph telling people how to report bugs or submit changes makes the project feel more legit.

---

## 🟢 GitHub Mechanics

- [ ] **Create the repo on GitHub**
  1. Go to github.com → click "New repository"
  2. Name it something clean: `ai-focus-group` or `synthetic-persona-generator`
  3. Set to **Public**
  4. Do NOT check "Initialize with README" — you'll push your own

- [ ] **Push your code** (this project isn't a git repo yet, so run all of these):
  ```bash
  git init
  git add .
  git commit -m "Initial release"
  git remote add origin https://github.com/YOURUSERNAME/REPONAME.git
  git push -u origin main
  ```

- [ ] **Add topics/tags on GitHub** after pushing — Go to the repo page → click the gear icon next to "About" → add tags like:
  `nextjs` `ai` `market-research` `gemini` `open-source` `typescript` `focus-group`
  This is how people discover repos.

---

## 🟢 Promotion

**Where to post:**
- **Reddit** — r/SideProject, r/webdev, r/artificial. Post with a demo GIF in the body, not just a link. Write a short paragraph about why you built it.
- **X/Twitter** — Short demo video performs best. Tag relevant AI/dev accounts.
- **Product Hunt** — Bigger launch, needs more prep (tagline, screenshots, description), but high visibility if it does well.
- **Hacker News** — "Show HN: Your AI Focus Group — test ideas with synthetic personas" format. Toughest crowd but highest upside if it lands.

**Tips:**
- Post on a Tuesday–Thursday morning for best engagement
- Respond to every comment in the first few hours
- The demo video/GIF is the single most important thing — invest time in making it look good

---

## Summary — Do This In Order

1. Rotate the Gemini API key
2. Delete the personal files (`redditdetails.md`, `retro-travel-poster-DESIGN.md`, `next_debug.log`, root `settings.json`)
3. Update `.gitignore`
4. Create `.env.example`
5. Write `README.md` with a demo GIF at the top
6. Add MIT `LICENSE` file
7. Create the GitHub repo (don't initialize it)
8. Run the git commands to push
9. Add topics/tags on GitHub
10. Post and promote
