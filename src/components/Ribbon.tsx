import { motion } from 'framer-motion';

/** The flowing yellow ribbon from the mockup, anchored at a given distance from the stage top. */
export function Ribbon({ top, flip = false }: { top: number; flip?: boolean }) {
  return (
    <motion.svg
      className="ribbon"
      style={{ top, scaleX: flip ? -1 : 1 }}
      viewBox="0 0 1080 360"
      height={360}
      preserveAspectRatio="none"
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <defs>
        <linearGradient id="ribbon-a" x1="0" x2="1">
          <stop offset="0" stopColor="#e0a91b" />
          <stop offset="0.5" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#f5c842" />
        </linearGradient>
        <linearGradient id="ribbon-b" x1="0" x2="1">
          <stop offset="0" stopColor="#f5c842" />
          <stop offset="1" stopColor="#c98f0f" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 210 C 220 120, 420 300, 640 200 S 960 110, 1080 170 L 1080 215 C 960 160, 820 250, 640 250 S 220 170, 0 260 Z"
        fill="url(#ribbon-b)"
        opacity={0.75}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M0 150 C 260 60, 460 260, 700 170 S 980 80, 1080 120 L 1080 190 C 960 150, 860 240, 700 240 S 260 120, 0 220 Z"
        fill="url(#ribbon-a)"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}
