# Your AI Focus Group — Project Record

## Purpose
A free, single-page web tool that lets users test product ideas, brand concepts, or business pitches against AI-generated synthetic personas. Based on the follow-up Likert rating (FLR) method from a 2025 PyMC Labs / Colgate-Palmolive research paper showing LLM-generated synthetic consumer responses can match human surveys with up to 90% accuracy across 9,300 participants.

The user flow:
1. Describe what they want to test (product, idea, tagline, etc.)
2. AI extracts neutral context and generates 10 diverse synthetic personas
3. User selects 3–5 personas to form their focus group
4. User asks up to 5 questions; each persona responds sequentially, then gets Likert-scored
5. User clicks "Finish & See Summary" → synthesis runs across all rounds → scorecard appears
6. Results can be copied as plain text or emailed via systeme.io

---

## Tech Stack
- **Framework**: Next.js 14.2.35 (App Router, `app/` directory)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4 + CSS custom properties
- **AI**: Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` npm package
- **State**: React `useReducer` — single reducer in `app/page.tsx`, no external state library
- **Fonts**: DM Sans (body + headings, weight 400–800), JetBrains Mono (scores/numbers), DM Serif Display (imported but no longer used for primary headings)
- **Email capture**: systeme.io form POST via `/api/capture-email`

### Critical version constraints (do NOT upgrade without testing)
| Package | Version | Why pinned |
|---|---|---|
| `next` | 14.2.35 | App Router stable; v15 has breaking changes |
| `typescript` | 5.x | TypeScript 6 breaks Next.js 14 (CSS module type declarations fail) |
| `tailwindcss` | 3.x | Tailwind v4 moved PostCSS plugin to separate package; v3 works with existing `postcss.config.js` |
| `eslint` | 8.x | ESLint 9 dropped `useEslintrc` option; `eslint-config-next@14` requires v8 |
| `eslint-config-next` | 14.x | Must match Next.js major version |

---

## File Structure

```
/
├── app/
│   ├── globals.css          # Google Fonts import, all CSS custom properties, utility classes
│   ├── layout.tsx           # Root layout, metadata
│   ├── page.tsx             # Main orchestrator — useReducer state, all API fetch logic, render
│   └── api/
│       ├── extract-context/route.ts    # Step 1: parse user input → ExtractedContext
│       ├── generate-personas/route.ts  # Step 2: ExtractedContext → 10 Persona objects
│       ├── run-interview/route.ts      # Step 3: run one persona through one question
│       ├── score-response/route.ts     # Step 4: Likert score a single response (1–5)
│       ├── synthesize/route.ts         # Step 5: synthesize all scored responses → SynthesisResult
│       └── capture-email/route.ts      # Optional: POST email to systeme.io
├── components/
│   ├── HeroInput.tsx         # Landing page: own navbar, two-column hero, preview panel, feature strip, "How it works" modal
│   ├── BuildingFocusGroup.tsx # Loading screen during extract+persona generation (cycling messages)
│   ├── PersonaCard.tsx       # Single selectable persona card (teal checkmark badge when selected)
│   ├── PersonaSelector.tsx   # Grid of 10 PersonaCards with selection logic
│   ├── SessionPanel.tsx      # Two-column Q&A: response feed left, sticky sidebar right; mobile compact bar
│   ├── ResponseCard.tsx      # One persona's response + answered badge + thinking state + Likert badge
│   ├── Scorecard.tsx         # Results dashboard: colored score hero, horizontal distribution bars, side-by-side insights grid
│   ├── ShareButton.tsx       # Copy-to-clipboard button with multi-round transcript format
│   ├── EmailCapture.tsx      # Email input → /api/capture-email
│   ├── ProgressIndicator.tsx # Full-width sticky step navbar with circular icons (Describe → Choose Panel → Session → Results)
│   └── LoadingState.tsx      # Simple centered animated loading message
├── lib/
│   ├── types.ts              # All TypeScript interfaces
│   ├── gemini.ts             # callGemini() + parseJSON() utilities
│   ├── prompts.ts            # All 5 prompt pairs (system + builder functions)
│   └── rate-limit.ts         # Cookie-based rate limiting (3 runs/day)
├── .env.local                # GEMINI_API_KEY, SYSTEME_IO_FORM_URL
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
└── tsconfig.json
```

---

## Key Types (`lib/types.ts`)

```typescript
ExtractedContext   // productCategory, emotionalProblems[], useCases[], targetContext
Persona            // id, name, age, occupation, personality, emotionalTendencies, goals, fears
QuestionRound      // question, responses: Map<personaId, string>, scoredResponses[], isScoring
ScoredResponse     // personaId, response, score (1–5), reasoning
SynthesisResult    // averageScore, overallSentiment, whatWorked[], whatDidnt[], surprises, recommendation
AppStep            // 'input' | 'extracting' | 'selecting-personas' | 'session' | 'results'
```

---

## Gemini API Usage

### Model
`gemini-2.5-flash` — stable production model as of May 2026. Do NOT use preview suffixes (e.g., `gemini-2.5-flash-preview-05-20`) — preview model strings expire.

### Token limits per call
| Route | maxTokens |
|---|---|
| extract-context | 4096 (default) |
| generate-personas | 8192 — needs high limit for 10 detailed JSON objects |
| run-interview | 4096 (default) |
| score-response | 4096 (default) |
| synthesize | 2048 |

### API call format
Uses `systemInstruction` (not a `system` role message in the `contents` array — that format is rejected):
```typescript
model.generateContent({
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
})
```

### Rate limits
- Free tier: 20 requests/day per model — hits immediately during development
- Solution: Add billing in Google AI Studio. Pay-as-you-go is ~$0.15/1M input tokens for gemini-2.5-flash
- The app has a separate app-level rate limit (cookie-based, 3 focus group runs/day) enforced in `/api/extract-context`

---

## State Architecture (`app/page.tsx`)

Single `useReducer` manages the entire app. Key state:

```typescript
rounds: QuestionRound[]          // all Q&A rounds, each with a Map of responses + scored array
activeRoundIndex: number         // which round is currently in progress
currentInterviewIndex: number    // which persona is currently "thinking" within a round
isSessionLoading: boolean        // true while any round's interviews or scoring are running
synthesis: SynthesisResult | null
synthesisError: string | null    // set when synthesis API call fails (shows retry button)
```

### Interview orchestration (sequential per round)
```
handleAskQuestion(question):
  dispatch START_ROUND
  for each persona (sequential, for...of):
    build previousRounds history for this persona from all prior rounds
    POST /api/run-interview with persona, question, previousRounds
    dispatch ADD_ROUND_RESPONSE
  Promise.all → score all responses in parallel
  dispatch SET_ROUND_SCORED
