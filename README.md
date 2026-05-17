# Your AI Focus Group

Test your product ideas, brand concepts, and pitches against AI-generated synthetic personas — in seconds, for free.

<!-- Add demo video/GIF here once ready -->
<!-- Example: [![Demo](public/your-ai-focus-group-mockup.png)](https://your-youtube-link) -->

---

## What It Does

You describe what you want to test. The tool generates 10 diverse synthetic personas based on your context, you pick 3–5 to form your focus group, then ask them up to 5 questions. Each persona responds individually and gets Likert-scored (1–5). At the end, you get a synthesized scorecard showing consensus, disagreement, and key insights.

Based on the follow-up Likert rating (FLR) method from a 2025 PyMC Labs / Colgate-Palmolive research paper showing LLM-generated synthetic consumer responses can match human surveys with up to 90% accuracy across 9,300 participants.

## How It Works

1. **Describe** — Enter your product, idea, tagline, or pitch
2. **Choose your panel** — Pick 3–5 personas from 10 AI-generated profiles
3. **Ask questions** — Each persona responds one at a time and gets scored
4. **Get results** — A scorecard with synthesis, consensus score, and key insights
5. **Share** — Copy your full transcript as plain text

## Run It Yourself

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- A free [Google Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/your-ai-focus-group.git
cd your-ai-focus-group

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.example .env.local
# Open .env.local and paste your Gemini API key

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key — get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash
- **State**: React `useReducer`

> See [PROJECT.md](PROJECT.md) for the full technical breakdown including architecture decisions, component docs, and version constraints.

## License

MIT — free to use, fork, and build on.
