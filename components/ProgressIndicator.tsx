'use client';

import { AppStep } from '@/lib/types';

const STEPS: { key: AppStep; label: string; icon: React.ReactNode }[] = [
  {
    key: 'input',
    label: 'Describe',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M12.5 2.5a1.414 1.414 0 0 1 2 2L5.5 13.5l-3 1 1-3 9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'selecting-personas',
    label: 'Choose Panel',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 15c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="13" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13 11c1.657 0 3 1.343 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'session',
    label: 'Session',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M15 9.5A6 6 0 1 1 3 9.5v-.5a6 6 0 0 1 12 0v.5z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 13v2M7 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="6.5" cy="9" r="1" fill="currentColor"/>
        <circle cx="9" cy="9" r="1" fill="currentColor"/>
        <circle cx="11.5" cy="9" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    key: 'results',
    label: 'Results',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="10" width="3" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="7.5" y="7" width="3" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="13" y="3" width="3" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const STEP_INDEX: Record<AppStep, number> = {
  input: 0,
  extracting: 0,
  'selecting-personas': 1,
  session: 2,
  results: 3,
};

interface ProgressIndicatorProps {
  step: AppStep;
  onExit?: () => void;
}

export default function ProgressIndicator({ step, onExit }: ProgressIndicatorProps) {
  const currentIndex = STEP_INDEX[step];
  const showExit = step === 'session' || step === 'results';

  return (
    <nav className="navbar">
      <div className="navbar-inner section-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.15em', flexShrink: 0 }}>
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

      {/* Step circles */}
      <div className="flex items-start" style={{ marginLeft: '2rem' }}>
        {STEPS.map((s, i) => {
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;
          const iconColor = isCurrent || isComplete ? '#FFFFFF' : 'var(--text-muted)';

          return (
            <div key={s.key} className="flex items-start">
              {/* Circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={`progress-circle ${
                    isCurrent
                      ? 'progress-circle--active'
                      : isComplete
                      ? 'progress-circle--complete'
                      : 'progress-circle--upcoming'
                  }`}
                  style={{ color: iconColor }}
                >
                  {s.icon}
                  {isComplete && (
                    <span className="progress-circle-badge">
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                        <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </div>
                <span
                  className={`progress-label hidden sm:block ${
                    isCurrent
                      ? 'progress-label--active'
                      : isComplete
                      ? 'progress-label--complete'
                      : 'progress-label--upcoming'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector — vertically centered to the circle */}
              {i < STEPS.length - 1 && (
                <div
                  className={`progress-connector mx-1 sm:mx-2 self-start mt-[19px] sm:mt-[19px] ${
                    i < currentIndex
                      ? 'progress-connector--active'
                      : 'progress-connector--upcoming'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Exit / right side */}
      <div className="flex items-center" style={{ minWidth: '80px', justifyContent: 'flex-end' }}>
        {showExit && onExit && (
          <button
            onClick={onExit}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--paper-bg)')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2H12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9M6 9.5L3 7l3-2.5M3 7h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Exit session
          </button>
        )}
        {showExit && onExit && (
          <button
            onClick={onExit}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg"
            style={{
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
            aria-label="Exit session"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2H12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9M6 9.5L3 7l3-2.5M3 7h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {!showExit && <div style={{ width: '80px' }} />}
      </div>
      </div>
    </nav>
  );
}
