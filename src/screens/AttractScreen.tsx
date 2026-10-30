import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ADMIN_HOLD_MS, APPROVAL_CODE, DEFAULT_IMAGES } from '../config';
import { IMAGE_SLOTS } from '../data/storage';
import { useStoredImage } from '../game/hooks';
import { Disclaimer } from '../components/Disclaimer';
import { Logo } from '../components/Logo';
import { Ribbon } from '../components/Ribbon';
import { Screen, pop } from '../components/Screen';

interface Props {
  canStart: boolean;
  onStart: () => void;
  onAdmin: () => void;
}

export function AttractScreen({ canStart, onStart, onAdmin }: Props) {
  const left = useStoredImage(IMAGE_SLOTS.attractLeft, DEFAULT_IMAGES.attractLeft);
  const right = useStoredImage(IMAGE_SLOTS.attractRight, DEFAULT_IMAGES.attractRight);
  const holdTimer = useRef<number>();

  const startHold = () => {
    holdTimer.current = window.setTimeout(onAdmin, ADMIN_HOLD_MS);
  };
  const cancelHold = () => window.clearTimeout(holdTimer.current);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  };

  return (
    <Screen>
      {/* Hidden admin entry: press and hold the top-left corner. */}
      <div
        className="admin-hotspot"
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
      />
      <button className="fullscreen-btn btn" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
        ⛶
      </button>

      {/* The photos carry their own ribbons, so only one background ribbon sits behind them. */}
      <Ribbon top={1330} />
      <motion.img
        className="attract-character left"
        src={left}
        alt=""
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      />
      <motion.img
        className="attract-character right"
        src={right}
        alt=""
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.7 }}
      />

      <motion.div style={{ marginTop: 110 }} {...pop}>
        <Logo size={235} />
      </motion.div>

      <motion.div
        style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 8 }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="subhead" style={{ fontSize: 54, color: 'var(--yellow)' }}>
          Ready to Challenge
        </p>
        <p className="subhead" style={{ fontSize: 54 }}>
          What You Know About Health?
        </p>
      </motion.div>

      <div style={{ marginTop: 40, position: 'relative', zIndex: 2 }}>
        {canStart ? (
          <button className="btn btn-primary pulse" onClick={onStart}>
            START
          </button>
        ) : (
          <p className="subhead" style={{ fontSize: 36, opacity: 0.8 }}>
            No questions yet — add some in the admin page.
          </p>
        )}
      </div>
      {canStart && (
        <p className="subhead" style={{ marginTop: 34, fontSize: 32, opacity: 0.85, position: 'relative', zIndex: 2 }}>
          Tap START to play
        </p>
      )}
      <Disclaimer />
      <p className="approval-code">{APPROVAL_CODE}</p>
    </Screen>
  );
}
