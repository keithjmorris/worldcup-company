'use client';

import { useState } from 'react';

function CardIcon({ type }) {
  const colour = type === 'RED' ? '#dc2626' : type === 'YELLOW_RED' ? '#f97316' : '#eab308';
  return (
    <span style={{
      display: 'inline-block',
      width: 10, height: 14,
      background: colour,
      borderRadius: 2,
      marginRight: 5,
      verticalAlign: 'middle',
      flexShrink: 0,
    }} />
  );
}

export default function MatchDetails({ match }) {
  const [open, setOpen] = useState(false);

  const { homeTeam, awayTeam, goals, bookings, substitutions, venue, attendance, referees } = match;

  const homeGoals = goals?.filter(g => g.team?.id === homeTeam.id) || [];
  const awayGoals = goals?.filter(g => g.team?.id === awayTeam.id) || [];
  const homeBookings = bookings?.filter(b => b.team?.id === homeTeam.id) || [];
  const awayBookings = bookings?.filter(b => b.team?.id === awayTeam.id) || [];
  const homeSubs = substitutions?.filter(s => s.team?.id === homeTeam.id) || [];
  const awaySubs = substitutions?.filter(s => s.team?.id === awayTeam.id) || [];
  const referee = referees?.find(r => r.type === 'REFEREE');

  const hasData = goals?.length > 0 || bookings?.length > 0 || substitutions?.length > 0;

  if (!hasData) return null;

  return (
    <div className="match-details-wrapper">
      <button className="summary-btn" onClick={() => setOpen(!open)}>
        {open ? '▲ Hide details' : '▼ Match details'}
      </button>
      {open && (
        <div className="details-box">

          {/* Venue & attendance */}
          {venue && (
            <div className="details-meta">
              📍 {venue}{attendance ? ` · ${attendance.toLocaleString()} fans` : ''}
              {referee ? ` · Referee: ${referee.name}` : ''}
            </div>
          )}

          {/* Formations */}
          {(homeTeam.formation || awayTeam.formation) && (
            <div className="details-formations">
              <span>{homeTeam.shortName}: {homeTeam.formation || '—'}</span>
              <span>{awayTeam.shortName}: {awayTeam.formation || '—'}</span>
            </div>
          )}

          {/* Goals */}
          {goals?.length > 0 && (
            <div className="details-section">
              <div className="details-section-title">⚽ Goals</div>
              <div className="details-two-col">
                <div>
                  {homeGoals.map((g, i) => (
                    <div key={i} className="details-event">
                      <span className="event-minute">{g.minute}'</span>
                      <span>{g.scorer?.name}
                        {g.type === 'PENALTY' ? ' (pen)' : ''}
                        {g.type === 'OWN' ? ' (og)' : ''}
                        {g.assist ? <span className="event-assist"> ↳ {g.assist.name}</span> : ''}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  {awayGoals.map((g, i) => (
                    <div key={i} className="details-event">
                      <span className="event-minute">{g.minute}'</span>
                      <span>{g.scorer?.name}
                        {g.type === 'PENALTY' ? ' (pen)' : ''}
                        {g.type === 'OWN' ? ' (og)' : ''}
                        {g.assist ? <span className="event-assist"> ↳ {g.assist.name}</span> : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bookings */}
          {bookings?.length > 0 && (
            <div className="details-section">
              <div className="details-section-title">🟨 Cards</div>
              <div className="details-two-col">
                <div>
                  {homeBookings.map((b, i) => (
                    <div key={i} className="details-event">
                      <span className="event-minute">{b.minute}'</span>
                      <CardIcon type={b.card} />
                      <span>{b.player?.name}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {awayBookings.map((b, i) => (
                    <div key={i} className="details-event">
                      <span className="event-minute">{b.minute}'</span>
                      <CardIcon type={b.card} />
                      <span>{b.player?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Substitutions */}
          {substitutions?.length > 0 && (
            <div className="details-section">
              <div className="details-section-title">🔄 Substitutions</div>
              <div className="details-two-col">
                <div>
                  {homeSubs.map((s, i) => (
                    <div key={i} className="details-event">
                      <span className="event-minute">{s.minute}'</span>
                      <span>
                        <span className="sub-in">▲ {s.playerIn?.name}</span>
                        <span className="sub-out"> ▼ {s.playerOut?.name}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  {awaySubs.map((s, i) => (
                    <div key={i} className="details-event">
                      <span className="event-minute">{s.minute}'</span>
                      <span>
                        <span className="sub-in">▲ {s.playerIn?.name}</span>
                        <span className="sub-out"> ▼ {s.playerOut?.name}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}