```

### Synthesis orchestration
```
handleFinish():
  flatten all rounds' scoredResponses → allResults[]
  POST /api/synthesize
  on success: dispatch SET_SYNTHESIS
  on failure: dispatch SET_SYNTHESIS_ERROR → shows "Try Again" button
```

---

## Prompts (`lib/prompts.ts`)

Five prompt pairs (system + builder):
1. `SYSTEM_CONTEXT_EXTRACTION` / `buildContextExtractionPrompt` — strips brand/marketing language, extracts neutral category context
2. `SYSTEM_PERSONA_GENERATION` / `buildPersonaGenerationPrompt` — 10 diverse personas including skeptics
3. `SYSTEM_INTERVIEW` / `buildInterviewPrompt(persona, concept, userQuestion, previousRounds?)` — in-character response; includes conversation history for rounds 2+
4. `SYSTEM_LIKERT_SCORING` / `buildScoringPrompt` — 1–5 purchase intent score with reasoning
5. `SYSTEM_SYNTHESIS` / `buildSynthesisPrompt` — market research analyst synthesis across all responses

The follow-up prompt (`SYSTEM_FOLLOWUP`) was removed when the flow changed to multi-round.

---

## Design System

### Color Palette (updated May 2026)

CSS custom properties (all defined in `app/globals.css`):

| Variable | Value | Use |
|---|---|---|
| `--paper-bg` | `#EEEEE9` | Page background (off-white/sage — replaced old `#F5F0DC` tan) |
| `--surface` | `#FFFFFF` | Card backgrounds |
| `--border` | `#E2E4E0` | Card/input borders |
| `--border-subtle` | `#F0F0EB` | Navbar bottom border, very faint dividers |
| `--teal` | `#1DA8C0` | Primary accent (buttons, active states, key numbers) |
| `--teal-dark` | `#178A9E` | Hover state for teal elements |
| `--teal-subtle` | `rgba(29,168,192,0.10)` | Sidebar tip card background |
| `--text-primary` | `#1A1D1A` | Main text (near-black, replaced `#3A3A3A`) |
| `--text-secondary` | `#6B7280` | Supporting text |
| `--text-muted` | `#9CA3AF` | Placeholder, hints |
| `--likert-1` through `--likert-5` | red / orange / gray / green / teal | Likert scale colors |
| `--font-body`, `--font-display`, `--font-mono` | DM Sans, DM Serif Display, JetBrains Mono | Font family variables |
| `--navbar-height` | `64px` | Used for sticky positioning calculations |
| `--sidebar-width` | `280px` | Session page right sidebar width |

