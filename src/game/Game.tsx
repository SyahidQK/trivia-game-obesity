import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useReducer } from 'react';
import { TIMINGS } from '../config';
import { addScore, loadQuestions, loadSettings } from '../data/storage';
import { KioskStage } from '../components/KioskStage';
import { screenTransition } from '../components/Screen';
import { AttractScreen } from '../screens/AttractScreen';
import { NameEntryScreen } from '../screens/NameEntryScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { QuestionScreen } from '../screens/QuestionScreen';
import { RevealScreen } from '../screens/RevealScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { gameReducer, initialGameState, isLastQuestion, pickQuestions } from './gameMachine';
import { useIdleReset } from './hooks';
import { lobbyMusic, setMusicEnabled, welcomeMusic } from './music';
import { setSoundEnabled, sfx } from './sound';

export function Game({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  // Read once per mount; the admin page unmounts the game, so edits apply when you return.
  const settings = useMemo(loadSettings, []);
  const pool = useMemo(loadQuestions, []);

  useEffect(() => {
    setSoundEnabled(settings.sound);
    setMusicEnabled(settings.music);
  }, [settings.sound, settings.music]);

  // Music per stage: welcome (start + name), question (played by QuestionScreen), lobby (everything in between).
  const musicStage =
    state.phase === 'attract' || state.phase === 'nameEntry' ? 'welcome' : state.phase === 'question' ? 'question' : 'lobby';
  useEffect(() => {
    if (musicStage === 'welcome') welcomeMusic.play();
    else if (musicStage === 'lobby') lobbyMusic.play();
    else {
      welcomeMusic.stop();
      lobbyMusic.stop();
    }
  }, [musicStage]);
  useEffect(
    () => () => {
      welcomeMusic.stop();
      lobbyMusic.stop();
    },
    [],
  );

  const reset = () => dispatch({ type: 'RESET' });
  useIdleReset(settings.idleTimeoutSec * 1000, reset, state.phase !== 'attract');

  const question = state.questions[state.index];

  const finishOrNext = () => {
    if (!isLastQuestion(state)) return dispatch({ type: 'NEXT' });
    const { entry, rank } = addScore({
      name: state.playerName,
      score: state.score,
      correct: state.correctCount,
      total: state.questions.length,
      date: Date.now(),
    });
    dispatch({ type: 'FINISH', entryId: entry.id, rank });
  };

  const screen = (() => {
    switch (state.phase) {
      case 'attract':
        return (
          <AttractScreen
            canStart={pool.length > 0}
            onAdmin={onOpenAdmin}
            onStart={() => {
              sfx.start();
              dispatch({ type: 'START' });
            }}
          />
        );
      case 'nameEntry':
        return (
          <NameEntryScreen
            onBack={reset}
            onSubmit={(name) => dispatch({ type: 'SUBMIT_NAME', name, questions: pickQuestions(pool, settings) })}
          />
        );
      case 'questionIntro':
        return (
          <SplashScreen
            title={`QUESTION ${state.index + 1}`}
            subtitle={`of ${state.questions.length}`}
            durationMs={TIMINGS.questionIntroMs}
            onShow={sfx.start}
            onDone={() => dispatch({ type: 'INTRO_DONE', now: performance.now() })}
          />
        );
      case 'question':
        return (
          <QuestionScreen
            question={question}
            number={state.index + 1}
            total={state.questions.length}
            score={state.score}
            startedAt={state.questionStartedAt!}
            onAnswer={(answer, at) => dispatch({ type: 'ANSWER', answer, now: at })}
            onTimeout={() => dispatch({ type: 'TIMEOUT' })}
          />
        );
      case 'timesUp':
        return (
          <SplashScreen
            title="TIME'S UP!"
            durationMs={TIMINGS.timesUpMs}
            onShow={sfx.timesUp}
            onDone={() => dispatch({ type: 'TIMES_UP_DONE' })}
          />
        );
      case 'reveal':
        return (
          <RevealScreen
            question={question}
            result={state.lastResult!}
            streak={state.streak}
            isLast={isLastQuestion(state)}
            onNext={finishOrNext}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            name={state.playerName}
            score={state.score}
            correct={state.correctCount}
            total={state.questions.length}
            rank={state.rank}
            onContinue={() => dispatch({ type: 'SHOW_LEADERBOARD' })}
          />
        );
      case 'leaderboard':
        return <LeaderboardScreen highlightId={state.entryId} onDone={reset} />;
    }
  })();

  return (
    <KioskStage rotation={settings.rotation}>
      <AnimatePresence mode="wait">
        <motion.div key={`${state.phase}-${state.index}`} style={{ position: 'absolute', inset: 0 }} {...screenTransition}>
          {screen}
        </motion.div>
      </AnimatePresence>
    </KioskStage>
  );
}
