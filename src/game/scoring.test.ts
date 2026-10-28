import { describe, expect, it } from 'vitest';
import { basePoints, scoreAnswer } from './scoring';

describe('basePoints', () => {
  it('gives 1000 for an instant answer', () => {
    expect(basePoints(0, 15000)).toBe(1000);
  });
  it('gives 500 for an answer at the buzzer', () => {
    expect(basePoints(15000, 15000)).toBe(500);
  });
  it('scales linearly in between', () => {
    expect(basePoints(7500, 15000)).toBe(750);
  });
  it('clamps out-of-range elapsed times', () => {
    expect(basePoints(-50, 15000)).toBe(1000);
    expect(basePoints(99999, 15000)).toBe(500);
  });
});

describe('scoreAnswer', () => {
  it('scores zero and resets the streak when wrong', () => {
    expect(scoreAnswer({ correct: false, elapsedMs: 0, limitMs: 15000, streak: 3 })).toEqual({
      points: 0,
      streak: 0,
    });
  });
  it('gives no bonus on the first correct answer', () => {
    expect(scoreAnswer({ correct: true, elapsedMs: 0, limitMs: 15000, streak: 0 })).toEqual({
      points: 1000,
      streak: 1,
    });
  });
  it('adds 100 per consecutive correct answer', () => {
    expect(scoreAnswer({ correct: true, elapsedMs: 0, limitMs: 15000, streak: 2 })).toEqual({
      points: 1200,
      streak: 3,
    });
  });
  it('caps the streak bonus at 500', () => {
    expect(scoreAnswer({ correct: true, elapsedMs: 0, limitMs: 15000, streak: 20 }).points).toBe(1500);
  });
});
