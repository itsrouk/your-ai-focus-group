# Your AI Focus Group

You have a product idea, a tagline, a pitch, or maybe something you just want feedback on. This tool spins up a panel of AI-generated personas, you interview them, and you walk away with a scorecard showing what landed, what didn't, and where your panel agreed or clashed. Takes a couple minutes. Costs nothing.

<img width="1429" height="746" alt="image" src="https://github.com/user-attachments/assets/c7af0c91-ef2c-4920-86ad-23e79628a985" />
<img width="1189" height="748" alt="image" src="https://github.com/user-attachments/assets/c88cbe6a-4721-4dc8-bfca-b9feecc05ead" />

---

## Why this exists

I spent almost 10 years working for some of the largest advertising agencies, and I can tell you: focus groups are expensive, complicated, and that's exactly why they're not a standard part of most people's marketing workflow. They should be — but they're not.

Towards the end of 2025, Colgate-Palmolive partnered with a lab called PyMC to run a test. They built synthetic AI personas, asked them a bunch of purchase-intent questions, and then measured the responses against 9,300 actual human surveys. The AI responses were **90% accurate** to the real thing.

Now I'm not going to sit here and tell you this tool is 90% accurate. But here's what I will tell you: even if it's only 55–60% accurate, that is a **game changer**. Because right now, most people reading this do zero focus groups. Going from nothing to a directional read in two minutes — for free — changes how you make decisions.

There's real science behind this. The method is called follow-up Likert rating (FLR), and having a methodology underneath it means you're not just asking ChatGPT for vibes.

## How it works

You land on the page and it asks: **what do you want to test?**

Type in your idea — a budgeting app for people in their 20s and 30s, a new tagline, a rebrand concept, whatever. Hit start.

Behind the scenes, the tool strips out brand-specific details to avoid biasing the results (it won't say "Nike shoe," it'll say "athletic running shoe" — so the personas evaluate the *category*, not the brand name). Then it generates **10 diverse synthetic personas** shaped around your context.

You pick 3–5 that fit your target. The rest gray out. Now you've got your panel.

Ask up to 5 open-ended questions — not "what's your favorite app," but things like "what problems have you had with budgeting apps in the past?" Each persona answers **one at a time**, thinking and responding sequentially. I set it up that way on purpose — it feels more like a real conversation and less like a batch job.

At the end, each response gets a Likert score (1–5), and you get a **scorecard** that surfaces:

- **What's working** — responses that landed well
- **What needs work** — where your panel pushed back or showed low interest
- **Consensus score** — how much your panel agreed or disagreed
- **Key insights** — the themes that kept coming up

You can copy the full transcript as plain text and share it anywhere. I've been using this myself and the personas genuinely say things I wasn't thinking about. It gets the gears turning.

## Run it yourself

You need two things:

- [Node.js](https://nodejs.org/) 18+
- A free [Google Gemini API key](https://aistudio.google.com/apikey) — takes 30 seconds

```bash
git clone https://github.com/itsrouk/your-ai-focus-group.git
cd your-ai-focus-group
npm install
cp .env.example .env.local   # then paste your Gemini API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start testing ideas.

### Environment variable

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Gemini 2.5 Flash**
- **React `useReducer`** for state — no external state library needed

Full architecture breakdown, component docs, and design decisions are in [PROJECT.md](PROJECT.md).

## What's next

This is the first of a pipeline of open-source marketing tools I'm building. If this is interesting to you, there's more coming — follow along or star the repo to stay in the loop.

## License

MIT. Use it, fork it, build on it.
