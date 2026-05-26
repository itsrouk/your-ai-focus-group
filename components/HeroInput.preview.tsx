'use client';

import { useState, useEffect, useRef } from 'react';

// ── PREVIEW: Editorial "Studio & Salon" style ──────────────────────────────
// Swap this in page.tsx temporarily to preview. Revert by swapping back to HeroInput.

interface HeroInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
  error: string | null;
  isRateLimited?: boolean;
}

const PILLS = [
  'market research', 'real reactions', 'synthetic personas',
  'instant insights', 'idea validation', 'no surveys',
  'focus groups', 'AI-powered', 'in minutes',
];

const PREVIEW_QUOTES = [
  { name: 'Sarah', age: 28, role: 'Marketing Manager', quote: "I'd definitely use this.", color: '#5B8A72' },
  { name: 'Jason', age: 34, role: 'Product Designer', quote: 'Love the simplicity.', color: '#1DA8C0' },
  { name: 'Linda', age: 52, role: 'Small Business Owner', quote: "Not sure it's different enough.", color: '#C0823E' },
];

const FONT_DISPLAY = "'Bricolage Grotesque', sans-serif";
const FONT_SERIF = "'Instrument Serif', Georgia, serif";
const FONT_MONO = "'JetBrains Mono', monospace";

function HowItWorksModal({ onClose }: { onClose: () => void }) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const steps = [
    { num: 1, title: 'Describe your idea', desc: 'Tell us what you want to test: a product, a tagline, a pitch, anything. The more detail you give, the more relevant the personas.' },
    { num: 2, title: 'Choose your panel', desc: "We generate 10 AI personas matched to your context. Pick 3–5 to form your focus group — include the skeptics. That's where the real insights come from." },
    { num: 3, title: 'Ask your questions', desc: 'Up to 5 rounds of Q&A. Each persona responds independently in their own voice, with honest, Likert-scored feedback.' },
    { num: 4, title: 'Get actionable insights', desc: "A full scorecard with average score, sentiment breakdown, what's working, what needs work, and a clear recommendation — in under 2 minutes." },
  ];

  return (
    <div className="how-it-works-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="How it works">
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1, padding: '0.25rem', borderRadius: '0.25rem' }}
          aria-label="Close"
        >×</button>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '1.375rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          How it Works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {steps.map(step => (
            <div key={step.num} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--teal)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontWeight: 600, fontSize: '0.875rem', flexShrink: 0 }}>
                {step.num}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{step.title}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-primary" style={{ marginTop: '1.75rem', width: '100%', justifyContent: 'center' }}>
          Got it →
        </button>
      </div>
    </div>
  );
}

