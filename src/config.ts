/** Design canvas: a 16:9 TV rotated to portrait. Everything is laid out in these pixels, then scaled to fit. */
export const STAGE_WIDTH = 1080;
export const STAGE_HEIGHT = 1920;

/** Admin PIN until it is changed in Admin → Settings. */
export const DEFAULT_PIN = '1234';

/** Hold the top-left corner of the start screen this long to open the admin page. */
export const ADMIN_HOLD_MS = 3000;

export const TIMINGS = {
  questionIntroMs: 1800,
  timesUpMs: 1800,
  revealAutoAdvanceMs: 10000,
  leaderboardAutoResetMs: 20000,
};

export const MAX_NAME_LENGTH = 12;

/** Disclaimer footer shown on the start and results screens. Replace the file (same name) to update it. */
export const DISCLAIMER_IMAGE = 'assets/disclaimer.webp';

/** Background music. Replace the files in public/assets/ (keeping the names) to change the tracks. */
export const MUSIC = {
  /** Looped while a question is on screen, restarting each question. */
  question: { url: 'assets/bgm.mp3', volume: 0.5 },
  /** Looped on the start and name-entry screens, from the beginning for each new visitor. */
  welcome: { url: 'assets/welcome.mp3', volume: 0.5 },
  /** Looped between questions (intro, reveal, results, leaderboard), resuming where it left off. */
  lobby: { url: 'assets/lobby.mp3', volume: 0.4 },
};

export const DEFAULT_IMAGES = {
  attractLeft: 'assets/character-left.webp',
  attractRight: 'assets/character-right.webp',
  revealCorrect: 'assets/character-correct.webp',
  revealWrong: 'assets/character-wrong.webp',
};
