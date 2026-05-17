'use client';

import { useState } from 'react';
import {
  AttributedInsight,
  Persona,
  QuestionRound,
  ScoredResponse,
  SynthesisResult,
} from '@/lib/types';

function normalizeInsight(item: string | AttributedInsight): { text: string; personas: string[] } {
  if (typeof item === 'string') return { text: item.replace(/\*\*/g, ''), personas: [] };
  return {
    text: (item.text ?? '').replace(/\*\*/g, ''),
    personas: Array.isArray(item.personas) ? item.personas.filter(Boolean) : [],
  };
}

const LIKERT_COLORS: Record<number, string> = {
  1: 'var(--likert-1)',
  2: 'var(--likert-2)',
  3: 'var(--likert-3)',
  4: 'var(--likert-4)',
  5: 'var(--likert-5)',
};

function getScoreColor(score: number): string {
  if (score <= 1.5) return LIKERT_COLORS[1];
  if (score <= 2.5) return LIKERT_COLORS[2];
  if (score <= 3.5) return LIKERT_COLORS[3];
  if (score <= 4.5) return LIKERT_COLORS[4];
  return LIKERT_COLORS[5];
}

function getKeyQuote(response: string): string {
  const sentences = response.split(/(?<=[.!?])\s+/);
  return sentences.reduce(
    (longest, s) => (s.length > longest.length ? s : longest),
    ''
  );
}

const AVATAR_COLORS = [
  '#5B8A72', '#1DA8C0', '#C0823E', '#7C6A9A', '#C0714F',
  '#4A7FA5', '#A0826D', '#6B8E4E', '#B07BA8', '#5E8B7E',
];
function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

interface ScorecardProps {
  synthesis: SynthesisResult;
  personas: Persona[];
  rounds: QuestionRound[];
}

