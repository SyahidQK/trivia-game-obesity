import type { Answer, GameQuestion, Question, Settings } from '../types';
import { scoreAnswer } from './scoring';

export type Phase =
  | 'attract'
  | 'nameEntry'
  | 'questionIntro'
  | 'question'
  | 'timesUp'
  | 'reveal'
  | 'results'
  | 'leaderboard';

export interface AnswerResult {
  /** null when the timer ran out. */
  answer: Answer | null;
  correct: boolean;
  points: number;
}

export interface GameState {
  phase: Phase;
  playerName: string;
  questions: GameQuestion[];
  index: number;
  score: number;
  streak: number;
  correctCount: number;
  questionStartedAt: number | null;
  lastResult: AnswerResult | null;
  entryId: string | null;
  rank: number | null;
}

export type GameEvent =
  | { type: 'START' }
  | { type: 'SUBMIT_NAME'; name: string; questions: GameQuestion[] }
  | { type: 'INTRO_DONE'; now: number }
  | { type: 'ANSWER'; answer: Answer; now: number }
  | { type: 'TIMEOUT' }
  | { type: 'TIMES_UP_DONE' }
  | { type: 'NEXT' }
  | { type: 'FINISH'; entryId: string; rank: number }
  | { type: 'SHOW_LEADERBOARD' }
  | { type: 'RESET' };

export const initialGameState: GameState = {
  phase: 'attract',
  playerName: '',
  questions: [],
  index: 0,
  score: 0,
  streak: 0,
  correctCount: 0,
  questionStartedAt: null,
  lastResult: null,
  entryId: null,
  rank: null,
};

export function pickQuestions(pool: Question[], settings: Settings, rng: () => number = Math.random): GameQuestion[] {
  const list = [...pool];
  if (settings.shuffle) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  return list
    .slice(0, Math.max(1, settings.questionsPerGame))
    .map((q) => ({ ...q, timeLimit: q.timeLimit ?? settings.defaultTimeLimit }));
}

export function isLastQuestion(s: GameState) {
  return s.index >= s.questions.length - 1;
}

export function gameReducer(s: GameState, e: GameEvent): GameState {
  switch (e.type) {
    case 'START':
      return s.phase === 'attract' ? { ...initialGameState, phase: 'nameEntry' } : s;

    case 'SUBMIT_NAME':
      if (s.phase !== 'nameEntry' || e.questions.length === 0) return s;
      return {
        ...s,
        phase: 'questionIntro',
        playerName: e.name.trim() || 'Player',
        questions: e.questions,
        index: 0,
      };

    case 'INTRO_DONE':
      return s.phase === 'questionIntro' ? { ...s, phase: 'question', questionStartedAt: e.now } : s;

    case 'ANSWER': {
      if (s.phase !== 'question') return s;
      const q = s.questions[s.index];
      const correct = e.answer === q.answer;
      const { points, streak } = scoreAnswer({
        correct,
        elapsedMs: e.now - (s.questionStartedAt ?? e.now),
        limitMs: q.timeLimit * 1000,
        streak: s.streak,
      });
      return {
        ...s,
        phase: 'reveal',
        score: s.score + points,
        streak,
        correctCount: s.correctCount + (correct ? 1 : 0),
        lastResult: { answer: e.answer, correct, points },
      };
    }

    case 'TIMEOUT':
      if (s.phase !== 'question') return s;
      return { ...s, phase: 'timesUp', streak: 0, lastResult: { answer: null, correct: false, points: 0 } };

    case 'TIMES_UP_DONE':
      return s.phase === 'timesUp' ? { ...s, phase: 'reveal' } : s;

    case 'NEXT':
      if (s.phase !== 'reveal' || isLastQuestion(s)) return s;
      return { ...s, phase: 'questionIntro', index: s.index + 1, lastResult: null, questionStartedAt: null };

    case 'FINISH':
      return s.phase === 'reveal' ? { ...s, phase: 'results', entryId: e.entryId, rank: e.rank } : s;

    case 'SHOW_LEADERBOARD':
      return s.phase === 'results' ? { ...s, phase: 'leaderboard' } : s;

    case 'RESET':
      return initialGameState;
  }
}
