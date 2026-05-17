'use client';

import { Persona } from '@/lib/types';
import PersonaCard from './PersonaCard';

const MIN_SELECTION = 3;
const MAX_SELECTION = 5;

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersonas: Persona[];
  onToggle: (persona: Persona) => void;
  onRunFocusGroup: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export default function PersonaSelector({
  personas,
  selectedPersonas,
  onToggle,
  onRunFocusGroup,
  onRegenerate,
  isRegenerating = false,
}: PersonaSelectorProps) {
  const count = selectedPersonas.length;
  const atMax = count >= MAX_SELECTION;
  const canRun = count >= MIN_SELECTION;

  return (
    <div className="section-container py-10 pb-24 lg:pb-10" style={{ paddingTop: '2rem' }}>
      {/* ── Heading — left-aligned ── */}
      <div className="mb-6 mt-8">
        <h2
          className="mb-2"
          style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '2rem' }}
        >
          Choose Your Focus Group
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
          Pick 3–5 people to interview. Include some skeptics — that&rsquo;s where
          the real insights come from.
        </p>
      </div>

      {/* ── Selection status + CTA — sticky bar (desktop) ── */}
      <div
        className="sticky z-30 flex items-center justify-between gap-4 py-3 mb-5 bg-[var(--paper-bg)]"
        style={{ top: 'var(--navbar-height)', borderBottom: '1px solid var(--border)' }}
      >
        <span
          className="text-sm font-semibold"
          style={{
            color: count > 0 ? 'var(--teal)' : 'var(--text-muted)',
          }}
        >
          {count} of {MAX_SELECTION} selected
          {count < MIN_SELECTION ? ` (need ${MIN_SELECTION - count} more)` : ''}
        </span>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-1"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                minHeight: '40px',
                cursor: isRegenerating ? 'wait' : 'pointer',
                opacity: isRegenerating ? 0.6 : 1,
              }}
              aria-label="Regenerate panel of personas"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                style={{
                  animation: isRegenerating ? 'spin 0.8s linear infinite' : 'none',
                }}
              >
                <path
                  d="M2 7a5 5 0 0 1 8.5-3.5L12 5M12 2v3h-3M12 7a5 5 0 0 1-8.5 3.5L2 9M2 12V9h3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isRegenerating ? 'Regenerating…' : 'Regenerate panel'}
            </button>
          )}
          {canRun && (
            <button
              className="btn-primary hidden sm:inline-flex text-sm"
              style={{ minHeight: '40px', padding: '0.5rem 1.25rem' }}
              onClick={onRunFocusGroup}
            >
              Run Focus Group
            </button>
          )}
        </div>
      </div>

      {/* ── Asymmetric grid — varied card sizes ── */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
        }}
      >
        {personas.map((persona, i) => {
          const isProminent = i % 3 === 2;

          return (
            <div
              key={persona.id}
              style={isProminent ? { gridColumn: 'span 1' } : undefined}
            >
              <PersonaCard
                persona={persona}
                isSelected={selectedPersonas.some(p => p.id === persona.id)}
                onToggle={onToggle}
                selectionDisabled={atMax && !selectedPersonas.some(p => p.id === persona.id)}
                variant={isProminent ? 'prominent' : 'default'}
              />
            </div>
          );
        })}
      </div>

      {/* ── Bottom CTA — desktop only, below grid ── */}
      {canRun && (
        <div className="mt-6 hidden sm:block">
          <button className="btn-primary" onClick={onRunFocusGroup}>
            Run Focus Group with {count} Persona{count !== 1 ? 's' : ''}
            <span className="btn-primary-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7h10v10" /><path d="M7 17 17 7" />
              </svg>
            </span>
          </button>
        </div>
      )}

      {/* ── Mobile sticky bottom bar ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 px-4 py-3"
        style={{
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: count > 0 ? 'var(--teal)' : 'var(--text-muted)' }}
        >
          {count} of {MAX_SELECTION} selected
          {count < MIN_SELECTION ? ` · need ${MIN_SELECTION - count} more` : ''}
        </span>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center justify-center rounded-lg"
              style={{
                width: '40px',
                height: '40px',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                opacity: isRegenerating ? 0.6 : 1,
              }}
              aria-label="Regenerate panel of personas"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                style={{ animation: isRegenerating ? 'spin 0.8s linear infinite' : 'none' }}
              >
                <path
                  d="M2 7a5 5 0 0 1 8.5-3.5L12 5M12 2v3h-3M12 7a5 5 0 0 1-8.5 3.5L2 9M2 12V9h3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {canRun && (
            <button
              className="btn-primary"
              style={{ minHeight: '40px', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
              onClick={onRunFocusGroup}
            >
              Run Focus Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
