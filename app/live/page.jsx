'use client';

import { useEffect, useState, useRef } from 'react';
import MatchCard from '@/components/MatchCard';

const POLL_INTERVAL = 30_000;
const LIVE_STATUSES = ['IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT'];

export default function LivePage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  async function fetchLive() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/matches?dateFrom=${today}&dateTo=${today}`);
      if (!res.ok) return;
      const data = await res.json();
      const live = (data.matches || []).filter(m => LIVE_STATUSES.includes(m.status));
      setMatches(live);
      setLastUpdated(new Date());
    } catch {
      // silently fail on polling errors
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLive();
    intervalRef.current = setInterval(fetchLive, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <span className="trophy">🔴</span>
          <div>
            <h1 className="site-title">Live Scores</h1>
            <p className="site-subtitle">
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                : 'Updating every 30 seconds'}
            </p>
          </div>
        </div>
      </header>

      <div className="content">
        {loading && <p className="state-msg">Checking for live matches…</p>}
        {!loading && matches.length === 0 && (
          <p className="state-msg">No matches in progress right now.<br/>Check back on match days!</p>
        )}
        {!loading && matches.length > 0 && (
          <div className="match-list">
            {matches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}