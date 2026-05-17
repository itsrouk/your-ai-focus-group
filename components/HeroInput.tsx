'use client';

import { useState, useEffect, useRef } from 'react';

interface HeroInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
  error: string | null;
  isRateLimited?: boolean;
}

const LIKERT_COLORS: Record<number, string> = {
  1: '#B33A3A', 2: '#D4793A', 3: '#9CA3AF', 4: '#5B8A72', 5: '#1DA8C0',
};

const PREVIEW_QUOTES = [
  { name: 'Sarah', age: 28, role: 'Marketing Manager', quote: "I'd definitely use this.", color: '#5B8A72' },
  { name: 'Jason', age: 34, role: 'Product Designer', quote: 'Love the simplicity.', color: '#1DA8C0' },
  { name: 'Linda', age: 52, role: 'Small Business Owner', quote: "Not sure it's different enough.", color: '#C0823E' },
];

function PreviewScoreBar({ score, pct, label }: { score: number; pct: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', width: '10px', textAlign: 'right' }}>{score}</span>
      <div style={{ flex: 1, height: '7px', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: LIKERT_COLORS[score], borderRadius: '4px' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', width: '30px' }}>{label}</span>
    </div>
  );
}

function HowItWorksModal({ onClose }: { onClose: () => void }) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const steps = [
    { num: 1, title: 'Describe your idea', desc: "Tell the tool what you want to test: a product, a tagline, a pitch, anything. The tool strips your description down to its core, then removes brand bias and marketing language, so the personas it generates aren't primed to like (or dislike) your concept. This is key because it simulates how real research panels are recruited: around a category, not a brand." },
    { num: 2, title: 'Choose your panel', desc: "The tool generates 10 AI personas with different ages, incomes, attitudes, and levels of skepticism, matched to your concept's category. You just pick 3–5 to \"create\" your focus group. (Pro tip: Include the skeptics. That's where the real insights come from.)" },
    { num: 3, title: 'Ask your questions', desc: 'Ask up to 5 rounds of questions and get answers. Each persona responds independently in their own voice, the way real people do in actual focus groups. Every answer is scored 1–5 on a Likert scale, the same rating system used in the original research study.' },
    { num: 4, title: 'Get actionable insights', desc: "A full scorecard with average score, sentiment breakdown, what's working, what needs work, and a clear recommendation. The methodology behind this tool matched human survey results with 90% accuracy across 9,300 real participants. You get the same thing in under 2 minutes by using this tool." },
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
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.375rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          How it Works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {steps.map(step => (
            <div key={step.num} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--teal)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.875rem', flexShrink: 0 }}>
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

function WhatIsThisModal({ onClose }: { onClose: () => void }) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="how-it-works-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="What is this">
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1, padding: '0.25rem', borderRadius: '0.25rem' }}
          aria-label="Close"
        >×</button>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.375rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          What is this?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            "This is a free AI-powered focus group tool.",
            "You describe your idea or product, and it generates realistic synthetic people who react to it like real consumers would.",
            "It's based on a 2025 research paper by PyMC Labs and Colgate-Palmolive that tested this exact approach against 9,300 real human participants across 57 experiments, and the AI-generated responses matched real survey results with up to 90% accuracy.",
            "That means instead of spending $15,000+ and waiting 6 weeks for a traditional focus group, you can get honest, scored feedback on any idea in about 2 minutes. For free.",
            "The personas aren't generic chatbot answers. Each one has a different age, income, personality, and attitude toward your type of product. Some will love your idea and some won't, but that's the whole point.",
            "You ask the questions, they answer in their own voice, and the tool scores everything. It tells you what's working, what's not, and what to do about it.",
          ].map((para, i) => (
            <p key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{para}</p>
          ))}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem', marginTop: '0.125rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '0.875rem' }}>
              This tool was built by <strong style={{ color: 'var(--text-primary)' }}>Farouk A.</strong> He&rsquo;s been a Marketing Strategist for over 10 years, and now he creates micro-marketing apps that help people solve marketing and branding problems based on what he&rsquo;s learned over the years.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '0.5rem' }}>
              You can see more of his marketing apps here:{' '}
              <a href="https://link.heyitsrouk.com/themarketingshed" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)', textDecoration: 'underline' }}>
                link.heyitsrouk.com/themarketingshed
              </a>
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              If you want to see more of his marketing apps, and know when he makes new apps, you can sign up here:{' '}
              <a href="https://link.heyitsrouk.com/marketingshedsignup" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)', textDecoration: 'underline' }}>
                link.heyitsrouk.com/marketingshedsignup
              </a>
            </p>
          </div>
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
  const [showWhatIsThis, setShowWhatIsThis] = useState(false);
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
        <div className="navbar-inner section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Wordmark — Bricolage Grotesque, no PNG */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15em' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Your
            </span>
            <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.25rem', color: 'var(--teal)', marginLeft: '0.25em', marginRight: '0.15em' }}>
              AI
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Focus Group
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <button
              onClick={() => setShowWhatIsThis(true)}
              style={{ fontSize: '0.875rem', padding: '10px 20px', minHeight: 'unset', backgroundColor: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '0.625rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              What is this?
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{ fontSize: '0.875rem', padding: '10px 20px', minHeight: 'unset', backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1.5px solid var(--border)', borderRadius: '0.625rem', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              <span className="hidden sm:inline">Click here to learn how this works</span>
              <span className="sm:hidden">How it works</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <div style={{ backgroundColor: 'var(--paper-bg)', minHeight: '100vh' }}>
        {/* ── Hero two-column ── */}
        <div className="section-container hero-section-padding">
          <div className="hero-two-col">

            {/* LEFT — headline + input */}
            <div className="hero-input-card hero-left-col">
              <h1 className="hero-headline" style={{ marginBottom: '1.75rem' }}>
                <span className="hero-headline-line">Test ideas.</span>{' '}
                <span className="hero-headline-line">Get real</span>{' '}
                <span className="hero-headline-serif" style={{ color: 'var(--teal)' }}>reactions.</span>
              </h1>

              <p className="hero-subtext" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem', maxWidth: '480px' }}>
                Your AI Focus Group creates a panel of something called &ldquo;synthetic personas,&rdquo; which are profiles of people who fit your exact target audience. Use this tool to ask your &ldquo;audience&rdquo; about product ideas you have, messaging, and copywriting before you build!
              </p>
              <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '2rem', maxWidth: '480px' }}>
                (This tool is based on the Colgate Palmolive and PYMC research study)
              </p>

              {isRateLimited && (
                <div style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1.5px solid var(--error)', backgroundColor: 'rgba(179,58,58,0.05)' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--error)', marginBottom: '0.375rem' }}>Daily Limit Reached</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>Your daily limit for focus group runs has been reached. Please come back tomorrow.</p>
                </div>
              )}

              {/* Input card */}
              <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid var(--border)' }}>
                <label htmlFor="concept-input" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  What do you want to test?
                </label>
                <textarea
                  id="concept-input"
                  className="input-field resize-y"
                  rows={5}
                  placeholder="Describe what you want to test. A product idea, a landing page concept, a brand tagline, an event pitch — anything."
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || isRateLimited}
                  aria-describedby="input-hint"
                  maxLength={1000}
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

                <p id="input-hint" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.875rem', display: 'flex', gap: '1.25rem', letterSpacing: '0.05em' }}>
                  <span style={{ color: 'var(--teal)' }}>✓</span><span style={{ marginLeft: '-0.75rem' }}>No surveys</span>
                  <span style={{ color: 'var(--teal)' }}>✓</span><span style={{ marginLeft: '-0.75rem' }}>No budget</span>
                  <span style={{ color: 'var(--teal)' }}>✓</span><span style={{ marginLeft: '-0.75rem' }}>No waiting</span>
                </p>
              </div>

              {/* Mobile-only compact preview — shown below input on small screens */}
              <div className="sm:hidden" style={{ marginTop: '1.5rem', backgroundColor: 'var(--paper-bg)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.25rem', lineHeight: 1, color: 'var(--teal)' }}>4.2</span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'uppercase' }}>Avg. Score</p>
                </div>
                <div style={{ flex: 1, borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.25rem' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Example Output</p>
                  {PREVIEW_QUOTES.slice(0, 2).map(q => (
                    <p key={q.name} style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.375rem' }}>
                      &ldquo;{q.quote}&rdquo; <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>— {q.name}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — white panel with teal/yellow accents */}
            <div className="hero-preview-panel hidden lg:flex" style={{ flexDirection: 'column', gap: '1.75rem' }}>
              {/* Score header */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Example Output
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '3.5rem', lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--teal)' }}>4.2</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text-muted)' }}>/5</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Strong interest</p>
                </div>
                {/* Yellow accent swatch */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', backgroundColor: '#F2D86A' }} />
                  <div style={{ width: '32px', height: '32px', borderRadius: '0.5rem', backgroundColor: 'var(--teal)', opacity: 0.2 }} />
                </div>
              </div>

              {/* Score distribution */}
              <div style={{ backgroundColor: 'var(--paper-bg)', borderRadius: '0.875rem', padding: '1rem 1.25rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Score Distribution</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <PreviewScoreBar score={5} pct={42} label="42%" />
                  <PreviewScoreBar score={4} pct={34} label="34%" />
                  <PreviewScoreBar score={3} pct={16} label="16%" />
                  <PreviewScoreBar score={2} pct={6}  label=" 6%" />
                  <PreviewScoreBar score={1} pct={2}  label=" 2%" />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

              {/* Voices */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Voices from the panel
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {PREVIEW_QUOTES.map((q, i) => (
                    <div key={q.name}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>
                          {q.name[0]}
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                          {q.name}, {q.age} · {q.role}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.45, paddingLeft: '2.125rem' }}>
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      {i < PREVIEW_QUOTES.length - 1 && (
                        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', marginTop: '0.875rem' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom ribbon — yellow accent */}
              <div style={{ backgroundColor: '#F2D86A', borderRadius: '0.875rem', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.55)' }}>
                  Powered by Gemini AI
                </span>
                <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(0,0,0,0.75)' }}>
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
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>AI Synthetic Personas</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Choose from 10 panelists that match your target audience</p>
              </div>
              <div className="feature-item">
                <div style={{ color: 'var(--teal)', marginBottom: '0.25rem' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path d="M4 11a7 7 0 1 1 14 0 7 7 0 0 1-14 0z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Multi-Round Interviews</p>
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
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Actionable Insights</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Clear scorecard, key takeaways, and what to do next.</p>
              </div>
              <div className="feature-item">
                <div style={{ color: 'var(--teal)', marginBottom: '0.25rem' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path d="M11 3v10M7 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Share &amp; Export</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Copy the full transcript in one click.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="section-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--text-muted)', textAlign: 'center' }}>
            Built on proven AI research with up to 90% accuracy vs. human surveys. PyMC Labs / Colgate-Palmolive, 2025.
          </p>
        </div>
      </div>

      {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
      {showWhatIsThis && <WhatIsThisModal onClose={() => setShowWhatIsThis(false)} />}
    </>
  );
}
