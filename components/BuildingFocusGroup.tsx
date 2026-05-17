'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  { text: 'Analyzing your concept...', minMs: 0 },
  { text: 'Identifying the right consumer segments...', minMs: 4000 },
  { text: 'Building your focus group panel...', minMs: 8000 },
  { text: 'Crafting 10 distinct personas...', minMs: 14000 },
  { text: 'Almost ready...', minMs: 22000 },
];

export default function BuildingFocusGroup() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    MESSAGES.forEach((msg, i) => {
      if (i === 0) return;
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          setMessageIndex(i);
          setVisible(true);
        }, 400);
      }, msg.minMs);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      {/* Pulsing dots */}
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse-opacity"
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--teal)',
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* Rotating message */}
      <p
        className="text-lg max-w-sm transition-opacity duration-400"
        style={{
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          opacity: visible ? 1 : 0,
        }}
      >
        {MESSAGES[messageIndex].text}
      </p>

      {/* Timing hint */}
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        This takes about 15–20 seconds
      </p>

      {/* Subtle persona silhouette hint */}
      <div
        className="animate-pulse-opacity"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '2px dashed var(--teal)',
          opacity: 0.35,
          animationDelay: '0.5s',
        }}
      />
    </div>
  );
}