### Typography (updated May 2026)
Headings across all steps now use **DM Sans 700–800** (bold sans-serif) instead of DM Serif Display. The `display-heading` class and DM Serif Display font are still imported and available but no longer used for primary headings. `hero-headline` class handles the landing page headline (DM Sans 800, clamp 2.25–3.5rem, letter-spacing -0.02em).

### Component Classes
Core: `.btn-primary`, `.btn-secondary`, `.btn-nav-cta` (pill), `.card`, `.input-field`, `.likert-badge`, `.section-container`

Navigation: `.navbar`, `.navbar-brand`, `.navbar-link`

Progress: `.progress-circle` (+ `--active`, `--complete`, `--upcoming` modifiers), `.progress-circle-badge` (checkmark overlay), `.progress-connector` (+ `--active`, `--upcoming`), `.progress-label` (+ state modifiers)

Landing page: `.hero-headline`, `.hero-two-col`, `.hero-input-card`, `.hero-preview-panel`, `.feature-strip`, `.feature-item`, `.char-counter`, `.how-it-works-modal`, `.modal-panel`

Session: `.session-layout`, `.session-sidebar`, `.session-mobile-bar`, `.sidebar-section`, `.sidebar-section-title`, `.sidebar-panelist-row`, `.sidebar-status-answered/thinking/waiting`, `.sidebar-tip-card`, `.sidebar-progress-bar-track/fill`

Response: `.response-card-answered-badge`, `.q-header-row`, `.q-number-badge`

### Animations
- `animate-pulse-opacity` — loading text (2s infinite)
- `animate-fade-in-up` — response cards, badges (0.35s on mount)
- `modal-appear` — How it Works modal scale-in (0.2s)
- `thinking-dot` / `ThinkingDots` component — animated 3-dot indicator for persona thinking state (staggered 0.2s delays)

### Mobile Rules
- All inputs `font-size: 16px` minimum (prevents iOS auto-zoom)
- Tap targets ≥ 48px
- `min-h-[100dvh]` (not `h-screen` — broken on iOS Safari)
- Session sidebar hidden on mobile (`< 1024px`); replaced by `.session-mobile-bar` sticky bar below navbar
- Feature strip: 4-col desktop → 2-col mobile
- Hero two-col: side-by-side desktop → stacked mobile; right preview panel hidden on mobile
- Progress indicator labels: visible on `sm:` and above; icons-only on mobile

---

## Component Architecture (updated May 2026)

### `ProgressIndicator.tsx`
Now renders a full-width sticky `<nav>` (the step navbar for steps 2–4), not a progress bar inside a section-container. Contains: brand name left, 4 circular step indicators center, "Exit session" button right (visible on session/results steps only). Receives `onExit?: () => void` prop — `page.tsx` passes `() => dispatch({ type: 'RESET' })`. The outer `section-container` wrapper in `page.tsx` was removed when this component became full-width.

### `HeroInput.tsx`
Renders its own landing-page `<nav>` (brand + "How it works" button + "Free to use" pill), followed by a two-column hero section. Left column: `hero-input-card` with headline, subtitle, textarea, char counter, CTA button. Right column: `hero-preview-panel` (desktop only) — fully static decorative mock of results (score circle, distribution bars, quote cards). Feature strip below. "How it works" opens a modal (`HowItWorksModal` sub-component) with 4 numbered steps and real explanatory content. Modal closes on backdrop click, × button, or Escape key.

### `SessionPanel.tsx`
Restructured from single-column to a two-column `session-layout` grid. Left: response feed (Q-header rows with Q-badge, question text, "Round N of 5" label; ResponseCards; question input area). Right: sticky sidebar with three sections — session progress (bar + count), panelists list (live status: Answered / Thinking... / Waiting), tips card — plus CTA button ("Ask next question" focuses textarea, "Finish & See Summary" calls onFinish). Mobile: sidebar hidden, replaced by `.session-mobile-bar` sticky compact bar below navbar. No state logic changes — sidebar derives all display from existing props.

