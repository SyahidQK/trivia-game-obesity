import { useState } from 'react';
import { clearLeaderboard, loadLeaderboard } from '../data/storage';

type Scope = 'today' | 'all';

export function LeaderboardTab() {
  const [scope, setScope] = useState<Scope>('today');
  const [version, setVersion] = useState(0);
  const entries = loadLeaderboard(scope);
  void version; // re-read after clearing

  return (
    <section>
      <p className="muted">
        The game's leaderboard resets every day at midnight (this device's time). Past days are kept here under
        "All days".
      </p>
      <div className="row between">
        <div className="segmented">
          {(['today', 'all'] as const).map((s) => (
            <button key={s} className={scope === s ? 'active' : ''} onClick={() => setScope(s)}>
              {s === 'today' ? 'Today' : 'All days'}
            </button>
          ))}
        </div>
        <button
          className="a-btn a-btn-danger"
          disabled={loadLeaderboard('all').length === 0}
          onClick={() => {
            if (!confirm('Delete ALL scores, including past days? This cannot be undone.')) return;
            clearLeaderboard();
            setVersion((v) => v + 1);
          }}
        >
          Clear all scores
        </button>
      </div>
      <h2>
        {entries.length} {scope === 'today' ? 'scores today' : 'scores in total'}
      </h2>
      <table className="card table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            <th>Correct</th>
            <th>Played</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.id}>
              <td>{i + 1}</td>
              <td>{e.name}</td>
              <td>{e.score.toLocaleString()}</td>
              <td>
                {e.correct}/{e.total}
              </td>
              <td>{new Date(e.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
