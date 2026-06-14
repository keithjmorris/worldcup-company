'use client';

import { useEffect, useState } from 'react';

export default function MatchdayCommentary({ matchday, matches, leaderboard }) {
  const [commentary, setCommentary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    if (!matchday || !matches?.length || !leaderboard?.length) {
      setLoading(false);
      return;
    }

    async function fetchCommentary() {
      try {
        const res = await fetch('/api/sweepstake/commentary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchday, matches, leaderboard }),
        });
        const data = await res.json();
        if (data.commentary) {
          setCommentary(data.commentary);
          setCached(data.cached);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchCommentary();
  }, [matchday, matches, leaderboard]);

  if (loading) {
    return (
      <div className="commentary-box">
        <p className="commentary-loading">📝 Generating matchday commentary…</p>
      </div>
    );
  }

  if (!commentary) return null;

  return (
    <div className="commentary-box">
      <button className="commentary-header" onClick={() => setOpen(!open)}>
        <div className="commentary-title-row">
          <span className="commentary-title">📝 Report — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          {!cached && <span className="commentary-new">New</span>}
        </div>
        <span className="commentary-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="commentary-body">
          {commentary.split('\n\n').map((para, i) => (
            <p key={i} className="commentary-para">{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}