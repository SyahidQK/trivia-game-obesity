import { useEffect, useRef, useState } from 'react';
import { getImage } from '../data/storage';

/** Keeps a callback ref fresh so timers never call a stale closure. */
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

/** Runs `callback` once after `ms`. Restarts when `ms` changes; cancelled on unmount. */
export function useTimeout(callback: () => void, ms: number | null) {
  const cb = useLatest(callback);
  useEffect(() => {
    if (ms === null) return;
    const id = window.setTimeout(() => cb.current(), ms);
    return () => window.clearTimeout(id);
  }, [ms, cb]);
}

/** Countdown driven by wall-clock time (startedAt) so it stays accurate even if frames drop. */
export function useCountdown(startedAt: number | null, limitMs: number, onExpire: () => void, onSecond?: (s: number) => void) {
  const [remaining, setRemaining] = useState(limitMs);
  const expire = useLatest(onExpire);
  const second = useLatest(onSecond);

  useEffect(() => {
    if (startedAt === null) return;
    let lastSecond = Math.ceil(limitMs / 1000);
    const tick = () => {
      const left = Math.max(0, limitMs - (performance.now() - startedAt));
      setRemaining(left);
      const s = Math.ceil(left / 1000);
      if (s !== lastSecond) {
        lastSecond = s;
        second.current?.(s);
      }
      if (left <= 0) {
        window.clearInterval(id);
        expire.current();
      }
    };
    const id = window.setInterval(tick, 50);
    tick();
    return () => window.clearInterval(id);
  }, [startedAt, limitMs, expire, second]);

  return remaining;
}

/** Calls `onIdle` after `timeoutMs` without any touch/click/key while enabled. */
export function useIdleReset(timeoutMs: number, onIdle: () => void, enabled: boolean) {
  const cb = useLatest(onIdle);
  useEffect(() => {
    if (!enabled) return;
    let id = window.setTimeout(() => cb.current(), timeoutMs);
    const reset = () => {
      window.clearTimeout(id);
      id = window.setTimeout(() => cb.current(), timeoutMs);
    };
    const events = ['pointerdown', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, reset));
    return () => {
      window.clearTimeout(id);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [timeoutMs, enabled, cb]);
}

/** Loads an uploaded image from IndexedDB, falling back to a bundled asset. */
export function useStoredImage(id: string | undefined, fallback: string) {
  const [src, setSrc] = useState<string>(fallback);
  useEffect(() => {
    let alive = true;
    setSrc(fallback);
    if (id) getImage(id).then((url) => alive && url && setSrc(url));
    return () => {
      alive = false;
    };
  }, [id, fallback]);
  return src;
}