### `ResponseCard.tsx`
Added "✓ Answered" badge (`.response-card-answered-badge`), `ThinkingDots` animated component, pulsing avatar ring (`box-shadow`) on thinking state, and a styled placeholder card while thinking (avatar + name + helper text). Likert score badge remains.

### `Scorecard.tsx`
Score hero now uses a colored left border (matching score color) instead of uniform teal border. Score distribution displays as horizontal bars (5→1 order) with percentage labels. "What's Working / What Needs Work" grid is now side-by-side on desktop (`auto-fit` columns). Panel reactions show avatar circles. All headings use DM Sans bold.

### `PersonaCard.tsx`
Added teal checkmark badge (top-right corner) when persona is selected.

---

## Bugs Encountered & Fixes

### 1. `create-next-app` failed
**Cause**: Working directory path "Synthetic Persona Generator" has spaces and capital letters — npm package naming restriction.  
**Fix**: Scaffolded manually: `npm init -y`, renamed package to `your-ai-focus-group`, installed all deps individually.

### 2. Tailwind v4 PostCSS error: "plugin moved to separate package"
**Cause**: `npm install tailwindcss` installs v4 by default; v4 moved the PostCSS plugin.  
**Fix**: `npm install --save-dev tailwindcss@3`

### 3. ESLint v9 incompatibility: "Unknown options: useEslintrc"
**Cause**: `npm install eslint` installs v9; `eslint-config-next@14` requires v8.  
**Fix**: `npm install --save-dev eslint@8 eslint-config-next@14`

### 4. TypeScript v6 incompatibility: "Cannot find type declarations for globals.css"
**Cause**: Next.js 14 ships type declarations incompatible with TypeScript 6.  
**Fix**: `npm install --save-dev typescript@5`

### 5. Gemini model 404: preview model string expired
**Cause**: Original spec used `gemini-2.5-flash-preview-05-20` — preview identifiers expire.  
**Fix**: Changed to `gemini-2.5-flash` (stable, verified via ListModels API).

### 6. Persona generation truncated: "Unexpected end of JSON input"
**Cause**: `maxOutputTokens: 1024` was too low for 10 detailed persona objects.  
**Fix**: Made `maxTokens` a parameter with default 4096; `generate-personas` passes 8192.

### 7. "Start My Focus Group" reset the page (reported bug)
**Cause**: Combined effect of bugs 5 + 6 above. API call failed → catch block dispatched `SET_STEP: 'input'` → appeared to "reset." Was not a UI bug; fixing the API errors resolved it.

### 8. All panelists "unavailable" during first Q&A test
**Cause**: Free tier rate limit (20 req/day) hit during development testing.  
**Fix**: User added billing to Google AI Studio.

### 9. Blank results page after "Finish & See Summary"
**Cause**: Synthesis API returned 503 (Gemini high-demand spike). Error was caught silently; `synthesis` stayed null; results page had no render branch for this state.  
**Fix**: Added `synthesisError` state field, `SET_SYNTHESIS_ERROR` action, and a "Try Again" render branch in the results section.

### 10. HeroInput JSX syntax error after `</main>` → `</div>` refactor (May 2026)
**Cause**: When changing `<main>` to `<div>` in HeroInput, the original `</main>` closing tag was left in place alongside the new `</div>`, creating a duplicate closing tag that broke JSX parsing.  
**Fix**: Removed the stale `</main>` tag; kept only the `</div>`.

### 11. `ProgressIndicator` wrapped in `section-container` caused layout break after navbar rewrite
**Cause**: `page.tsx` was wrapping `<ProgressIndicator>` in `<div className="section-container">`. After the component became a full-width sticky `<nav>`, that wrapper constrained the navbar width and broke sticky positioning.  
**Fix**: Removed the `section-container` wrapper in `page.tsx`; `ProgressIndicator` now renders directly as a top-level sibling.

---

## Environment Variables (`.env.local`)

```
GEMINI_API_KEY=        # From https://aistudio.google.com/apikey — requires billing for >20 req/day
SYSTEME_IO_FORM_URL=   # Optional: systeme.io form action URL for email capture
```

---

## Running Locally

```bash
cd "/Users/roukbook/Desktop/DESKTOP/PRODUCTS /TOOLS/Synthetic Persona Generator"
npm run dev
# Open http://localhost:3000
```

Build check:
```bash
npm run build   # Should show ✓ Compiled successfully with 7 routes
npx tsc --noEmit  # Should return no errors
```
