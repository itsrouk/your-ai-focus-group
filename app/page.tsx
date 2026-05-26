'use client';

import { useReducer, useCallback, useState } from 'react';
import {
  AppStep,
  ExtractedContext,
  Persona,
  QuestionRound,
  ScoredResponse,
  SynthesisResult,
} from '@/lib/types';

import HeroInput from '@/components/HeroInput';
import PersonaSelector from '@/components/PersonaSelector';
import SessionPanel from '@/components/SessionPanel';
import Scorecard from '@/components/Scorecard';
import ShareButton from '@/components/ShareButton';
import ProgressIndicator from '@/components/ProgressIndicator';
import BuildingFocusGroup from '@/components/BuildingFocusGroup';
import LoadingState from '@/components/LoadingState';

// ── State ─────────────────────────────────────────────────────────────────────

interface AppState {
  step: AppStep;
  userInput: string;
  extractedContext: ExtractedContext | null;
  allPersonas: Persona[];
  selectedPersonas: Persona[];
  rounds: QuestionRound[];
  activeRoundIndex: number;
  currentInterviewIndex: number;
  isSessionLoading: boolean;
  synthesis: SynthesisResult | null;
  isSynthesizing: boolean;
  synthesisError: string | null;
  error: string | null;
  isRateLimited: boolean;
}

type Action =
  | { type: 'SET_STEP'; step: AppStep }
  | { type: 'SET_INPUT'; input: string }
  | { type: 'SET_CONTEXT'; context: ExtractedContext }
  | { type: 'SET_PERSONAS'; personas: Persona[] }
  | { type: 'TOGGLE_PERSONA'; persona: Persona }
  | { type: 'START_ROUND'; question: string }
  | { type: 'ADD_ROUND_RESPONSE'; roundIndex: number; personaId: string; response: string }
  | { type: 'SET_ROUND_SCORING'; roundIndex: number; value: boolean }
  | { type: 'SET_ROUND_SCORED'; roundIndex: number; scored: ScoredResponse[] }
  | { type: 'SET_SESSION_LOADING'; value: boolean }
  | { type: 'SET_CURRENT_INDEX'; index: number }
  | { type: 'SET_SYNTHESIS'; synthesis: SynthesisResult }
  | { type: 'SET_SYNTHESIZING'; value: boolean }
  | { type: 'SET_SYNTHESIS_ERROR'; error: string | null }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_RATE_LIMITED'; value: boolean }
  | { type: 'RESET' };

