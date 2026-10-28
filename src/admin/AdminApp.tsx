import { useEffect, useState, type CSSProperties } from 'react';
import type { Rotation } from '../types';
import { loadSettings } from '../data/storage';
import { KioskStage } from '../components/KioskStage';
import { Logo } from '../components/Logo';
import { Screen } from '../components/Screen';
import { QuestionsTab } from './QuestionsTab';
import { SettingsTab } from './SettingsTab';
import { LeaderboardTab } from './LeaderboardTab';
import { BackupTab } from './BackupTab';

const TABS = ['Questions', 'Settings', 'Leaderboard', 'Backup'] as const;
type Tab = (typeof TABS)[number];

function PinGate({ onUnlock, onExit }: { onUnlock: () => void; onExit: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { pin: expected, rotation } = loadSettings();

  const press = (d: string) => {
    setError(false);
    setPin((p) => (p + d).slice(0, expected.length));
  };

  // Check once the last digit lands (functional updates keep fast taps from being lost).
  useEffect(() => {
    if (pin.length < expected.length) return;
    if (pin === expected) return onUnlock();
    setError(true);
    setPin('');
  }, [pin, expected, onUnlock]);

  return (
    <KioskStage rotation={rotation}>
      <Screen>
        <div style={{ marginTop: 200 }}>
          <Logo size={110} inline />
        </div>
        <h1 className="headline" style={{ marginTop: 70, fontSize: 80 }}>
          Admin PIN
        </h1>
        <div className={`pin-dots${error ? ' shake' : ''}`} style={{ marginTop: 60 }}>
          {Array.from({ length: expected.length }, (_, i) => (
            <span key={i} className={i < pin.length ? 'filled' : ''} />
          ))}
        </div>
        <p className="subhead" style={{ marginTop: 30, fontSize: 36, minHeight: 50, color: 'var(--yellow)' }}>
          {error ? 'Wrong PIN — try again' : ''}
        </p>
        <div className="pin-pad" style={{ marginTop: 40 }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button key={d} className="key" onClick={() => press(d)}>
              {d}
            </button>
          ))}
          <button className="key action" onClick={onExit}>
            EXIT
          </button>
          <button className="key" onClick={() => press('0')}>
            0
          </button>
          <button className="key action" onClick={() => setPin((p) => p.slice(0, -1))}>
            ⌫
          </button>
        </div>
      </Screen>
    </KioskStage>
  );
}

/** Turns the whole admin page to match the game's rotation setting, so it isn't sideways on a rotated TV. */
function rotatedPageStyle(rotation: Rotation): CSSProperties | undefined {
  if (rotation === 0) return undefined;
  return {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vh',
    height: '100vw',
    transformOrigin: 'top left',
    transform: rotation === 90 ? 'translateX(100vw) rotate(90deg)' : 'translateY(100vh) rotate(-90deg)',
  };
}

export function AdminApp({ onExit }: { onExit: () => void }) {
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<Tab>('Questions');
  // Re-read after Settings are saved so a rotation change applies straight away.
  const [rotation, setRotation] = useState(() => loadSettings().rotation);

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} onExit={onExit} />;

  return (
    <div className="admin" style={rotatedPageStyle(rotation)}>
      <header className="admin-header">
        <Logo size={44} inline />
        <span className="admin-title">Admin</span>
        <button className="a-btn a-btn-primary" onClick={onExit}>
          ▶ Back to game
        </button>
      </header>
      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>
      <main className="admin-body">
        {tab === 'Questions' && <QuestionsTab />}
        {tab === 'Settings' && <SettingsTab onSaved={(s) => setRotation(s.rotation)} />}
        {tab === 'Leaderboard' && <LeaderboardTab />}
        {tab === 'Backup' && <BackupTab />}
      </main>
    </div>
  );
}