export default function HeroInput({ onSubmit, isLoading, error, isRateLimited }: HeroInputProps) {
  const [value, setValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const MIN_CHARS = 20;

  const handleSubmit = () => {
    if (value.trim().length < MIN_CHARS) return;
    onSubmit(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const tooShort = value.trim().length > 0 && value.trim().length < MIN_CHARS;

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div style={{ overflow: 'hidden', height: '32px' }}>
          <img src="/logo.png" alt="AI Market Research" style={{ width: 'auto', height: '180px', marginTop: '-74px', display: 'block' }} />
        </div>
        <button className="btn-secondary" onClick={() => setShowModal(true)} style={{ fontSize: '0.875rem', padding: '10px 20px', minHeight: 'unset' }}>
          Click here to learn how this works
        </button>
      </nav>

      {/* ── Main ── */}
      <div style={{ backgroundColor: 'var(--paper-bg)', minHeight: '100vh' }}>

        {/* ── Pill cluster ── */}
        <div className="section-container" style={{ paddingTop: '2.5rem', paddingBottom: '0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {PILLS.map((pill, i) => (
              <span
                key={pill}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                  backgroundColor: i % 2 === 0 ? 'var(--teal)' : 'var(--surface)',
                  color: i % 2 === 0 ? '#fff' : 'var(--teal)',
                  boxShadow: i % 2 === 0 ? 'none' : '0 0 0 1.5px var(--teal)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* ── Hero two-col ── */}
        <div className="section-container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="editorial-grid">
            {/* LEFT */}
            <div>
              {/* Kicker */}
              <p style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '1.25rem', fontWeight: 500 }}>
                AI Market Research · Focus Groups
              </p>

              {/* Big headline */}
              <h1 style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: '2rem',
              }}>
                Test ideas.<br />
                Get real<br />
                <span style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 400, color: 'var(--teal)' }}>reactions.</span>
              </h1>

              {/* Sub */}
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '480px' }}>
                Your AI Focus Group creates a panel of synthetic consumers who react like real people — so you can validate ideas, messaging, and products before you build.
              </p>

              {isRateLimited && (
                <div style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1.5px solid var(--error)', backgroundColor: 'rgba(179,58,58,0.05)' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--error)', marginBottom: '0.375rem' }}>Daily Limit Reached</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>Your daily limit has been reached. Come back tomorrow to run more tests.</p>
                </div>
              )}

              {/* Input area */}
              <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid var(--border)' }}>
                <label htmlFor="concept-input" style={{ display: 'block', fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  What do you want to test?
                </label>
                <textarea
                  id="concept-input"
                  className="input-field resize-y"
                  rows={4}
                  placeholder="Describe what you want to test. A product idea, a landing page concept, a brand tagline, an event pitch — anything."
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || isRateLimited}
                  maxLength={1000}
                  style={{ borderRadius: '0.75rem' }}
                />
                <div className="char-counter">{value.length}/1000</div>

                {tooShort && !isRateLimited && (
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--warning)' }}>
                    Tell us a bit more — at least {MIN_CHARS} characters to get good results.
                  </p>
                )}
                {error && !isRateLimited && (
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--error)' }}>{error}</p>
                )}

                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                  onClick={handleSubmit}
                  disabled={isLoading || isRateLimited || value.trim().length < MIN_CHARS}
                >
                  {isLoading ? 'Analyzing...' : isRateLimited ? 'Limit Reached' : (
                    <>
                      Start My Focus Group
                      <span className="btn-primary-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 7h10v10" /><path d="M7 17 17 7" />
                        </svg>
                      </span>
                    </>
                  )}
                </button>

                <p style={{ fontFamily: FONT_MONO, fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.875rem', display: 'flex', gap: '1.25rem', letterSpacing: '0.05em' }}>
                  <span style={{ color: 'var(--teal)' }}>✓</span><span style={{ marginLeft: '-0.75rem' }}>No surveys</span>
                  <span style={{ color: 'var(--teal)' }}>✓</span><span style={{ marginLeft: '-0.75rem' }}>No budget</span>
                  <span style={{ color: 'var(--teal)' }}>✓</span><span style={{ marginLeft: '-0.75rem' }}>No waiting</span>
                </p>
              </div>
            </div>

            {/* RIGHT — dark editorial panel */}
            <div
              className="hidden lg:flex"
              style={{
                flexDirection: 'column',
                backgroundColor: 'var(--teal)',
                borderRadius: '1.5rem',
                padding: '2.5rem',
                gap: '1.75rem',
                position: 'sticky',
                top: 'calc(var(--navbar-height) + 1.5rem)',
              }}
            >
              {/* Chapter number */}
              <div>
                <p style={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                  Example Output · Focus Group
                </p>
                <p style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: '3.5rem', lineHeight: 0.9, color: 'rgba(255,255,255,0.15)', fontWeight: 400 }}>
                  4.2
                </p>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '1.25rem', color: '#fff', marginTop: '0.25rem' }}>
                  Strong interest
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

              {/* Voices */}
              <div>
                <p style={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                  Voices from the panel
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {PREVIEW_QUOTES.map((q, i) => (
                    <div key={q.name}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: FONT_MONO, fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                          {q.name[0]}
                        </div>
                        <span style={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                          {q.name}, {q.age} · {q.role}
                        </span>
                      </div>
                      <p style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: '1.0625rem', color: '#fff', lineHeight: 1.4, paddingLeft: '2.5rem' }}>
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      {i < PREVIEW_QUOTES.length - 1 && (
                        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.12)', marginTop: '1rem' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom ribbon */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                  Powered by Gemini AI
                </span>
                <span style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: '1rem', color: '#fff' }}>
                  — in under 2 min.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature strip ── */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface)' }}>
          <div className="section-container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <div className="feature-strip">
              <div className="feature-item">
                <div style={{ color: 'var(--teal)', marginBottom: '0.25rem' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <circle cx="11" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="11" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="3.5" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="11" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="18.5" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5.5 14L9 16M17 14l-3.5 2M11 12v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>AI Synthetic Personas</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>10 diverse panelists matched to your idea and target audience.</p>
              </div>
              <div className="feature-item">
                <div style={{ color: 'var(--teal)', marginBottom: '0.25rem' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path d="M4 11a7 7 0 1 1 14 0 7 7 0 0 1-14 0z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Multi-Round Interviews</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Ask up to 5 questions. Get honest answers and Likert-scored feedback.</p>
              </div>
              <div className="feature-item">
                <div style={{ color: 'var(--teal)', marginBottom: '0.25rem' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <rect x="3" y="13" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9" y="9" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="15" y="4" width="4" height="15" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Actionable Insights</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Clear scorecard, key takeaways, and what to do next.</p>
              </div>
              <div className="feature-item">
                <div style={{ color: 'var(--teal)', marginBottom: '0.25rem' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path d="M11 3v10M7 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Share &amp; Export</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Copy the full transcript or email results in one click.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="section-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--text-muted)', textAlign: 'center' }}>
            Inspired by AI research showing up to 90% agreement with human survey patterns in specific tested conditions. PyMC Labs / Colgate-Palmolive, 2025.
          </p>
        </div>
      </div>

      {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
    </>
  );
}
