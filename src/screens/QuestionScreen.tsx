import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Answer, GameQuestion } from '../types';
import { useCountdown, useTimeout } from '../game/hooks';
import { questionMusic } from '../game/music';
import { sfx } from '../game/sound';
import { Logo } from '../components/Logo';
import { Ribbon } from '../components/Ribbon';
import { Screen } from '../components/Screen';
import { TimerRing } from '../components/TimerRing';

interface Props {
  question: GameQuestion;
  number: number;
  total: number;
  score: number;
  startedAt: number;
  onAnswer: (answer: Answer, at: number) => void;
  onTimeout: () => void;
}

const LOCK_IN_MS = 550;

export function QuestionScreen({ question, number, total, score, startedAt, onAnswer, onTimeout }: Props) {
  const [chosen, setChosen] = useState<{ answer: Answer; at: number } | null>(null);
  const limitMs = question.timeLimit * 1000;

  // Music plays only while the player is deciding; it fades out on answer, timeout or idle reset (unmount).
  useEffect(() => {
    questionMusic.play();
    return () => questionMusic.stop();
  }, []);
  useEffect(() => {
    if (chosen) questionMusic.stop();
  }, [chosen]);

  const remaining = useCountdown(chosen ? null : startedAt, limitMs, onTimeout, (s) => {
    if (s <= 5 && s > 0) sfx.tick();
  });

  // Brief "locked in" highlight before revealing, like Kahoot.
  useTimeout(() => chosen && onAnswer(chosen.answer, chosen.at), chosen ? LOCK_IN_MS : null);

  const choose = (answer: Answer) => {
    if (chosen) return;
    sfx.tap();
    setChosen({ answer, at: performance.now() });
  };

  const stateClass = (a: Answer) => (chosen ? (chosen.answer === a ? ' chosen' : ' dimmed') : '');

  return (
    <Screen>
      <Ribbon top={1650} />
      <div className="hud">
        <span className="chip">
          Question <strong>{number}</strong> / {total}
        </span>
        <span className="chip">
          Score <strong>{score.toLocaleString()}</strong>
        </span>
      </div>

      <div style={{ marginTop: 170 }}>
        <Logo size={96} inline />
      </div>

      <motion.div
        className="question-card"
        style={{ marginTop: 50 }}
        initial={{ y: 60, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        {question.statement}
      </motion.div>

      <div style={{ marginTop: 50 }}>
        <TimerRing remainingMs={remaining} limitMs={limitMs} />
      </div>

      <div className="answer-grid" style={{ marginTop: 50 }}>
        <motion.button
          className={`answer-btn myth${stateClass('myth')}`}
          onClick={() => choose('myth')}
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 20 }}
        >
          <span className="icon">✕</span>
          MYTH
        </motion.button>
        <motion.button
          className={`answer-btn fact${stateClass('fact')}`}
          onClick={() => choose('fact')}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 20 }}
        >
          <span className="icon">✓</span>
          FACT
        </motion.button>
      </div>
    </Screen>
  );
}
