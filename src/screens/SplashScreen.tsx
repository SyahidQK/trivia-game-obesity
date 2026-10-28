import { motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { useTimeout } from '../game/hooks';
import { Ribbon } from '../components/Ribbon';
import { Screen, pop } from '../components/Screen';

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  durationMs: number;
  onDone: () => void;
  onShow?: () => void;
}

/** Big centred word with the ribbon underneath — used for "QUESTION n" and "TIME'S UP!". */
export function SplashScreen({ title, subtitle, durationMs, onDone, onShow }: Props) {
  useTimeout(onDone, durationMs);
  useEffect(() => {
    onShow?.();
  }, []);

  return (
    <Screen style={{ justifyContent: 'center' }}>
      <Ribbon top={1080} />
      <motion.h1 className="headline" style={{ fontSize: 150, marginTop: -260 }} {...pop}>
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          className="subhead"
          style={{ fontSize: 48, marginTop: 30, color: 'var(--cream)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {subtitle}
        </motion.p>
      )}
    </Screen>
  );
}
