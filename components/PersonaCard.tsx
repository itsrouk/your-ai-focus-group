'use client';

import { useState } from 'react';
import { Persona } from '@/lib/types';

const AVATAR_COLORS = [
  '#5B8A72', '#1DA8C0', '#C0823E', '#7C6A9A', '#C0714F',
  '#4A7FA5', '#A0826D', '#6B8E4E', '#B07BA8', '#5E8B7E',
];

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  onToggle: (persona: Persona) => void;
  selectionDisabled: boolean;
  variant?: 'default' | 'prominent';  // kept for compat with PersonaSelector
}

export default function PersonaCard({
  persona,
  isSelected,
  onToggle,
  selectionDisabled,
}: PersonaCardProps) {
  const avatarColor = getAvatarColor(persona.name);
  const disabled = !isSelected && selectionDisabled;
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="w-full transition-all"
      style={{
        background: isSelected ? 'rgba(29,168,192,0.06)' : 'var(--surface)',
        border: `${isSelected ? '2px' : '1px'} solid ${isSelected ? 'var(--teal)' : '#e5e7eb'}`,
        borderRadius: '0.5rem',
        boxShadow: isSelected ? 'var(--shadow-raised)' : 'var(--shadow-card)',
        opacity: disabled ? 0.4 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        className="w-full text-left focus:outline-none focus-visible:ring-1"
        style={{
          padding: '1.25rem',
          background: 'transparent',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          minHeight: '48px',
          position: 'relative',
        }}
        onClick={() => !disabled && onToggle(persona)}
        aria-pressed={isSelected}
        aria-label={`${isSelected ? 'Deselect' : 'Select'} ${persona.name}`}
        disabled={disabled}
      >
        {/* Selection indicator bar */}
        {isSelected && (
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: 'var(--teal)' }}
            aria-hidden="true"
          />
        )}

        {/* Checkmark badge top-right when selected */}
        {isSelected && (
          <div
            className="absolute top-2 right-2 flex items-center justify-center"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'var(--teal)',
            }}
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        <div className="flex items-start gap-3" style={{ marginTop: isSelected ? '0.25rem' : 0 }}>
          {/* Avatar initial in colored circle — 44px */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{ backgroundColor: avatarColor, fontFamily: 'var(--font-mono)' }}
            aria-hidden="true"
          >
            {persona.name[0]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className="font-semibold text-base leading-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
              >
                {persona.name}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {persona.age}
              </span>
            </div>
            <p className="text-sm mt-0.5 font-medium" style={{ color: 'var(--teal)' }}>
              {persona.occupation}
            </p>
            <p
              className="text-sm mt-2 leading-snug line-clamp-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              {persona.personality}
            </p>
          </div>
        </div>
      </button>

      {/* Why this persona? disclosure */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle, #eef0f2)',
          padding: '0.5rem 1.25rem 0.75rem',
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(v => !v);
          }}
          aria-expanded={expanded}
          aria-controls={`persona-why-${persona.id}`}
          className="focus:outline-none focus-visible:ring-1"
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.25rem 0',
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
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}
          >
            <path d="M3 1.5L6.5 5L3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {expanded ? 'Hide details' : 'Why this persona?'}
        </button>

        {expanded && (
          <div
            id={`persona-why-${persona.id}`}
            style={{
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
            }}
          >
            <PersonaTrait label="Goals" value={persona.goals} />
            <PersonaTrait label="Fears" value={persona.fears} />
            <PersonaTrait label="How they react" value={persona.emotionalTendencies} />
          </div>
        )}
      </div>
    </div>
  );
}

function PersonaTrait({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p
        style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          marginBottom: '0.125rem',
        }}
      >
        {label}
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>{value}</p>
    </div>
  );
}
