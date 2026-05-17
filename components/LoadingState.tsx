'use client';

interface LoadingStateProps {
  message: string;
}

export default function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-start py-16 gap-3">
      <p
        className="animate-pulse-opacity text-lg"
        style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
      >
        {message}
      </p>
    </div>
  );
}
