import { useEffect, useState, type ReactNode } from 'react';
import { STAGE_HEIGHT, STAGE_WIDTH } from '../config';
import type { Rotation } from '../types';
import { stageTransform } from './stageTransform';

/**
 * Renders a fixed 1080×1920 portrait canvas scaled to fit the screen, so the layout is
 * pixel-identical on the TV and on any test monitor (letterboxed if the aspect differs).
 * `rotation` turns it 90° for portrait-mounted TVs that can only output landscape.
 */
export function KioskStage({ children, rotation = 0 }: { children: ReactNode; rotation?: Rotation }) {
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { transform } = stageTransform(viewport.w, viewport.h, rotation);

  useEffect(() => {
    // Kiosk hardening: no long-press menus or pinch zoom.
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    document.addEventListener('gesturestart', prevent);
    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('gesturestart', prevent);
    };
  }, []);

  return (
    <div className="kiosk-viewport">
      <div
        className="stage"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform,
        }}
      >
        <div className="rays" />
        <div className="grass" />
        {children}
      </div>
    </div>
  );
}
