import { describe, expect, it } from 'vitest';
import {
  addScore,
  clearLeaderboard,
  DEFAULT_SETTINGS,
  deleteImage,
  exportBackup,
  getImage,
  importBackup,
  loadLeaderboard,
  loadQuestions,
  loadSettings,
  saveImage,
  saveQuestions,
  saveSettings,
} from './storage';
import { SEED_QUESTIONS } from './seedQuestions';

describe('questions', () => {
  it('seeds questions on first run', () => {
    expect(loadQuestions()).toEqual(SEED_QUESTIONS);
  });

  it('persists saved questions, including an empty list', () => {
    saveQuestions([SEED_QUESTIONS[0]]);
    expect(loadQuestions()).toEqual([SEED_QUESTIONS[0]]);
    saveQuestions([]);
    expect(loadQuestions()).toEqual([]);
  });

  it('falls back to seed data when storage is corrupt', () => {
    localStorage.setItem('mof.questions', '{not json');
    expect(loadQuestions()).toEqual(SEED_QUESTIONS);
  });
});

describe('settings', () => {
  it('returns defaults on first run and persists changes', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    saveSettings({ ...DEFAULT_SETTINGS, sound: false });
    expect(loadSettings().sound).toBe(false);
  });

  it('merges stored values over defaults', () => {
    localStorage.setItem('mof.settings', JSON.stringify({ pin: '9999' }));
    expect(loadSettings()).toEqual({ ...DEFAULT_SETTINGS, pin: '9999' });
  });
});

describe('leaderboard', () => {
  // Local-time dates: 28 Oct 2026 10:00 and 9:00 the day before.
  const TODAY = new Date(2026, 9, 28, 10, 0).getTime();
  const YESTERDAY = new Date(2026, 9, 27, 9, 0).getTime();
  const entry = (name: string, score: number, date = TODAY) => ({ name, score, correct: 1, total: 1, date });

  it('sorts by score and returns the rank of the new entry', () => {
    addScore(entry('A', 500));
    addScore(entry('B', 1500));
    const { rank, entry: saved } = addScore(entry('C', 1000));
    expect(rank).toBe(2);
    expect(loadLeaderboard('today', TODAY).map((e) => e.name)).toEqual(['B', 'C', 'A']);
    expect(saved.id).toBeTruthy();
  });

  it('ranks earlier players first on a tie', () => {
    addScore(entry('First', 800, TODAY));
    expect(addScore(entry('Second', 800, TODAY + 1)).rank).toBe(2);
  });

  it('resets daily: only today’s scores show and count for rank', () => {
    addScore(entry('Yesterday champ', 5000, YESTERDAY));
    const { rank } = addScore(entry('Today', 100));
    expect(rank).toBe(1);
    expect(loadLeaderboard('today', TODAY).map((e) => e.name)).toEqual(['Today']);
  });

  it('starts empty on a new day', () => {
    addScore(entry('Yesterday', 900, YESTERDAY));
    expect(loadLeaderboard('today', TODAY)).toEqual([]);
  });

  it('keeps past days for the admin history view', () => {
    addScore(entry('Yesterday', 900, YESTERDAY));
    addScore(entry('Today', 100));
    expect(loadLeaderboard('all').map((e) => e.name)).toEqual(['Yesterday', 'Today']);
  });

  it('never drops a new low score because older days had high ones', () => {
    for (let i = 0; i < 120; i++) addScore(entry(`Old ${i}`, 9000, YESTERDAY));
    addScore(entry('Low today', 1));
    expect(loadLeaderboard('today', TODAY).map((e) => e.name)).toEqual(['Low today']);
  });

  it('clears', () => {
    addScore(entry('A', 1));
    clearLeaderboard();
    expect(loadLeaderboard('all')).toEqual([]);
  });
});

describe('images and backup', () => {
  it('stores, reads and deletes images', async () => {
    const id = await saveImage('data:image/png;base64,AAAA');
    expect(await getImage(id)).toBe('data:image/png;base64,AAAA');
    await deleteImage(id);
    expect(await getImage(id)).toBeUndefined();
  });

  it('round-trips questions and their images through a backup', async () => {
    const imageId = await saveImage('data:image/png;base64,BBBB');
    saveQuestions([{ ...SEED_QUESTIONS[0], imageId }]);
    const json = await exportBackup();

    saveQuestions([]);
    await deleteImage(imageId);
    await importBackup(json);

    expect(loadQuestions()).toEqual([{ ...SEED_QUESTIONS[0], imageId }]);
    expect(await getImage(imageId)).toBe('data:image/png;base64,BBBB');
  });

  it('rejects an invalid backup', async () => {
    await expect(importBackup('{"foo":1}')).rejects.toThrow();
  });
});
