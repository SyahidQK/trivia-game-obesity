import { describe, expect, it } from 'vitest';
import { gameReducer, initialGameState, pickQuestions, type GameState } from './gameMachine';
import type { GameQuestion, Question, Settings } from '../types';

const q = (id: string, answer: 'myth' | 'fact' = 'myth'): GameQuestion => ({
  id,
  statement: `Statement ${id}`,
  answer,
  explanation: '',
  timeLimit: 10,
});

const settings: Settings = {
  questionsPerGame: 2,
  shuffle: false,
  defaultTimeLimit: 15,
  idleTimeoutSec: 60,
  sound: false,
  music: false,
  pin: '0000',
  rotation: 0,
};

function startGame(questions: GameQuestion[] = [q('a'), q('b', 'fact')]): GameState {
  let s = gameReducer(initialGameState, { type: 'START' });
  s = gameReducer(s, { type: 'SUBMIT_NAME', name: '  Amir  ', questions });
  return s;
}

describe('pickQuestions', () => {
  const pool: Question[] = [
    { id: '1', statement: '', answer: 'myth', explanation: '' },
    { id: '2', statement: '', answer: 'fact', explanation: '', timeLimit: 30 },
    { id: '3', statement: '', answer: 'myth', explanation: '' },
  ];

  it('takes the first N in order when shuffle is off and resolves time limits', () => {
    const picked = pickQuestions(pool, settings);
    expect(picked.map((p) => p.id)).toEqual(['1', '2']);
    expect(picked.map((p) => p.timeLimit)).toEqual([15, 30]);
  });

  it('shuffles with the given rng when shuffle is on', () => {
    const picked = pickQuestions(pool, { ...settings, shuffle: true, questionsPerGame: 3 }, () => 0);
    expect(picked.map((p) => p.id).sort()).toEqual(['1', '2', '3']);
    expect(picked.map((p) => p.id)).not.toEqual(['1', '2', '3']);
  });

  it('never returns more questions than exist', () => {
    expect(pickQuestions(pool, { ...settings, questionsPerGame: 99 })).toHaveLength(3);
  });
});

describe('gameReducer', () => {
  it('goes attract → nameEntry → questionIntro with a trimmed name', () => {
    const s = startGame();
    expect(s.phase).toBe('questionIntro');
    expect(s.playerName).toBe('Amir');
    expect(s.index).toBe(0);
  });

  it('defaults an empty name to Player', () => {
    let s = gameReducer(initialGameState, { type: 'START' });
    s = gameReducer(s, { type: 'SUBMIT_NAME', name: '   ', questions: [q('a')] });
    expect(s.playerName).toBe('Player');
  });

  it('records the question start time when the intro finishes', () => {
    const s = gameReducer(startGame(), { type: 'INTRO_DONE', now: 1000 });
    expect(s.phase).toBe('question');
    expect(s.questionStartedAt).toBe(1000);
  });

  it('scores a correct answer by speed and moves to reveal', () => {
    let s = gameReducer(startGame(), { type: 'INTRO_DONE', now: 1000 });
    s = gameReducer(s, { type: 'ANSWER', answer: 'myth', now: 1000 });
    expect(s.phase).toBe('reveal');
    expect(s.score).toBe(1000);
    expect(s.correctCount).toBe(1);
    expect(s.streak).toBe(1);
    expect(s.lastResult).toEqual({ answer: 'myth', correct: true, points: 1000 });
  });

  it('scores zero for a wrong answer', () => {
    let s = gameReducer(startGame(), { type: 'INTRO_DONE', now: 0 });
    s = gameReducer(s, { type: 'ANSWER', answer: 'fact', now: 2000 });
    expect(s.score).toBe(0);
    expect(s.lastResult).toEqual({ answer: 'fact', correct: false, points: 0 });
  });

  it('ignores a second tap after answering', () => {
    let s = gameReducer(startGame(), { type: 'INTRO_DONE', now: 0 });
    s = gameReducer(s, { type: 'ANSWER', answer: 'myth', now: 0 });
    const again = gameReducer(s, { type: 'ANSWER', answer: 'fact', now: 0 });
    expect(again).toBe(s);
  });

  it('handles a timeout via the timesUp screen', () => {
    let s = gameReducer(startGame(), { type: 'INTRO_DONE', now: 0 });
    s = gameReducer(s, { type: 'TIMEOUT' });
    expect(s.phase).toBe('timesUp');
    expect(s.lastResult).toEqual({ answer: null, correct: false, points: 0 });
    s = gameReducer(s, { type: 'TIMES_UP_DONE' });
    expect(s.phase).toBe('reveal');
  });

  it('advances to the next question, then to results after the last', () => {
    let s = gameReducer(startGame(), { type: 'INTRO_DONE', now: 0 });
    s = gameReducer(s, { type: 'ANSWER', answer: 'myth', now: 0 });
    s = gameReducer(s, { type: 'NEXT' });
    expect(s.phase).toBe('questionIntro');
    expect(s.index).toBe(1);
    s = gameReducer(s, { type: 'INTRO_DONE', now: 0 });
    s = gameReducer(s, { type: 'ANSWER', answer: 'fact', now: 0 });
    expect(s.score).toBe(2100); // 1000 + 1000 + 100 streak bonus
    s = gameReducer(s, { type: 'FINISH', entryId: 'e1', rank: 3 });
    expect(s.phase).toBe('results');
    expect(s.entryId).toBe('e1');
    expect(s.rank).toBe(3);
  });

  it('goes results → leaderboard → attract and resets the game', () => {
    let s: GameState = { ...startGame(), phase: 'results', score: 500 };
    s = gameReducer(s, { type: 'SHOW_LEADERBOARD' });
    expect(s.phase).toBe('leaderboard');
    s = gameReducer(s, { type: 'RESET' });
    expect(s).toEqual(initialGameState);
  });
});
