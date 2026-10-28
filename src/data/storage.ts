import { del, get, set } from 'idb-keyval';
import type { Question, ScoreEntry, Settings } from '../types';
import { DEFAULT_PIN } from '../config';
import { SEED_QUESTIONS } from './seedQuestions';

// Text data lives in localStorage; images (data URLs) live in IndexedDB because they are too big for it.
const KEYS = {
  questions: 'mof.questions',
  settings: 'mof.settings',
  leaderboard: 'mof.leaderboard',
};
const IMAGE_PREFIX = 'img:';
/** Most recent scores kept for history (a few weeks of busy event days). */
const MAX_LEADERBOARD = 5000;

export const DEFAULT_SETTINGS: Settings = {
  questionsPerGame: 5,
  shuffle: true,
  defaultTimeLimit: 15,
  idleTimeoutSec: 60,
  sound: true,
  music: true,
  pin: DEFAULT_PIN,
  rotation: 0,
};

/** Fixed image slots used by the attract and reveal screens. */
export const IMAGE_SLOTS = {
  attractLeft: 'slot-attract-left',
  attractRight: 'slot-attract-right',
  revealCorrect: 'slot-reveal-correct',
  revealWrong: 'slot-reveal-wrong',
} as const;

function readJson<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : (JSON.parse(raw) as T);
  } catch {
    return undefined;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

// ---- Questions ----

export function loadQuestions(): Question[] {
  const stored = readJson<Question[]>(KEYS.questions);
  return Array.isArray(stored) ? stored : SEED_QUESTIONS;
}

export function saveQuestions(questions: Question[]) {
  writeJson(KEYS.questions, questions);
}

// ---- Settings ----

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...readJson<Partial<Settings>>(KEYS.settings) };
}

export function saveSettings(settings: Settings) {
  writeJson(KEYS.settings, settings);
}

// ---- Leaderboard ----

const byRank = (a: ScoreEntry, b: ScoreEntry) => b.score - a.score || a.date - b.date;

/** Calendar day in the kiosk's local time zone, so the board resets at local midnight. */
export const dayKey = (time: number) => {
  const d = new Date(time);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

function readAll(): ScoreEntry[] {
  const stored = readJson<ScoreEntry[]>(KEYS.leaderboard);
  return Array.isArray(stored) ? stored : [];
}

/**
 * The leaderboard resets daily: 'today' (what players see) holds only scores from the current day.
 * 'all' keeps past days for the admin history view.
 */
export function loadLeaderboard(scope: 'today' | 'all' = 'today', now = Date.now()): ScoreEntry[] {
  const today = dayKey(now);
  const entries = scope === 'all' ? readAll() : readAll().filter((e) => dayKey(e.date) === today);
  return entries.sort(byRank);
}

export function addScore(input: Omit<ScoreEntry, 'id'>) {
  const entry: ScoreEntry = { ...input, id: newId() };
  // Rank against the same day only. Storage keeps the most recent entries (not the highest), so a new low score
  // is never pushed out by older days.
  const all = [...readAll(), entry];
  const day = dayKey(entry.date);
  const rank = all.filter((e) => dayKey(e.date) === day).sort(byRank).indexOf(entry) + 1;
  writeJson(KEYS.leaderboard, all.sort((a, b) => b.date - a.date).slice(0, MAX_LEADERBOARD));
  return { entry, rank };
}

export function clearLeaderboard() {
  writeJson(KEYS.leaderboard, []);
}

// ---- Images ----

export async function saveImage(dataUrl: string, id: string = newId()) {
  await set(IMAGE_PREFIX + id, dataUrl);
  return id;
}

export const getImage = (id: string) => get<string>(IMAGE_PREFIX + id);
export const deleteImage = (id: string) => del(IMAGE_PREFIX + id);

// ---- Backup ----

interface Backup {
  version: 1;
  questions: Question[];
  settings: Settings;
  images: Record<string, string>;
}

export async function exportBackup(): Promise<string> {
  const questions = loadQuestions();
  const ids = [...questions.flatMap((q) => (q.imageId ? [q.imageId] : [])), ...Object.values(IMAGE_SLOTS)];
  const images: Record<string, string> = {};
  for (const id of ids) {
    const data = await getImage(id);
    if (data) images[id] = data;
  }
  const backup: Backup = { version: 1, questions, settings: loadSettings(), images };
  return JSON.stringify(backup);
}

export async function importBackup(json: string) {
  const data = JSON.parse(json) as Partial<Backup>;
  if (data.version !== 1 || !Array.isArray(data.questions)) throw new Error('Not a valid Myth or Fact backup file.');
  for (const [id, url] of Object.entries(data.images ?? {})) await saveImage(url, id);
  saveQuestions(data.questions);
  if (data.settings) saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
}
