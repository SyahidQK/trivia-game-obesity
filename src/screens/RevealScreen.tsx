import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { DEFAULT_IMAGES, TIMINGS } from '../config';
import { IMAGE_SLOTS } from '../data/storage';
import type { AnswerResult } from '../game/gameMachine';
import { useStoredImage, useTimeout } from '../game/hooks';
import { sfx } from '../game/sound';
import type { GameQuestion } from '../types';
import { CheckIcon, CrossIcon } from '../components/Icons';
import { Ribbon } from '../components/Ribbon';
import { Screen, pop } from '../components/Screen';

interface Props {
  question: GameQuestion;
  result: AnswerResult;
  streak: number;
  isLast: boolean;
  onNext: () => void;
}

export function RevealScreen({ question, result, streak, isLast, onNext }: Props) {
  // Thumbs-up character for a correct answer; X character for wrong or time up. A per-question image overrides both.
  const slot = result.correct ? 'revealCorrect' : 'revealWrong';
  const character = useStoredImage(IMAGE_SLOTS[slot], DEFAULT_IMAGES[slot]);
  const image = useStoredImage(question.imageId, character);
  const advanced = useRef(false);

  const next = () => {
    if (advanced.current) return; // guard against double taps / timer racing a tap
    advanced.current = true;
    onNext();
  };
  useTimeout(next, TIMINGS.revealAutoAdvanceMs);

  useEffect(() => {
    if (result.correct) sfx.correct();
    else if (result.answer) sfx.wrong();
  }, [result]);

  const label = result.correct ? 'You Got It!' : result.answer ? 'Not Quite!' : "Time's Up!";

  return (
    <Screen>
      <motion.div className={`badge${result.correct ? '' : ' wrong'}`} style={{ marginTop: 90 }} {...pop}>
        <div className="badge-circle">{result.correct ? <CheckIcon /> : <CrossIcon />}</div>
        <div className="badge-label">{label}</div>
      </motion.div>

      <motion.div
        className="reveal-answer"
        style={{ marginTop: 40, textAlign: 'center' }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <small>IT'S A</small>
        {question.answer.toUpperCase()}
      </motion.div>

      <motion.p className="explanation" style={{ marginTop: 30 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        {question.explanation}
      </motion.p>

      {question.references && question.references.length > 0 && (
        <motion.ol className="references" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          {question.references.map((ref, i) => (
            <li key={i}>{ref}</li>
          ))}
        </motion.ol>
      )}

      <motion.div className="points-pop" style={{ marginTop: 30 }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
        {result.points > 0 ? `+${result.points.toLocaleString()} pts` : '+0 pts'}
        {result.correct && streak > 1 && <span style={{ color: 'var(--cream)', fontSize: 40 }}> · 🔥 {streak} in a row</span>}
      </motion.div>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, position: 'relative', zIndex: 2 }}>
        <button className="btn btn-primary" onClick={next}>
          {isLast ? 'SEE RESULTS' : 'NEXT'}
        </button>
        <div className="autoadvance">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: TIMINGS.revealAutoAdvanceMs / 1000, ease: 'linear' }}
          />
        </div>
      </div>

      <Ribbon top={1490} />
      {/* Fills only the space left under the button, so the character can never cover it. */}
      <div className="reveal-image-wrap">
        <motion.div
          className="reveal-figure"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <img className="reveal-image" src={image} alt="" />
        </motion.div>
      </div>
      <Ribbon top={1640} flip />
    </Screen>
  );
}
