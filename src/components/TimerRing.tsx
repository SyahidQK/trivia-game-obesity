const R = 100;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function TimerRing({ remainingMs, limitMs }: { remainingMs: number; limitMs: number }) {
  const fraction = Math.max(0, remainingMs / limitMs);
  const seconds = Math.ceil(remainingMs / 1000);
  const urgent = seconds <= 5;
  return (
    <div className={`timer-ring${urgent ? ' urgent' : ''}`} role="timer" aria-label={`${seconds} seconds left`}>
      <svg viewBox="0 0 230 230">
        <circle cx="115" cy="115" r={R + 6} fill="#fff4d6" />
        <circle cx="115" cy="115" r={R} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="16" />
        <circle
          cx="115"
          cy="115"
          r={R}
          fill="none"
          stroke={urgent ? '#9b1c1c' : '#f5c842'}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        />
      </svg>
      <div className="label" style={{ color: urgent ? '#9b1c1c' : undefined }}>
        0:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}
