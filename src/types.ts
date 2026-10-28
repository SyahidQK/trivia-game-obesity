export type Answer = 'myth' | 'fact';

export type Rotation = 0 | 90 | 270;

export interface Question {
  id: string;
  statement: string;
  answer: Answer;
  explanation: string;
  /** Source citations, shown in small text on the answer screen. */
  references?: string[];
  /** Key of an uploaded image in IndexedDB, shown on the reveal screen. */
  imageId?: string;
  /** Seconds. Falls back to Settings.defaultTimeLimit when unset. */
  timeLimit?: number;
}

/** A question prepared for one game: time limit resolved. */
export interface GameQuestion extends Question {
  timeLimit: number;
}

export interface Settings {
  questionsPerGame: number;
  shuffle: boolean;
  defaultTimeLimit: number;
  idleTimeoutSec: number;
  sound: boolean;
  music: boolean;
  pin: string;
  /** Draw the game turned 90° for portrait-mounted TVs whose OS only outputs landscape. */
  rotation: Rotation;
}

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  correct: number;
  total: number;
  date: number;
}
