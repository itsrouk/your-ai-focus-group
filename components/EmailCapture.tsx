'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  conceptDescription: string;
  averageScore: number;
}

export default function EmailCapture({
  conceptDescription,
  averageScore,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, conceptDescription, averageScore }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="section-container pb-8">
        <div
          style={{
            maxWidth: '420px',
            background: 'var(--surface)',
            borderRadius: '1rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.07)',
            padding: '1.5rem',
          }}
        >
          <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.95rem' }}>
            Got it! We&rsquo;ll send your results shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container pb-8">
      <div
        id="email-capture"
        style={{
          maxWidth: '420px',
          background: 'var(--surface)',
          borderRadius: '1rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.07)',
          padding: '1.5rem',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
              AI Market Research
            </p>
            <h3 style={{ marginTop: '0.25rem', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
              Want a copy of your results?
            </h3>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: '0.75rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Email field */}
          <div>
            <label
              htmlFor="ec-email"
              style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 500 }}
            >
              Email <span style={{ color: 'var(--text-muted)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              <input
                id="ec-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  paddingLeft: '2.25rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                  fontSize: '0.875rem',
                  borderRadius: '0.625rem',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  transition: 'box-shadow 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px var(--teal)`)}
                onBlur={(e) => (e.target.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.10)')}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'loading' || !email.includes('@')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '0.625rem',
              backgroundColor: 'var(--teal)',
              color: '#fff',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: status === 'loading' || !email.includes('@') ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' || !email.includes('@') ? 0.6 : 1,
              transition: 'background-color 0.15s ease, opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { if (status !== 'loading' && email.includes('@')) (e.currentTarget.style.backgroundColor = 'var(--teal-dark)'); }}
            onMouseLeave={(e) => { (e.currentTarget.style.backgroundColor = 'var(--teal)'); }}
          >
            {status === 'loading' ? 'Sending...' : 'Send my results'}
            {status !== 'loading' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </button>

          {status === 'error' && (
            <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '-0.25rem' }}>
              Something went wrong. Please try again.
            </p>
          )}

          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            No spam. Your email is only used to send this report.
          </p>
        </form>
      </div>
    </div>
  );
}
