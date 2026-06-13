'use client';

import { useEffect, useState } from 'react';
import MatchdayCommentary from '@/components/MatchdayCommentary';

function Medal({ rank }) {
  if (rank === 1) return <span>🥇</span>;
  if (rank === 2) return <span>🥈</span>;
  if (rank === 3) return <span>🥉</span>;
  return <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{rank}</span>;
}

export default function SweepstakePage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentMatchday, setCurrentMatchday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function fetchSweepstake() {
      try {
        const res = await fetch('/api/sweepstake');
        if (!res.ok) throw new Error('Failed to fetch sweepstake data');
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
        setMatches(data.matches || []);

        // Find the most recent completed matchday
        const finishedMatches = (data.matches || []).filter(m => m.status === 'FINISHED');
        if (finishedMatches.length > 0) {
          const matchdays = finishedMatches
            .map(m => m.matchday)
            .filter(Boolean);
          const latest = Math.max(...matchdays);
          setCurrentMatchday(latest);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSweepstake();
  }, []);

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <span className="trophy">🏆</span>
          <div>
            <h1 className="site-title">Sweepstake</h1>
            <p className="site-subtitle">World Cup 2026</p>
          </div>
        </div>
      </header>

      <div className="content">
        {loading && <p className="state-msg">Calculating standings…</p>}
        {error && <p className="state-msg error">Could not load sweepstake: {error}</p>}

        {!loading && !error && (
          <>
            {currentMatchday && (
              <MatchdayCommentary
                matchday={currentMatchday}
                matches={matches}
                leaderboard={leaderboard}
              />
            )}

            <div className="sweep-table">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                const isExpanded = expanded === player.name;
                return (
                  <div key={player.name} className={`sweep-row ${rank <= 3 ? 'sweep-top' : ''}`}>
                    <div
                      className="sweep-main"
                      onClick={() => setExpanded(isExpanded ? null : player.name)}
                    >
                      <div className="sweep-rank">
                        <Medal rank={rank} />
                      </div>
                      <div className="sweep-name">{player.name}</div>
                      <div className="sweep-teams-preview">
                        {player.teams.join(' · ')}
                      </div>
                      <div className="sweep-points">{player.total}</div>
                      <div className="sweep-chevron">{isExpanded ? '▲' : '▼'}</div>
                    </div>

                    {isExpanded && (
                      <div className="sweep-detail">
                        {player.teamPoints.map(tp => (
                          <div key={tp.team} className="sweep-team-row">
                            <span className="sweep-team-name">{tp.team}</span>
                            <span className="sweep-team-pts">{tp.points} pts</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="sweep-scoring">
              <h3 className="sweep-scoring-title">Scoring</h3>
              <div className="sweep-scoring-grid">
                <span>Win</span><span>+3</span>
                <span>Draw</span><span>+1</span>
                <span>Round of 32</span><span>+5</span>
                <span>Round of 16</span><span>+5</span>
                <span>Quarter-final</span><span>+7</span>
                <span>Semi-final</span><span>+8</span>
                <span>Final</span><span>+10</span>
                <span>Win the Cup</span><span>+15</span>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}