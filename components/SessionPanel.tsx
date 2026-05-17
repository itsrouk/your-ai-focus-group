'use client';

import { useState, useRef, useEffect } from 'react';
import { Persona, QuestionRound } from '@/lib/types';
import ResponseCard from './ResponseCard';

const AVATAR_COLORS = [
  '#5B8A72', '#1DA8C0', '#C0823E', '#7C6A9A', '#C0714F',
  '#4A7FA5', '#A0826D', '#6B8E4E', '#B07BA8', '#5E8B7E',
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

const QUESTION_LIMIT = 5;

interface SessionPanelProps {
  rounds: QuestionRound[];
  personas: Persona[];
  activeRoundIndex: number;
  currentInterviewIndex: number;
  isSessionLoading: boolean;
  onAskQuestion: (question: string) => void;
  onFinish: () => void;
}

export default function SessionPanel({
  rounds,
  personas,
  activeRoundIndex,
  currentInterviewIndex,
  isSessionLoading,
  onAskQuestion,
  onFinish,
}: SessionPanelProps) {
  const [questionInput, setQuestionInput] = useState('');
  const [showPanelists, setShowPanelists] = useState(false);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const allRoundsComplete =
    !isSessionLoading &&
    rounds.length > 0 &&
    rounds[activeRoundIndex]?.scoredResponses.length > 0;
  const canAskMore = rounds.length < QUESTION_LIMIT;
  const canFinish = rounds.length > 0 && allRoundsComplete;
  const nextQuestionNumber = rounds.length + 1;

  const answeredCount = rounds[activeRoundIndex]?.scoredResponses.length ?? 0;

  useEffect(() => {
    if (allRoundsComplete && inputAreaRef.current) {
      inputAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [allRoundsComplete]);

  const handleAsk = () => {
    const q = questionInput.trim();
    if (!q || isSessionLoading) return;
    setQuestionInput('');
    onAskQuestion(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAsk();
  };

  const focusQuestionInput = () => {
    questionInputRef.current?.focus();
    questionInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div>
      {/* Mobile-only sticky status bar */}
      <div className="session-mobile-bar lg:hidden">
        <button
          onClick={() => setShowPanelists(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-secondary)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <span>Round {Math.max(rounds.length, 1)}/{QUESTION_LIMIT}</span>
          {rounds.length > 0 && <span style={{ color: 'var(--text-muted)' }}>· {answeredCount}/{personas.length}</span>}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: showPanelists ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {allRoundsComplete && canAskMore && (
            <button
              onClick={focusQuestionInput}
              style={{ backgroundColor: 'var(--teal)', color: '#FFF', border: 'none', borderRadius: '0.375rem', padding: '0.25rem 0.625rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Ask next →
            </button>
          )}
          {canFinish && (
            <button
              onClick={onFinish}
              disabled={isSessionLoading}
              style={{ backgroundColor: 'transparent', color: 'var(--teal)', border: '1.5px solid var(--teal)', borderRadius: '0.375rem', padding: '0.25rem 0.625rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', opacity: isSessionLoading ? 0.5 : 1 }}
            >
              Finish →
            </button>
          )}
        </div>
      </div>

      {/* Mobile-only panelist accordion */}
      {showPanelists && (
        <div className="lg:hidden" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {personas.map((persona, i) => {
              const isAnswered = !!(rounds[activeRoundIndex]?.scoredResponses.find(s => s.personaId === persona.id));
              const isThinking = i === currentInterviewIndex && isSessionLoading && !(rounds[activeRoundIndex]?.isScoring);
              return (
                <div key={persona.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.375rem 0' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: getAvatarColor(persona.name), color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>
                    {persona.name[0]}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{persona.name}</span>
                  {isAnswered ? (
                    <span style={{ color: 'var(--teal)', fontSize: '0.75rem', fontWeight: 600 }}>✓</span>
                  ) : isThinking ? (
                    <span style={{ color: 'var(--teal)', fontSize: '0.75rem' }}>Thinking…</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Waiting</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="section-container py-8">
        <div className="session-layout">

          {/* ── LEFT: main content ── */}
          <div>
            {/* Empty state: no questions yet */}
            {rounds.length === 0 && !isSessionLoading && (
              <div className="mb-6">
                <h2
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Your Focus Group
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                  {personas.length} panelists ready to answer your questions
                </p>
              </div>
            )}

            {/* Rounds */}
            <div className="max-w-[40rem]">
              {rounds.map((round, roundIndex) => {
                const isActiveRound = roundIndex === activeRoundIndex;
                const activePersonaIndex = isActiveRound ? currentInterviewIndex : personas.length;

                return (
                  <div key={roundIndex} className="mb-8">
                    {/* Q header row */}
                    <div className="q-header-row">
                      <span className="q-number-badge">Q{roundIndex + 1}</span>
                      <p
                        className="font-semibold flex-1"
                        style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}
                      >
                        &ldquo;{round.question}&rdquo;
                      </p>
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.8125rem',
                          whiteSpace: 'nowrap',
                          marginLeft: 'auto',
                        }}
                      >
                        Round {roundIndex + 1} of {QUESTION_LIMIT}
                      </span>
                    </div>

                    {/* Scoring loading state */}
                    {isActiveRound && isSessionLoading && !round.scoredResponses.length && (
                      <p
                        className="mb-3 animate-pulse-opacity text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {round.isScoring
                          ? 'Calculating ratings...'
                          : personas[activePersonaIndex]
                          ? `${personas[activePersonaIndex].name} is thinking...`
                          : 'Wrapping up...'}
                      </p>
                    )}

                    {/* Response cards */}
                    <div>
                      {personas.map((persona, personaIndex) => {
                        const response = round.responses.get(persona.id) ?? null;
                        const scored = round.scoredResponses.find(s => s.personaId === persona.id);
                        const isThinking =
                          isActiveRound &&
                          personaIndex === activePersonaIndex &&
                          isSessionLoading &&
                          !round.isScoring;

                        if (isActiveRound && personaIndex > activePersonaIndex && !response) return null;

                        return (
                          <ResponseCard
                            key={persona.id}
                            persona={persona}
                            response={response}
                            scoredResponse={scored}
                            isThinking={isThinking}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Question input area */}
            <div ref={inputAreaRef} className="max-w-[38rem]">
              {rounds.length === 0 && !isSessionLoading && (
                <div
                  className="p-5"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    boxShadow: 'var(--shadow-raised)',
                  }}
                >
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Ask your first question
                  </label>
                  <textarea
                    ref={questionInputRef}
                    className="input-field resize-none"
                    rows={3}
                    placeholder={`e.g., "What's your first reaction to this product?" or "Would you pay $29/month for this?"`}
                    value={questionInput}
                    onChange={e => setQuestionInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSessionLoading}
                    maxLength={500}
                  />
                  <div className="char-counter mb-3">{questionInput.length}/500</div>
                  <button
                    className="btn-primary w-full sm:w-auto"
                    onClick={handleAsk}
                    disabled={!questionInput.trim() || isSessionLoading}
                  >
                    Ask the Panel
                  </button>
                </div>
              )}

              {rounds.length > 0 && allRoundsComplete && (
                <div
                  className="p-5 animate-fade-in-up"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    boxShadow: 'var(--shadow-raised)',
                  }}
                >
                  {canAskMore ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          Ask another question
                        </label>
                        <span
                          className="text-xs font-semibold px-2 py-0.5"
                          style={{
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            border: '1px solid var(--border)',
                            borderRadius: '0.25rem',
                          }}
                        >
                          Q{nextQuestionNumber} of {QUESTION_LIMIT}
                        </span>
                      </div>
                      <textarea
                        ref={questionInputRef}
                        className="input-field resize-none"
                        rows={3}
                        placeholder={`e.g., "What would make you more likely to try this?" or "How does this compare to what you use now?"`}
                        value={questionInput}
                        onChange={e => setQuestionInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSessionLoading}
                        maxLength={500}
                      />
                      <div className="char-counter mb-3">{questionInput.length}/500</div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          className="btn-primary"
                          onClick={handleAsk}
                          disabled={!questionInput.trim() || isSessionLoading}
                        >
                          Ask the Panel
                        </button>
                        {canFinish && (
                          <button className="btn-secondary" onClick={onFinish} disabled={isSessionLoading}>
                            Finish &amp; See Summary
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        You&rsquo;ve used all {QUESTION_LIMIT} questions. Ready to see the summary?
                      </p>
                      <button className="btn-primary" onClick={onFinish} disabled={isSessionLoading}>
                        Finish &amp; See Summary
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isSessionLoading && rounds.length > 0 && (
                <div className="py-4">
                  <p className="animate-pulse-opacity text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {rounds[activeRoundIndex]?.isScoring ? 'Scoring responses...' : 'Panel is responding...'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: sidebar (desktop only) ── */}
          <div className="session-sidebar hidden lg:flex">

            {/* Section 1: Session progress */}
            <div className="sidebar-section">
              <div className="flex items-center justify-between mb-1">
                <p className="sidebar-section-title" style={{ marginBottom: 0 }}>Session progress</p>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Round {Math.max(rounds.length, rounds.length > 0 ? activeRoundIndex + 1 : 0)} of {QUESTION_LIMIT}
                </span>
              </div>
              <div className="sidebar-progress-bar-track">
                <div
                  className="sidebar-progress-bar-fill"
                  style={{ width: `${(rounds.length / QUESTION_LIMIT) * 100}%` }}
                />
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                {rounds.length}/{QUESTION_LIMIT} questions asked
              </p>
            </div>

            {/* Section 2: Panelists */}
            <div className="sidebar-section">
              <div className="flex items-center justify-between">
                <p className="sidebar-section-title" style={{ marginBottom: 0 }}>Panelists</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {answeredCount} of {personas.length} answered
                </span>
              </div>
              <div style={{ marginTop: '0.625rem', display: 'flex', flexDirection: 'column' }}>
                {personas.map((persona, i) => {
                  const isAnswered = !!(rounds[activeRoundIndex]?.scoredResponses.find(s => s.personaId === persona.id));
                  const isThinking =
                    i === currentInterviewIndex &&
                    isSessionLoading &&
                    !(rounds[activeRoundIndex]?.isScoring);

                  return (
                    <div key={persona.id} className="sidebar-panelist-row">
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: getAvatarColor(persona.name),
                          color: '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          flexShrink: 0,
                        }}
                      >
                        {persona.name[0]}
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {persona.name}
                      </span>
                      {isAnswered ? (
                        <span className="sidebar-status-answered">✓ Answered</span>
                      ) : isThinking ? (
                        <span className="sidebar-status-thinking" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span className="thinking-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--teal)', display: 'inline-block' }} />
                          <span className="thinking-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--teal)', display: 'inline-block', animationDelay: '0.2s' }} />
                          <span className="thinking-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--teal)', display: 'inline-block', animationDelay: '0.4s' }} />
                          <span style={{ marginLeft: '2px' }}>Thinking</span>
                        </span>
                      ) : (
                        <span className="sidebar-status-waiting" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'inline-block', flexShrink: 0 }} />
                          Waiting
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Tips */}
            <div className="sidebar-tip-card">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '1px', color: 'var(--teal)' }} aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M8 7v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
                </svg>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Tips for better insights
                  </p>
                  <p style={{ lineHeight: 1.55 }}>
                    Ask open-ended questions that reveal opinions, feelings, and trade-offs. Try &ldquo;why&rdquo; and &ldquo;how&rdquo; follow-ups in future rounds.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar CTA */}
            {QUESTION_LIMIT - rounds.length > 0 && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{QUESTION_LIMIT - rounds.length}</span> question{QUESTION_LIMIT - rounds.length !== 1 ? 's' : ''} remaining
              </p>
            )}

            {allRoundsComplete && canAskMore && (
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={focusQuestionInput}>
                Ask next question →
              </button>
            )}

            {canFinish && !canAskMore && (
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onFinish}>
                Finish &amp; See Summary
              </button>
            )}

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
              🔒 Each panelist will respond one at a time, then we&rsquo;ll score their answers.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
