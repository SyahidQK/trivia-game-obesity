import { useState } from 'react';
import { MAX_NAME_LENGTH } from '../config';
import { sfx } from '../game/sound';
import { Ribbon } from '../components/Ribbon';
import { Screen } from '../components/Screen';

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export function NameEntryScreen({ onSubmit, onBack }: { onSubmit: (name: string) => void; onBack: () => void }) {
  const [name, setName] = useState('');

  const type = (ch: string) => {
    sfx.tap();
    setName((n) => (n.length < MAX_NAME_LENGTH ? n + ch : n));
  };
  const backspace = () => {
    sfx.tap();
    setName((n) => n.slice(0, -1));
  };

  return (
    <Screen>
      <Ribbon top={1640} />
      <h1 className="headline" style={{ marginTop: 220, fontSize: 96 }}>
        What's your name?
      </h1>
      <p className="subhead" style={{ marginTop: 20, fontSize: 38, opacity: 0.85 }}>
        It will appear on the leaderboard
      </p>

      <div className="name-display" style={{ marginTop: 70 }}>
        {name || <span className="placeholder">YOUR NAME</span>}
        <span className="caret" />
      </div>

      <div className="keyboard" style={{ marginTop: 70 }}>
        {ROWS.map((row) => (
          <div className="keyboard-row" key={row}>
            {row.split('').map((ch) => (
              <button key={ch} className="key" onClick={() => type(ch)}>
                {ch}
              </button>
            ))}
          </div>
        ))}
        <div className="keyboard-row">
          <button className="key wide" onClick={() => type(' ')}>
            SPACE
          </button>
          <button className="key action" onClick={backspace} aria-label="Backspace">
            ⌫ DEL
          </button>
        </div>
      </div>

      <div style={{ marginTop: 80, display: 'flex', gap: 30, alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={() => onSubmit(name)}>
          {name.trim() ? "LET'S GO!" : 'PLAY AS GUEST'}
        </button>
      </div>
    </Screen>
  );
}
