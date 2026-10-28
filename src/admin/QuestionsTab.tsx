import { useState } from 'react';
import { deleteImage, loadQuestions, newId, saveImage, saveQuestions } from '../data/storage';
import type { Question } from '../types';
import { ImagePicker } from './ImagePicker';

const blank = (): Question => ({ id: newId(), statement: '', answer: 'myth', explanation: '' });

function QuestionForm({ initial, onSave, onCancel }: { initial: Question; onSave: (q: Question) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(initial);
  // Edited as free text so typing newlines works; split into a list on save.
  const [refsText, setRefsText] = useState((initial.references ?? []).join('\n'));
  const set = <K extends keyof Question>(key: K, value: Question[K]) => setDraft((d) => ({ ...d, [key]: value }));

  // Images are written to IndexedDB as soon as they're picked; clean up whichever one ends up unused.
  const dropIfTemp = (id: string | undefined) => {
    if (id && id !== initial.imageId) void deleteImage(id);
  };

  const save = () => {
    if (initial.imageId && initial.imageId !== draft.imageId) void deleteImage(initial.imageId);
    const references = refsText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    onSave({
      ...draft,
      statement: draft.statement.trim(),
      explanation: draft.explanation.trim(),
      references: references.length ? references : undefined,
    });
  };

  return (
    <form
      className="card form"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <label>
        Statement shown to the player
        <textarea required rows={3} maxLength={140} value={draft.statement} onChange={(e) => set('statement', e.target.value)} />
        <small>{draft.statement.length}/140 — keep it short so it reads well on the TV</small>
      </label>

      <div className="field">
        Correct answer
        <div className="segmented">
          {(['myth', 'fact'] as const).map((a) => (
            <button type="button" key={a} className={draft.answer === a ? 'active' : ''} onClick={() => set('answer', a)}>
              {a.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <label>
        Explanation (shown on the answer screen)
        <textarea rows={3} maxLength={220} value={draft.explanation} onChange={(e) => set('explanation', e.target.value)} />
      </label>

      <label>
        References (one per line — shown in small text under the explanation)
        <textarea rows={4} value={refsText} onChange={(e) => setRefsText(e.target.value)} />
      </label>

      <label>
        Time limit in seconds (leave empty to use the default)
        <input
          type="number"
          min={5}
          max={60}
          value={draft.timeLimit ?? ''}
          onChange={(e) => set('timeLimit', e.target.value ? Number(e.target.value) : undefined)}
        />
      </label>

      <div className="field">
        Answer screen image (optional — replaces the correct/wrong characters for this question)
        <ImagePicker
          imageId={draft.imageId}
          fallback=""
          onPick={async (url) => {
            dropIfTemp(draft.imageId);
            set('imageId', await saveImage(url));
          }}
          onClear={() => {
            dropIfTemp(draft.imageId);
            set('imageId', undefined);
          }}
        />
      </div>

      <div className="row end">
        <button
          type="button"
          className="a-btn"
          onClick={() => {
            dropIfTemp(draft.imageId);
            onCancel();
          }}
        >
          Cancel
        </button>
        <button type="submit" className="a-btn a-btn-primary">
          Save question
        </button>
      </div>
    </form>
  );
}

export function QuestionsTab() {
  const [questions, setQuestions] = useState(loadQuestions);
  const [editing, setEditing] = useState<Question | null>(null);

  const commit = (next: Question[]) => {
    setQuestions(next);
    saveQuestions(next);
  };

  const upsert = (q: Question) => {
    const exists = questions.some((x) => x.id === q.id);
    commit(exists ? questions.map((x) => (x.id === q.id ? q : x)) : [...questions, q]);
    setEditing(null);
  };

  const remove = (q: Question) => {
    if (!confirm(`Delete this question?\n\n"${q.statement}"`)) return;
    if (q.imageId) void deleteImage(q.imageId);
    commit(questions.filter((x) => x.id !== q.id));
  };

  const move = (i: number, delta: number) => {
    const next = [...questions];
    [next[i], next[i + delta]] = [next[i + delta], next[i]];
    commit(next);
  };

  if (editing) return <QuestionForm initial={editing} onSave={upsert} onCancel={() => setEditing(null)} />;

  return (
    <section>
      <div className="row between">
        <h2>{questions.length} questions</h2>
        <button className="a-btn a-btn-primary" onClick={() => setEditing(blank())}>
          + Add question
        </button>
      </div>
      {questions.length === 0 && <p className="muted">No questions yet. The game can't start until you add at least one.</p>}
      <ol className="q-list">
        {questions.map((q, i) => (
          <li key={q.id} className="card q-item">
            <span className={`tag ${q.answer}`}>{q.answer.toUpperCase()}</span>
            <div className="q-text">
              <strong>{q.statement}</strong>
              <span className="muted">
                {q.explanation || 'No explanation'}
                {q.timeLimit ? ` · ${q.timeLimit}s` : ''}
                {q.imageId ? ' · 🖼 image' : ''}
              </span>
            </div>
            <div className="q-actions">
              <button className="a-btn icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                ↑
              </button>
              <button className="a-btn icon" disabled={i === questions.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                ↓
              </button>
              <button className="a-btn" onClick={() => setEditing(q)}>
                Edit
              </button>
              <button className="a-btn a-btn-danger" onClick={() => remove(q)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