const initialState: AppState = {
  step: 'input',
  userInput: '',
  extractedContext: null,
  allPersonas: [],
  selectedPersonas: [],
  rounds: [],
  activeRoundIndex: 0,
  currentInterviewIndex: 0,
  isSessionLoading: false,
  synthesis: null,
  isSynthesizing: false,
  synthesisError: null,
  error: null,
  isRateLimited: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step, error: null };
    case 'SET_INPUT':
      return { ...state, userInput: action.input };
    case 'SET_CONTEXT':
      return { ...state, extractedContext: action.context };
    case 'SET_PERSONAS':
      return { ...state, allPersonas: action.personas };
    case 'TOGGLE_PERSONA': {
      const exists = state.selectedPersonas.some(p => p.id === action.persona.id);
      const updated = exists
        ? state.selectedPersonas.filter(p => p.id !== action.persona.id)
        : state.selectedPersonas.length < 5
        ? [...state.selectedPersonas, action.persona]
        : state.selectedPersonas;
      return { ...state, selectedPersonas: updated };
    }
    case 'START_ROUND': {
      const newRound: QuestionRound = {
        question: action.question,
        responses: new Map(),
        scoredResponses: [],
        isScoring: false,
      };
      return {
        ...state,
        rounds: [...state.rounds, newRound],
        activeRoundIndex: state.rounds.length,
        currentInterviewIndex: 0,
        isSessionLoading: true,
      };
    }
    case 'ADD_ROUND_RESPONSE': {
      const rounds = state.rounds.map((r, i) => {
        if (i !== action.roundIndex) return r;
        const newMap = new Map(r.responses);
        newMap.set(action.personaId, action.response);
        return { ...r, responses: newMap };
      });
      return {
        ...state,
        rounds,
        currentInterviewIndex: state.currentInterviewIndex + 1,
      };
    }
    case 'SET_ROUND_SCORING': {
      const rounds = state.rounds.map((r, i) =>
        i === action.roundIndex ? { ...r, isScoring: action.value } : r
      );
      return { ...state, rounds };
    }
    case 'SET_ROUND_SCORED': {
      const rounds = state.rounds.map((r, i) =>
        i === action.roundIndex ? { ...r, scoredResponses: action.scored, isScoring: false } : r
      );
      return { ...state, rounds, isSessionLoading: false };
    }
    case 'SET_SESSION_LOADING':
      return { ...state, isSessionLoading: action.value };
    case 'SET_CURRENT_INDEX':
      return { ...state, currentInterviewIndex: action.index };
    case 'SET_SYNTHESIS':
      return { ...state, synthesis: action.synthesis };
    case 'SET_SYNTHESIZING':
      return { ...state, isSynthesizing: action.value };
    case 'SET_SYNTHESIS_ERROR':
      return { ...state, synthesisError: action.error };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_RATE_LIMITED':
      return { ...state, isRateLimited: action.value };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Step 1+2: Extract context → Generate personas
  const handleStart = useCallback(async (input: string) => {
    dispatch({ type: 'SET_INPUT', input });
    dispatch({ type: 'SET_STEP', step: 'extracting' });
    dispatch({ type: 'SET_ERROR', error: null });

    try {
      const ctxRes = await fetch('/api/extract-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input }),
      });
      const ctxData = await ctxRes.json();

      if (!ctxData.success) {
        if (ctxData.rateLimitExceeded) {
          dispatch({ type: 'SET_RATE_LIMITED', value: true });
        } else {
          dispatch({ type: 'SET_ERROR', error: ctxData.error });
        }
        dispatch({ type: 'SET_STEP', step: 'input' });
        return;
      }

      dispatch({ type: 'SET_CONTEXT', context: ctxData.data });

      const pRes = await fetch('/api/generate-personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: ctxData.data }),
      });
      const pData = await pRes.json();

      if (!pData.success) {
        dispatch({ type: 'SET_ERROR', error: pData.error });
        dispatch({ type: 'SET_STEP', step: 'input' });
        return;
      }

      dispatch({ type: 'SET_PERSONAS', personas: pData.data });
      dispatch({ type: 'SET_STEP', step: 'selecting-personas' });
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Something went wrong. Please try again.' });
      dispatch({ type: 'SET_STEP', step: 'input' });
    }
  }, []);

  // Step 3: Enter session after persona selection
  const handleRunFocusGroup = useCallback(() => {
    if (state.selectedPersonas.length < 3) return;
    dispatch({ type: 'SET_STEP', step: 'session' });
  }, [state.selectedPersonas]);

  // Re-generate the panel of 10 personas using the already-extracted context.
  // Resets any selections since the persona IDs change.
  const [isRegenerating, setIsRegenerating] = useState(false);
  const handleRegeneratePanel = useCallback(async () => {
    if (!state.extractedContext || isRegenerating) return;
    setIsRegenerating(true);
    try {
      const pRes = await fetch('/api/generate-personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: state.extractedContext }),
      });
      const pData = await pRes.json();
      if (pData.success) {
        // Clear selections (old persona IDs are gone) then load new panel
        state.selectedPersonas.forEach(p =>
          dispatch({ type: 'TOGGLE_PERSONA', persona: p })
        );
        dispatch({ type: 'SET_PERSONAS', personas: pData.data });
      } else {
        dispatch({ type: 'SET_ERROR', error: pData.error ?? 'Could not regenerate panel.' });
      }
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not regenerate panel.' });
    } finally {
      setIsRegenerating(false);
    }
  }, [state.extractedContext, state.selectedPersonas, isRegenerating]);

  // Step 4: Ask a question — sequential interviews then parallel scoring
  const handleAskQuestion = useCallback(async (question: string) => {
    const { selectedPersonas, userInput, rounds } = state;
    if (rounds.length >= 5 || state.isSessionLoading) return;

    const roundIndex = rounds.length;
    dispatch({ type: 'START_ROUND', question });

    const collectedResponses: Array<{ personaId: string; response: string }> = [];

    for (let i = 0; i < selectedPersonas.length; i++) {
      const persona = selectedPersonas[i];
      dispatch({ type: 'SET_CURRENT_INDEX', index: i });

      // Build this persona's prior Q&A history
      const previousRounds = rounds
        .map(r => ({
          question: r.question,
          response: r.responses.get(persona.id) ?? '',
        }))
        .filter(r => r.response);

      try {
        const res = await fetch('/api/run-interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona, conceptDescription: userInput, userQuestion: question, previousRounds }),
        });
        const data = await res.json();
        const response = data.success ? data.data.response : '[This panelist was unavailable.]';
        dispatch({ type: 'ADD_ROUND_RESPONSE', roundIndex, personaId: persona.id, response });
        collectedResponses.push({ personaId: persona.id, response });
      } catch {
        const response = '[This panelist was unavailable.]';
        dispatch({ type: 'ADD_ROUND_RESPONSE', roundIndex, personaId: persona.id, response });
        collectedResponses.push({ personaId: persona.id, response });
      }
    }

    // Parallel scoring
    dispatch({ type: 'SET_ROUND_SCORING', roundIndex, value: true });

    const scoreResults = await Promise.all(
      collectedResponses.map(({ personaId, response }) => {
        const persona = selectedPersonas.find(p => p.id === personaId)!;
        return fetch('/api/score-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ personaId, personaName: persona.name, response }),
        })
          .then(r => r.json())
          .then(d =>
            d.success
              ? ({ personaId, response, score: d.data.score, reasoning: d.data.reasoning } as ScoredResponse)
              : ({ personaId, response, score: 3, reasoning: 'Scoring unavailable.' } as ScoredResponse)
          )
          .catch(() => ({ personaId, response, score: 3, reasoning: 'Scoring unavailable.' } as ScoredResponse))
      })
    );

    dispatch({ type: 'SET_ROUND_SCORED', roundIndex, scored: scoreResults });
  }, [state]);

  // Step 5: Finish session → synthesize across all rounds → show results
  const handleFinish = useCallback(async () => {
    const { selectedPersonas, rounds } = state;
    dispatch({ type: 'SET_SYNTHESIZING', value: true });
    dispatch({ type: 'SET_SYNTHESIS_ERROR', error: null });
    dispatch({ type: 'SET_STEP', step: 'results' });

    const allResults = rounds.flatMap(round =>
      round.scoredResponses.map(sr => {
        const persona = selectedPersonas.find(p => p.id === sr.personaId)!;
        return {
          name: persona.name,
          age: persona.age,
          occupation: persona.occupation,
          response: sr.response,
          score: sr.score,
        };
      })
    );

    try {
      const synthRes = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: allResults }),
      });
      const synthData = await synthRes.json();
      if (synthData.success) {
        dispatch({ type: 'SET_SYNTHESIS', synthesis: synthData.data });
      } else {
        dispatch({ type: 'SET_SYNTHESIS_ERROR', error: 'Summary generation failed. Please try again.' });
      }
    } catch {
      dispatch({ type: 'SET_SYNTHESIS_ERROR', error: 'Summary generation failed. Please try again.' });
    }

    dispatch({ type: 'SET_SYNTHESIZING', value: false });
  }, [state]);

  // ── Render ────────────────────────────────────────────────────────────────

  const showProgress = state.step !== 'input';

  return (
    <main className="min-h-screen bg-[var(--paper-bg)]">
      {showProgress && (
        <ProgressIndicator
          step={state.step}
          onExit={() => dispatch({ type: 'RESET' })}
        />
      )}

      {state.step === 'input' && (
        <HeroInput
          onSubmit={handleStart}
          isLoading={false}
          error={state.error}
          isRateLimited={state.isRateLimited}
        />
      )}

      {state.step === 'extracting' && (
        <div className="section-container">
          <BuildingFocusGroup />
        </div>
      )}

      {state.step === 'selecting-personas' && (
        <PersonaSelector
          personas={state.allPersonas}
          selectedPersonas={state.selectedPersonas}
          onToggle={persona => dispatch({ type: 'TOGGLE_PERSONA', persona })}
          onRunFocusGroup={handleRunFocusGroup}
          onRegenerate={handleRegeneratePanel}
          isRegenerating={isRegenerating}
        />
      )}

      {state.step === 'session' && (
        <SessionPanel
          rounds={state.rounds}
          personas={state.selectedPersonas}
          activeRoundIndex={state.activeRoundIndex}
          currentInterviewIndex={state.currentInterviewIndex}
          isSessionLoading={state.isSessionLoading}
          onAskQuestion={handleAskQuestion}
          onFinish={handleFinish}
        />
      )}

      {state.step === 'results' && (
        <>
          {state.isSynthesizing && !state.synthesis && (
            <div className="section-container">
              <LoadingState message="Synthesizing insights across all your questions..." />
            </div>
          )}

          {!state.isSynthesizing && !state.synthesis && state.synthesisError && (
            <div className="section-container py-16">
              <p className="mb-6 text-base" style={{ color: 'var(--text-secondary)' }}>
                {state.synthesisError}
              </p>
              <button className="btn-primary" onClick={handleFinish}>
                Try Again
              </button>
            </div>
          )}

          {state.synthesis && (
            <>
              <Scorecard
                synthesis={state.synthesis}
                personas={state.selectedPersonas}
                rounds={state.rounds}
              />

              <div className="section-container pb-10">
                <div
                  className="flex flex-col sm:flex-row items-start gap-4 py-4 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <ShareButton
                    userInput={state.userInput}
                    personas={state.selectedPersonas}
                    rounds={state.rounds}
                    synthesis={state.synthesis}
                  />
                  <button
                    className="btn-secondary"
                    onClick={() => dispatch({ type: 'RESET' })}
                  >
                    Start Over
                  </button>
                </div>
              </div>

            </>
          )}
        </>
      )}
    </main>
  );
}
