'use client';

import { Persona, ScoredResponse } from '@/lib/types';
import ResponseCard from './ResponseCard';

interface FocusGroupPanelProps {
  personas: Persona[];
  responses: Map<string, string>;
  scoredResponses: ScoredResponse[];
  currentInterviewIndex: number;
  isScoring: boolean;
}

export default function FocusGroupPanel({
  personas,
  responses,
  scoredResponses,
  currentInterviewIndex,
  isScoring,
}: FocusGroupPanelProps) {
  const allDone = currentInterviewIndex >= personas.length;

  return (
    <div className="section-container py-10">
      <div className="max-w-[680px] mx-auto">
        <h2
          className="display-heading text-2xl mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Focus Group in Session
        </h2>

        {!allDone && (
          <p className="mb-6 animate-pulse-opacity text-sm" style={{ color: 'var(--text-secondary)' }}>
            {personas[currentInterviewIndex]?.name} is thinking...
          </p>
        )}

        {allDone && isScoring && (
          <p className="mb-6 animate-pulse-opacity text-sm" style={{ color: 'var(--text-secondary)' }}>
            Calculating ratings...
          </p>
        )}

        {allDone && !isScoring && (
          <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            All {personas.length} panelists have responded.
          </p>
        )}

        <div>
          {personas.map((persona, index) => {
            const response = responses.get(persona.id) || null;
            const scored = scoredResponses.find(s => s.personaId === persona.id);
            const isThinking = index === currentInterviewIndex;

            if (index > currentInterviewIndex && !response) return null;

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
    </div>
  );
}
