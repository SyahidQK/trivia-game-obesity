import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTimeout } from '../game/hooks';
import { sfx } from '../game/sound';
import { Disclaimer } from '../components/Disclaimer';
import { Ribbon } from '../components/Ribbon';
import { Screen, pop } from '../components/Screen';

interface Props {
  name: string;
  score: number;
  correct: number;
  total: number;
  rank: number | null;
  onContinue: () => void;
}

const AUTO_CONTINUE_MS = 12000;

function message(ratio: number) {
  if (ratio === 1) return 'Health Hero';
  if (ratio >= 0.7) return 'Great job';
  if (ratio >= 0.4) return 'Nice try';
  return 'Keep learning';
}

export function ResultsScreen({ name, score, correct, total, rank, onContinue }: Props) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    sfx.fanfare();
    const controls = animate(0, score, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [score]);

  useTimeout(onContinue, AUTO_CONTINUE_MS);

  return (
    <Screen>
      <Ribbon top={1500} />
      <motion.h1 className="headline" style={{ marginTop: 260, fontSize: 100 }} {...pop}>
        {message(correct / total)},
        <br />
        <span style={{ color: 'var(--cream)' }}>{name}!</span>
      </motion.h1>

      <p className="subhead" style={{ marginTop: 90, fontSize: 40, letterSpacing: '0.12em', color: 'var(--cream)' }}>
        YOUR SCORE
      </p>
      <div className="score-big">{shown.toLocaleString()}</div>

      <div className="stat-row" style={{ marginTop: 70 }}>
        <div className="stat">
          <div className="value">
            {correct}/{total}
          </div>
          <div className="name">Correct</div>
        </div>
        {rank !== null && (
          <div className="stat">
            <div className="value">#{rank}</div>
            <div className="name">Rank</div>
          </div>
        )}
      </div>

      <button className="btn btn-primary" style={{ marginTop: 100, position: 'relative', zIndex: 2 }} onClick={onContinue}>
        LEADERBOARD
      </button>
      <Disclaimer />
    </Screen>
  );
}
