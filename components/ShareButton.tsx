'use client';

import { useState } from 'react';
import { Persona, QuestionRound, SynthesisResult } from '@/lib/types';

interface ShareButtonProps {
  userInput: string;
  personas: Persona[];
  rounds: QuestionRound[];
  synthesis: SynthesisResult;
}

export default function ShareButton({ userInput, personas, rounds, synthesis }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const buildText = () => {
    const concept = userInput.slice(0, 100) + (userInput.length > 100 ? '...' : '');

    const roundsText = rounds
      .map((round, i) => {
        const responseLines = personas
          .map(persona => {
            const response = round.responses.get(persona.id);
            const scored = round.scoredResponses.find(s => s.personaId === persona.id);
            if (!response) return null;
            return `  ${persona.name} (${scored?.score ?? '?'}/5): "${response.slice(0, 120)}${response.length > 120 ? '...' : ''}"`;
          })
          .filter(Boolean)
          .join('\n');

        return `Q${i + 1}: "${round.question}"\n${responseLines}`;
      })
      .join('\n\n');

    return `YOUR AI FOCUS GROUP — Results

Concept tested: ${concept}

Average Score: ${synthesis.averageScore.toFixed(1)} / 5
Overall: ${synthesis.overallSentiment}

--- SESSION TRANSCRIPT ---
${roundsText}

--- WHAT WORKED ---
${synthesis.whatWorked.map(w => `• ${w}`).join('\n')}

--- CONCERNS ---
${synthesis.whatDidnt.map(w => `• ${w}`).join('\n')}

--- RECOMMENDATION ---
${synthesis.recommendation}

Try it yourself: ${typeof window !== 'undefined' ? window.location.origin : 'https://your-ai-focus-group.vercel.app'}`;
  };

  const handleCopy = async () => {
    const text = buildText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button className="btn-secondary" onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy Results'}
    </button>
  );
}
