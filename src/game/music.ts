import { MUSIC } from '../config';

// Background tracks: "welcome" on the start/name screens, "question" while answering, and "lobby" between questions.
// They are mutually exclusive and switch with a hard cut, so two tracks are never audible at once.
let musicEnabled = true;
let current: Track | null = null;

class Track {
  private el: HTMLAudioElement | null = null;
  private fade = 0;
  private wanted = false;
  private atSeam = false;
  private retry: (() => void) | null = null;

  constructor(
    private url: string,
    private volume: number,
    /** restart: begin from 0 each play. seamMs: fade out/in around this track's own loop point. */
    private opts: { restart: boolean; seamMs?: number },
  ) {}

  private audio() {
    if (this.el) return this.el;
    const el = new Audio(this.url);
    el.preload = 'auto';
    const seam = this.opts.seamMs;
    el.loop = !seam;
    if (seam) {
      el.addEventListener('timeupdate', () => {
        if (this.wanted && !this.atSeam && el.duration - el.currentTime < seam / 1000) {
          this.atSeam = true;
          this.fadeTo(0, seam);
        }
      });
      el.addEventListener('ended', () => {
        this.atSeam = false;
        if (!this.wanted) return;
        el.currentTime = 0;
        el.play().catch(() => {});
        this.fadeTo(this.volume, seam);
      });
    }
    return (this.el = el);
  }

  private fadeTo(target: number, ms: number) {
    window.clearInterval(this.fade);
    const el = this.el;
    if (!el) return;
    const step = (target - el.volume) / Math.max(1, ms / 30);
    this.fade = window.setInterval(() => {
      const next = el.volume + step;
      if ((step >= 0 && next >= target) || (step < 0 && next <= target)) {
        el.volume = target;
        window.clearInterval(this.fade);
      } else el.volume = next;
    }, 30);
  }

  private clearRetry() {
    if (this.retry) window.removeEventListener('pointerdown', this.retry);
    this.retry = null;
  }

  play() {
    if (!musicEnabled) return;
    if (current && current !== this) current.stop();
    current = this;
    this.wanted = true;
    this.clearRetry();
    const el = this.audio();
    if (this.opts.restart) el.currentTime = 0;
    window.clearInterval(this.fade);
    el.volume = this.volume;
    el.play().catch(() => {
      // Autoplay blocked (no tap yet since the page loaded): start on the first touch instead.
      if (!this.wanted) return;
      this.retry = () => {
        this.retry = null;
        if (this.wanted && current === this) this.play();
      };
      window.addEventListener('pointerdown', this.retry, { once: true });
    });
  }

  /** Hard cut: silence immediately. */
  stop() {
    this.wanted = false;
    this.atSeam = false;
    this.clearRetry();
    window.clearInterval(this.fade);
    if (current === this) current = null;
    this.el?.pause();
  }
}

export const questionMusic = new Track(MUSIC.question.url, MUSIC.question.volume, { restart: true });
export const lobbyMusic = new Track(MUSIC.lobby.url, MUSIC.lobby.volume, { restart: false, seamMs: 1500 });
export const welcomeMusic = new Track(MUSIC.welcome.url, MUSIC.welcome.volume, { restart: true, seamMs: 1500 });

export function setMusicEnabled(on: boolean) {
  musicEnabled = on;
  if (!on) {
    questionMusic.stop();
    lobbyMusic.stop();
    welcomeMusic.stop();
  }
}
