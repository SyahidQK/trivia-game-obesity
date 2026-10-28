import { useState } from 'react';
import { DEFAULT_IMAGES } from '../config';
import { deleteImage, IMAGE_SLOTS, loadQuestions, loadSettings, saveImage, saveSettings } from '../data/storage';
import type { Rotation, Settings } from '../types';
import { ImagePicker } from './ImagePicker';

const SLOT_LABELS: { key: keyof typeof IMAGE_SLOTS; label: string }[] = [
  { key: 'attractLeft', label: 'Start screen — left character' },
  { key: 'attractRight', label: 'Start screen — right character' },
  { key: 'revealCorrect', label: 'Answer screen — correct answer (e.g. thumbs up)' },
  { key: 'revealWrong', label: 'Answer screen — wrong answer / time up (e.g. X arms)' },
];

const ROTATIONS: { value: Rotation; label: string }[] = [
  { value: 0, label: 'Normal' },
  { value: 90, label: 'Rotate right ↻' },
  { value: 270, label: 'Rotate left ↺' },
];

export function SettingsTab({ onSaved }: { onSaved?: (s: Settings) => void }) {
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);
  // Bumped after a slot upload so ImagePicker re-reads the same slot id.
  const [slotVersion, setSlotVersion] = useState(0);
  const questionCount = loadQuestions().length;

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSaved(false);
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const pinValid = /^\d{4,6}$/.test(settings.pin);

  return (
    <section>
      <form
        className="card form"
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings(settings);
          setSaved(true);
          onSaved?.(settings);
        }}
      >
        <h2>Screen</h2>
        <div className="field">
          Screen rotation
          <div className="segmented">
            {ROTATIONS.map((r) => (
              <button type="button" key={r.value} className={settings.rotation === r.value ? 'active' : ''} onClick={() => set('rotation', r.value)}>
                {r.label}
              </button>
            ))}
          </div>
          <small>
            Use this if the TV is mounted upright (portrait) but the game appears sideways — common on Android TV, which
            can't rotate its own display. Pick the direction that makes the game read upright, then Save.
          </small>
        </div>

        <h2>Game</h2>
        <label>
          Questions per game (you have {questionCount})
          <input type="number" min={1} max={50} value={settings.questionsPerGame} onChange={(e) => set('questionsPerGame', Number(e.target.value))} />
        </label>
        <label className="check">
          <input type="checkbox" checked={settings.shuffle} onChange={(e) => set('shuffle', e.target.checked)} />
          Shuffle questions each game
        </label>
        <label>
          Default time limit per question (seconds)
          <input type="number" min={5} max={60} value={settings.defaultTimeLimit} onChange={(e) => set('defaultTimeLimit', Number(e.target.value))} />
        </label>
        <label>
          Return to start screen after no touch for (seconds)
          <input type="number" min={15} max={600} value={settings.idleTimeoutSec} onChange={(e) => set('idleTimeoutSec', Number(e.target.value))} />
        </label>
        <label className="check">
          <input type="checkbox" checked={settings.sound} onChange={(e) => set('sound', e.target.checked)} />
          Sound effects
        </label>
        <label className="check">
          <input type="checkbox" checked={settings.music} onChange={(e) => set('music', e.target.checked)} />
          Background music (lobby + question tracks)
        </label>

        <h2>Security</h2>
        <label>
          Admin PIN (4–6 digits)
          <input inputMode="numeric" value={settings.pin} onChange={(e) => set('pin', e.target.value.replace(/\D/g, '').slice(0, 6))} />
          {!pinValid && <small className="error">PIN must be 4–6 digits</small>}
        </label>

        <div className="row end">
          {saved && <span className="ok">Saved ✓</span>}
          <button type="submit" className="a-btn a-btn-primary" disabled={!pinValid}>
            Save settings
          </button>
        </div>
      </form>

      <div className="card form">
        <h2>Character images</h2>
        <p className="muted">Transparent PNG/WebP cut-outs look best. Changes apply immediately.</p>
        <div className="slots" key={slotVersion}>
          {SLOT_LABELS.map(({ key, label }) => (
            <div key={key} className="field">
              {label}
              <ImagePicker
                imageId={IMAGE_SLOTS[key]}
                fallback={DEFAULT_IMAGES[key]}
                onPick={async (url) => {
                  await saveImage(url, IMAGE_SLOTS[key]);
                  setSlotVersion((v) => v + 1);
                }}
                onClear={async () => {
                  await deleteImage(IMAGE_SLOTS[key]);
                  setSlotVersion((v) => v + 1);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