export default function Scorecard({ synthesis, personas, rounds }: ScorecardProps) {
  const avg = synthesis.averageScore;
  const scoreColor = getScoreColor(avg);

  const allScored: ScoredResponse[] = rounds.flatMap(r => r.scoredResponses);

  const perPersonaBest: Array<{
    persona: Persona;
    scored: ScoredResponse;
    quote: string;
  }> = personas
    .map(persona => {
      const personaScores = allScored.filter(s => s.personaId === persona.id);
      if (personaScores.length === 0) return null;
      const best = personaScores.reduce((prev, cur) =>
        Math.abs(cur.score - 3) >= Math.abs(prev.score - 3) ? cur : prev
      );
      return { persona, scored: best, quote: getKeyQuote(best.response) };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const distribution = [1, 2, 3, 4, 5].map(n => ({
    score: n,
    count: allScored.filter(r => r.score === n).length,
  }));
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <div className="section-container py-10">
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '2rem',
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
        }}
      >
        Focus Group Results
      </h2>

      {/* ── Score hero ── */}
      <div
        className="card mb-6 py-8 px-6"
        style={{ borderLeft: `4px solid ${scoreColor}` }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Score number */}
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: 'clamp(3rem, 8vw, 4.5rem)',
                  lineHeight: 1,
                  color: scoreColor,
                }}
              >
                {avg.toFixed(1)}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                / 5
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              Average score across {allScored.length} responses
            </p>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: scoreColor }}>
              {avg <= 1.5 && 'Very low interest'}
              {avg > 1.5 && avg <= 2.5 && 'Low interest'}
              {avg > 2.5 && avg <= 3.4 && 'Mixed reactions'}
              {avg > 3.4 && avg <= 4.2 && 'Strong interest'}
              {avg > 4.2 && 'Very strong interest'}
            </p>
          </div>

          {/* Distribution chart */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>
              Score Distribution
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[5, 4, 3, 2, 1].map(n => {
                const item = distribution.find(d => d.score === n)!;
                const pct = allScored.length > 0 ? Math.round((item.count / allScored.length) * 100) : 0;
                return (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', width: '12px', textAlign: 'right', flexShrink: 0 }}>
                      {n}
                    </span>
                    <div style={{ flex: 1, height: '10px', borderRadius: '5px', backgroundColor: 'var(--border)', overflow: 'hidden' }}>
                      {item.count > 0 && (
                        <div
                          style={{
                            width: `${Math.max(pct, 4)}%`,
                            height: '100%',
                            backgroundColor: LIKERT_COLORS[n],
                            borderRadius: '5px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      )}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', width: '32px', flexShrink: 0 }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Insight ── */}
      <div className="card mb-4" style={{ borderLeft: '3px solid var(--teal)' }}>
        <p style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--teal)', marginBottom: '0.5rem' }}>
          Key Insight
        </p>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{synthesis.overallSentiment}</p>
      </div>

      {/* ── Panel Reactions ── */}
      <div className="mb-6">
        <h3 style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Panel Reactions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {perPersonaBest.map(({ persona, scored, quote }) => (
            <PanelReactionRow
              key={persona.id}
              persona={persona}
              scored={scored}
              quote={quote}
            />
          ))}
        </div>
      </div>

      {/* ── What's Working + What Needs Work (side by side on desktop) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--success)', marginBottom: '0.75rem' }}>
            What&rsquo;s Working
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {synthesis.whatWorked.map((item, i) => (
              <InsightItem key={i} item={item} tone="success" />
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--error)', marginBottom: '0.75rem' }}>
            What Needs Work
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {synthesis.whatDidnt.map((item, i) => (
              <InsightItem key={i} item={item} tone="error" />
            ))}
          </ul>
        </div>
      </div>

      {/* ── Surprising Finding ── */}
      {synthesis.surprises && (
        <div className="card mb-4" style={{ backgroundColor: 'var(--surface)' }}>
          <p style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--warning)', marginBottom: '0.5rem' }}>
            Surprising Finding
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {synthesis.surprises}
          </p>
        </div>
      )}

      {/* ── Recommendation ── */}
      <div className="card" style={{ borderLeft: '3px solid var(--teal)', backgroundColor: '#e6f7fa' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ color: 'var(--teal)', flexShrink: 0 }}>
            <path d="M7 1a4 4 0 0 1 2 7.465V10.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V8.465A4 4 0 0 1 7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M5.5 12h3M6 13.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <p style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--teal)' }}>
            Recommendation
          </p>
        </div>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{synthesis.recommendation.replace(/\*\*/g, '')}</p>
      </div>
    </div>
  );
}

function InsightItem({
  item,
  tone,
}: {
  item: string | AttributedInsight;
  tone: 'success' | 'error';
}) {
  const { text, personas } = normalizeInsight(item);
  const marker = tone === 'success' ? '+' : '–';
  const markerColor = tone === 'success' ? 'var(--success)' : 'var(--error)';

  return (
    <li style={{ fontSize: '0.9375rem', display: 'flex', gap: '0.5rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
      <span style={{ color: markerColor, fontWeight: 700, flexShrink: 0 }}>{marker}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span>{text}</span>
        {personas.length > 0 && (
          <div
            style={{
              marginTop: '0.375rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: 'var(--text-muted)',
                marginRight: '0.125rem',
              }}
            >
              From
            </span>
            {personas.map(name => (
              <span
                key={name}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: getAvatarColor(name),
                  backgroundColor: 'var(--paper-bg)',
                  border: `1px solid ${getAvatarColor(name)}33`,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '999px',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function PanelReactionRow({
  persona,
  scored,
  quote,
}: {
  persona: Persona;
  scored: ScoredResponse;
  quote: string;
}) {
  const [showReasoning, setShowReasoning] = useState(false);
  const hasReasoning =
    !!scored.reasoning &&
    scored.reasoning.trim().length > 0 &&
    scored.reasoning.trim() !== 'Scoring unavailable.';

  return (
    <div className="card" style={{ padding: '0.875rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: getAvatarColor(persona.name),
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.875rem',
            flexShrink: 0,
          }}
        >
          {persona.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              {persona.name}
            </span>
            <span className="likert-badge" data-score={scored.score} style={{ marginTop: '1px' }}>
              {scored.score}
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            &ldquo;{quote}&rdquo;
          </p>

          {hasReasoning && (
            <>
              <button
                type="button"
                onClick={() => setShowReasoning(v => !v)}
                aria-expanded={showReasoning}
                className="focus:outline-none focus-visible:ring-1"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0.375rem 0 0',
                  marginTop: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                  style={{ transform: showReasoning ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}
                >
                  <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {showReasoning ? 'Hide reason' : 'Why this score?'}
              </button>
              {showReasoning && (
                <p
                  style={{
                    marginTop: '0.375rem',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--paper-bg)',
                    borderLeft: '2px solid var(--border)',
                    padding: '0.5rem 0.625rem',
                    borderRadius: '0 4px 4px 0',
                  }}
                >
                  {scored.reasoning}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
