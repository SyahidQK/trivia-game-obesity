// Synthesized sound effects (Web Audio) — no audio files to ship, works offline.
let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(on: boolean) {
  enabled = on;
}

function audio() {
  if (!enabled) return null;
  ctx ??= new AudioContext();
  // Browsers start the context suspended until a user gesture; every call here follows a tap.
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', volume = 0.25) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

export const sfx = {
  tap: () => tone(660, 0, 0.08, 'triangle', 0.15),
  start: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle')),
  tick: () => tone(1200, 0, 0.05, 'square', 0.06),
  correct: () => [659, 880, 1175].forEach((f, i) => tone(f, i * 0.1, 0.35, 'triangle', 0.3)),
  wrong: () => [330, 247].forEach((f, i) => tone(f, i * 0.18, 0.4, 'sawtooth', 0.12)),
  timesUp: () => [440, 349, 262].forEach((f, i) => tone(f, i * 0.15, 0.3, 'square', 0.1)),
  fanfare: () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.25)),
};
