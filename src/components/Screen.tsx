import type { CSSProperties, ReactNode } from 'react';

/** Full-stage screen. Enter/exit transitions are applied by the parent AnimatePresence wrapper. */
export function Screen({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="screen" style={style}>
      {children}
    </div>
  );
}

export const screenTransition = {
  initial: { opacity: 0, scale: 1.04 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.3, ease: 'easeOut' },
} as const;

/** Spring "pop" used for headline elements. */
export const pop = {
  initial: { scale: 0.4, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 260, damping: 16 },
} as const;
