export const MAX_POINTS = 1000;
export const STREAK_STEP = 100;
export const STREAK_CAP = 500;

/** Kahoot-style speed points: 1000 for an instant answer, falling linearly to 500 at the buzzer. */
export function basePoints(elapsedMs: number, limitMs: number): number {
  const ratio = Math.min(Math.max(elapsedMs / limitMs, 0), 1);
  return Math.round(MAX_POINTS * (1 - ratio / 2));
}

interface AnswerInput {
  correct: boolean;
  elapsedMs: number;
  limitMs: number;
  /** Consecutive correct answers before this one. */
  streak: number;
}

export function scoreAnswer({ correct, elapsedMs, limitMs, streak }: AnswerInput) {
  if (!correct) return { points: 0, streak: 0 };
  const bonus = Math.min(streak * STREAK_STEP, STREAK_CAP);
  return { points: basePoints(elapsedMs, limitMs) + bonus, streak: streak + 1 };
}
