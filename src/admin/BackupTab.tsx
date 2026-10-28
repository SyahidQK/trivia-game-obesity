import { useRef, useState } from 'react';
import { exportBackup, importBackup, saveQuestions } from '../data/storage';
import { SEED_QUESTIONS } from '../data/seedQuestions';

export function BackupTab() {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const download = async () => {
    const blob = new Blob([await exportBackup()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `myth-or-fact-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="card form">
      <h2>Backup &amp; restore</h2>
      <p className="muted">
        Questions, settings and images are stored in this browser on this device. Export a backup to keep a copy or to move
        them to another TV.
      </p>
      <div className="row">
        <button className="a-btn a-btn-primary" onClick={download}>
          ⬇ Export backup
        </button>
        <button className="a-btn" onClick={() => input.current?.click()}>
          ⬆ Import backup
        </button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            try {
              await importBackup(await file.text());
              setMessage({ ok: true, text: 'Backup imported.' });
            } catch (err) {
              setMessage({ ok: false, text: err instanceof Error ? err.message : 'Import failed.' });
            }
          }}
        />
      </div>

      <h2>Reset</h2>
      <p className="muted">Replace all questions with the {SEED_QUESTIONS.length} built-in questions.</p>
      <div className="row">
        <button
          className="a-btn a-btn-danger"
          onClick={() => {
            if (!confirm('Replace all questions with the built-in questions?')) return;
            saveQuestions(SEED_QUESTIONS);
            setMessage({ ok: true, text: 'Built-in questions restored.' });
          }}
        >
          Restore built-in questions
        </button>
      </div>
      {message && <p className={message.ok ? 'ok' : 'error'}>{message.text}</p>}
    </section>
  );
}
