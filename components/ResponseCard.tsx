'use client';

import { useState, useRef, useEffect } from 'react';
import { Persona, ScoredResponse } from '@/lib/types';

const AVATAR_COLORS = [
  '#5B8A72', '#1DA8C0', '#C0823E', '#7C6A9A', '#C0714F',
  '#4A7FA5', '#A0826D', '#6B8E4E', '#B07BA8', '#5E8B7E',
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

const LIKERT_LABELS: Record<number, string> = {
  1: 'Not interested',
  2: 'Slightly interested',
  3: 'Neutral / Unsure',
  4: 'Interested',
  5: 'Very interested',
};

function ThinkingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', marginLeft: '2px' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="thinking-dot"
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'var(--teal)',
            display: 'inline-block',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}

interface ResponseCardProps {
  persona: Persona;
  response: string | null;
  scoredResponse?: ScoredResponse;
  isThinking: boolean;
}

export default function ResponseCard({
  persona,
  response,
  scoredResponse,
  isThinking,
}: ResponseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (response && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [response]);

  const avatarColor = getAvatarColor(persona.name);
  const score = scoredResponse?.score;
  const isAnswered = score !== undefined;

  return (
    <div
      ref={cardRef}
      className="card animate-fade-in-up mb-3"
      style={{ borderLeft: `3px solid ${avatarColor}` }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
          style={{
            backgroundColor: avatarColor,
            fontFamily: 'var(--font-mono)',
            boxShadow: isThinking ? '0 0 0 3px rgba(29, 168, 192, 0.25)' : 'none',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {persona.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-semibold"
                style={{ color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'var(--font-body)' }}
              >
                {persona.name}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {persona.age} &middot; {persona.occupation}
              </span>
            </div>

            {/* Status badge: answered or thinking */}
            {isAnswered && (
              <div className="response-card-answered-badge animate-fade-in-up">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Answered
              </div>
            )}
            {isThinking && !response && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--teal)', fontSize: '0.75rem', fontWeight: 500 }}>
                <ThinkingDots />
                <span style={{ marginLeft: '4px' }}>Thinking...</span>
              </div>
            )}
          </div>

          {/* Likert score */}
          {isAnswered && (
            <div className="flex items-center gap-1.5 mt-1 animate-fade-in-up">
              <span className="likert-badge" data-score={score} title={LIKERT_LABELS[score!]}>
                {score}
              </span>
              <span className="hidden sm:inline text-xs" style={{ color: 'var(--text-secondary)' }}>
                {LIKERT_LABELS[score!]}
              </span>
            </div>
          )}

          {/* Thinking placeholder */}
          {isThinking && !response && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--paper-bg)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: avatarColor,
                  opacity: 0.4,
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.125rem' }}>
                  {persona.name} is thinking...
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  We&rsquo;ll let you know when {persona.name} has shared their thoughts.
                </p>
              </div>
            </div>
          )}

          {/* Response text */}
          {response && (
            <>
              {/* Mobile: collapsible */}
              <div className="block md:hidden">
                <div style={{ maxHeight: expanded ? 'none' : '80px', overflow: 'hidden' }}>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    &ldquo;{response}&rdquo;
                  </p>
                </div>
                <button
                  className="text-xs mt-1 font-semibold"
                  style={{ color: 'var(--teal)' }}
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              </div>

              {/* Desktop: always full */}
              <p className="hidden md:block mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                &ldquo;{response}&rdquo;
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
