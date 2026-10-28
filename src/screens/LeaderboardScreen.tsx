import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { TIMINGS } from '../config';
import { loadLeaderboard } from '../data/storage';
import { useTimeout } from '../game/hooks';
import { Logo } from '../components/Logo';
import { Screen } from '../components/Screen';

const TOP = 10;

export function LeaderboardScreen({ highlightId, onDone }: { highlightId: string | null; onDone: () => void }) {
  const all = useMemo(() => loadLeaderboard('today'), []);
  const top = all.slice(0, TOP);
  const myIndex = highlightId ? all.findIndex((e) => e.id === highlightId) : -1;
  const meOutsideTop = myIndex >= TOP ? all[myIndex] : null;

  useTimeout(onDone, TIMINGS.leaderboardAutoResetMs);

  const row = (e: (typeof all)[number], rank: number, i: number) => (
    <motion.div
      key={e.id}
      className={`board-row${rank === 1 ? ' top1' : ''}${e.id === highlightId ? ' me' : ''}`}
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.08 * i }}
    >
      <span className="rank">{rank === 1 ? '👑' : `#${rank}`}</span>
      <span>{e.name}</span>
      <span className="score">{e.score.toLocaleString()}</span>
    </motion.div>
  );

  return (
    <Screen>
      <div style={{ marginTop: 110 }}>
        <Logo size={96} inline />
      </div>
      <h1 className="headline" style={{ marginTop: 40, fontSize: 76 }}>
        TODAY'S TOP PLAYERS
      </h1>

      <div className="board" style={{ marginTop: 50 }}>
        {top.length === 0 && <p className="empty-note">No scores yet today — be the first!</p>}
        {top.map((e, i) => row(e, i + 1, i))}
        {meOutsideTop && (
          <>
            <div className="board-gap">• • •</div>
            {row(meOutsideTop, myIndex + 1, TOP)}
          </>
        )}
      </div>

      <button className="btn btn-primary pulse" style={{ position: 'absolute', bottom: 110 }} onClick={onDone}>
        PLAY AGAIN
      </button>
    </Screen>
  );
}
